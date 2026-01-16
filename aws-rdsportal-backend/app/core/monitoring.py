"""
性能监控模块

提供以下功能：
- 请求延迟指标收集（P50/P95/P99）
- 数据库连接池监控
- AWS SDK 调用延迟追踪
- CloudWatch 指标上报（可选）
"""

import time
import asyncio
import statistics
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from functools import wraps
from threading import Lock
from typing import Dict, List, Optional, Callable, Any

from app.core.logging import get_logger

logger = get_logger(__name__)


# ========== 请求延迟指标收集器 ==========


@dataclass
class EndpointMetrics:
    """端点指标数据"""

    latencies: List[float] = field(default_factory=list)
    request_count: int = 0
    error_count: int = 0
    last_reset: datetime = field(default_factory=datetime.utcnow)

    def add_latency(self, latency_ms: float, is_error: bool = False):
        """添加延迟样本"""
        self.latencies.append(latency_ms)
        self.request_count += 1
        if is_error:
            self.error_count += 1
        # 保留最近 1000 个样本
        if len(self.latencies) > 1000:
            self.latencies = self.latencies[-1000:]

    def get_percentiles(self) -> Dict[str, Optional[float]]:
        """计算百分位延迟"""
        if not self.latencies:
            return {"p50": None, "p95": None, "p99": None, "avg": None, "min": None, "max": None}

        sorted_latencies = sorted(self.latencies)
        n = len(sorted_latencies)

        return {
            "p50": round(sorted_latencies[int(n * 0.50)], 2) if n > 0 else None,
            "p95": round(sorted_latencies[int(n * 0.95)], 2) if n > 0 else None,
            "p99": round(sorted_latencies[int(n * 0.99)], 2) if n > 0 else None,
            "avg": round(statistics.mean(sorted_latencies), 2) if n > 0 else None,
            "min": round(min(sorted_latencies), 2) if n > 0 else None,
            "max": round(max(sorted_latencies), 2) if n > 0 else None,
        }

    def reset(self):
        """重置指标"""
        self.latencies = []
        self.request_count = 0
        self.error_count = 0
        self.last_reset = datetime.utcnow()


class MetricsCollector:
    """全局指标收集器"""

    def __init__(self):
        self._endpoint_metrics: Dict[str, EndpointMetrics] = defaultdict(EndpointMetrics)
        self._aws_metrics: Dict[str, EndpointMetrics] = defaultdict(EndpointMetrics)
        self._lock = Lock()
        self._started_at = datetime.utcnow()

    def record_request(self, endpoint: str, latency_ms: float, status_code: int):
        """记录请求指标"""
        with self._lock:
            is_error = status_code >= 400
            self._endpoint_metrics[endpoint].add_latency(latency_ms, is_error)

    def record_aws_call(
        self, service: str, operation: str, latency_ms: float, success: bool = True
    ):
        """记录 AWS SDK 调用指标"""
        key = f"{service}.{operation}"
        with self._lock:
            self._aws_metrics[key].add_latency(latency_ms, not success)

    def get_endpoint_metrics(self) -> Dict[str, Any]:
        """获取所有端点指标"""
        with self._lock:
            result = {}
            for endpoint, metrics in self._endpoint_metrics.items():
                percentiles = metrics.get_percentiles()
                result[endpoint] = {
                    **percentiles,
                    "request_count": metrics.request_count,
                    "error_count": metrics.error_count,
                    "error_rate": (
                        round(metrics.error_count / metrics.request_count * 100, 2)
                        if metrics.request_count > 0
                        else 0
                    ),
                }
            return result

    def get_aws_metrics(self) -> Dict[str, Any]:
        """获取所有 AWS SDK 调用指标"""
        with self._lock:
            result = {}
            for key, metrics in self._aws_metrics.items():
                percentiles = metrics.get_percentiles()
                result[key] = {
                    **percentiles,
                    "call_count": metrics.request_count,
                    "error_count": metrics.error_count,
                }
            return result

    def get_summary(self) -> Dict[str, Any]:
        """获取指标摘要"""
        with self._lock:
            total_requests = sum(m.request_count for m in self._endpoint_metrics.values())
            total_errors = sum(m.error_count for m in self._endpoint_metrics.values())
            total_aws_calls = sum(m.request_count for m in self._aws_metrics.values())

            # 计算整体 P95
            all_latencies = []
            for m in self._endpoint_metrics.values():
                all_latencies.extend(m.latencies)
            all_latencies.sort()
            n = len(all_latencies)

            return {
                "uptime_seconds": (datetime.utcnow() - self._started_at).total_seconds(),
                "total_requests": total_requests,
                "total_errors": total_errors,
                "error_rate_percent": (
                    round(total_errors / total_requests * 100, 2) if total_requests > 0 else 0
                ),
                "overall_p50_ms": round(all_latencies[int(n * 0.50)], 2) if n > 0 else None,
                "overall_p95_ms": round(all_latencies[int(n * 0.95)], 2) if n > 0 else None,
                "overall_p99_ms": round(all_latencies[int(n * 0.99)], 2) if n > 0 else None,
                "total_aws_calls": total_aws_calls,
                "endpoints_tracked": len(self._endpoint_metrics),
                "aws_operations_tracked": len(self._aws_metrics),
            }

    def reset_all(self):
        """重置所有指标"""
        with self._lock:
            for metrics in self._endpoint_metrics.values():
                metrics.reset()
            for metrics in self._aws_metrics.values():
                metrics.reset()


# 全局单例
_metrics_collector: Optional[MetricsCollector] = None


def get_metrics_collector() -> MetricsCollector:
    """获取全局指标收集器"""
    global _metrics_collector
    if _metrics_collector is None:
        _metrics_collector = MetricsCollector()
    return _metrics_collector


# ========== AWS SDK 延迟追踪装饰器 ==========


def track_aws_latency(service: str, operation: str):
    """
    AWS SDK 调用延迟追踪装饰器

    用法:
        @track_aws_latency("cognito", "sign_in")
        async def sign_in(...):
            ...
    """

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            start = time.perf_counter()
            success = True
            try:
                result = await func(*args, **kwargs)
                return result
            except Exception:
                success = False
                raise
            finally:
                latency_ms = (time.perf_counter() - start) * 1000
                get_metrics_collector().record_aws_call(service, operation, latency_ms, success)
                # 记录慢调用
                if latency_ms > 1000:
                    logger.warning(
                        "slow_aws_call",
                        service=service,
                        operation=operation,
                        latency_ms=round(latency_ms, 2),
                    )

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            start = time.perf_counter()
            success = True
            try:
                result = func(*args, **kwargs)
                return result
            except Exception:
                success = False
                raise
            finally:
                latency_ms = (time.perf_counter() - start) * 1000
                get_metrics_collector().record_aws_call(service, operation, latency_ms, success)

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper

    return decorator


# ========== 连接池监控 ==========


class ConnectionPoolMonitor:
    """数据库连接池监控"""

    def __init__(self, interval_seconds: int = 60):
        self.interval_seconds = interval_seconds
        self._running = False
        self._task: Optional[asyncio.Task] = None
        self._history: List[Dict[str, Any]] = []
        self._max_history = 60  # 保留最近 60 个采样点

    async def start(self):
        """启动监控任务"""
        if self._running:
            return
        self._running = True
        self._task = asyncio.create_task(self._monitor_loop())
        logger.info("connection_pool_monitor_started", interval=self.interval_seconds)

    async def stop(self):
        """停止监控任务"""
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("connection_pool_monitor_stopped")

    async def _monitor_loop(self):
        """监控循环"""
        from app.core.database import get_pool_status

        while self._running:
            try:
                status = get_pool_status()
                status["timestamp"] = datetime.utcnow().isoformat()

                # 计算使用率
                total = status.get("pool_size", 0) + status.get("max_overflow", 0)
                used = status.get("checked_out", 0) + status.get("overflow", 0)
                utilization = round(used / total * 100, 2) if total > 0 else 0
                status["utilization_percent"] = utilization

                self._history.append(status)
                if len(self._history) > self._max_history:
                    self._history = self._history[-self._max_history :]

                # 记录日志
                logger.info(
                    "connection_pool_status",
                    checked_in=status.get("checked_in"),
                    checked_out=status.get("checked_out"),
                    overflow=status.get("overflow"),
                    utilization_percent=utilization,
                )

                # 告警：使用率超过 80%
                if utilization > 80:
                    logger.warning(
                        "connection_pool_high_utilization",
                        utilization_percent=utilization,
                        checked_out=status.get("checked_out"),
                        overflow=status.get("overflow"),
                    )

            except Exception as e:
                logger.error("connection_pool_monitor_error", error=str(e))

            await asyncio.sleep(self.interval_seconds)

    def get_history(self) -> List[Dict[str, Any]]:
        """获取历史记录"""
        return list(self._history)

    def get_current(self) -> Optional[Dict[str, Any]]:
        """获取当前状态"""
        return self._history[-1] if self._history else None


# 全局连接池监控器
_pool_monitor: Optional[ConnectionPoolMonitor] = None


def get_pool_monitor() -> ConnectionPoolMonitor:
    """获取连接池监控器"""
    global _pool_monitor
    if _pool_monitor is None:
        _pool_monitor = ConnectionPoolMonitor(interval_seconds=60)
    return _pool_monitor


# ========== CloudWatch 指标上报 ==========


class CloudWatchReporter:
    """CloudWatch 指标上报器"""

    def __init__(self, namespace: str = "UserBackend", enabled: bool = False):
        self.namespace = namespace
        self.enabled = enabled
        self._client = None

    def _get_client(self):
        """懒加载 CloudWatch 客户端"""
        if self._client is None and self.enabled:
            import boto3
            from botocore.config import Config

            config = Config(
                max_pool_connections=5,
                connect_timeout=5,
                read_timeout=10,
            )
            from app.core.config import get_settings

            settings = get_settings()
            self._client = boto3.client(
                "cloudwatch", region_name=settings.AWS_REGION, config=config
            )
        return self._client

    async def put_metrics(self, metrics: List[Dict[str, Any]]):
        """上报指标到 CloudWatch"""
        if not self.enabled:
            return

        client = self._get_client()
        if not client:
            return

        try:
            metric_data = []
            for m in metrics:
                metric_data.append(
                    {
                        "MetricName": m["name"],
                        "Value": m["value"],
                        "Unit": m.get("unit", "Count"),
                        "Dimensions": m.get("dimensions", []),
                    }
                )

            await asyncio.to_thread(
                client.put_metric_data, Namespace=self.namespace, MetricData=metric_data
            )
            logger.debug("cloudwatch_metrics_sent", count=len(metrics))

        except Exception as e:
            logger.warning("cloudwatch_metrics_failed", error=str(e))

    async def report_request_metrics(self, collector: MetricsCollector):
        """上报请求指标"""
        if not self.enabled:
            return

        summary = collector.get_summary()
        metrics = [
            {"name": "RequestCount", "value": summary["total_requests"], "unit": "Count"},
            {"name": "ErrorCount", "value": summary["total_errors"], "unit": "Count"},
            {"name": "P95Latency", "value": summary["overall_p95_ms"] or 0, "unit": "Milliseconds"},
            {"name": "P99Latency", "value": summary["overall_p99_ms"] or 0, "unit": "Milliseconds"},
        ]

        await self.put_metrics(metrics)


# 全局 CloudWatch 上报器
_cloudwatch_reporter: Optional[CloudWatchReporter] = None


def get_cloudwatch_reporter() -> CloudWatchReporter:
    """获取 CloudWatch 上报器"""
    global _cloudwatch_reporter
    if _cloudwatch_reporter is None:
        from app.core.config import get_settings

        settings = get_settings()
        # 生产环境启用 CloudWatch
        enabled = settings.ENVIRONMENT == "production"
        _cloudwatch_reporter = CloudWatchReporter(namespace="UserBackend", enabled=enabled)
    return _cloudwatch_reporter
