"""
应用配置管理（仅数据库相关）
支持：
- .env 文件
- AWS Parameter Store
- AWS Secrets Manager 注入的数据库环境变量
"""

import os
import urllib.parse
from pathlib import Path
from typing import Optional, List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """应用配置"""

    # ===== 基础环境 =====
    ENVIRONMENT: str = Field(default="development", description="运行环境")
    LOG_LEVEL: str = Field(default="INFO", description="日志级别")

    # ===== AWS =====
    AWS_REGION: str = Field(default="us-west-2", description="AWS Region")
    USE_AWS_PARAMETER_STORE: bool = Field(
        default=False, description="是否从 AWS Parameter Store 加载配置"
    )

    # Cognito - 使用默认空值，在 get_settings() 中验证
    COGNITO_USER_POOL_ID: str = Field(default="", description="Cognito User Pool ID")
    COGNITO_APP_CLIENT_ID: str = Field(default="", description="Cognito App Client ID")
    COGNITO_APP_CLIENT_SECRET: str = Field(
        default="", description="Cognito App Client Secret (可选)"
    )
    COGNITO_IDENTITY_POOL_ID: str = Field(
        default="", description="Cognito Identity Pool ID (用于获取 AWS 临时凭证)"
    )

    # ===== APP =====
    PROJECT_NAME: str = Field(default="AWS RDS Portal Backend", description="项目名称")
    ALLOWED_ORIGINS: List[str] = Field(
        default=[
            "https://pntqeuwnmfco.h5master.com",
            "http://localhost:3000",
            "http://localhost:8080",
        ],
        description="CORS 允许的源",
    )

    # DynamoDB + S3 (用于项目详情读取)
    DYNAMODB_PROJECTS_TABLE: str = Field(
        default="KoxProjects-stage74-dev", description="DynamoDB Projects 表名"
    )

    # ===== Database =====
    # 方式一：完整 DATABASE_URL（本地 / Parameter Store）
    DATABASE_URL: str = Field(default="", description="PostgreSQL 数据库连接 URL")

    # 方式二：Secrets Manager 注入（ECS / EKS 推荐）
    DB_HOST: str = Field(default="", description="数据库主机")
    DB_PORT: str = Field(default="5432", description="数据库端口")
    DB_USERNAME: str = Field(default="", description="数据库用户名")
    DB_PASSWORD: str = Field(default="", description="数据库密码")
    DB_NAME: str = Field(default="postgres", description="数据库名")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


# 全局配置实例（懒加载）
_settings: Optional[Settings] = None


def get_settings() -> Settings:
    """获取配置实例（懒加载）"""
    global _settings

    if _settings is None:
        print("[CONFIG] 初始化 Settings（env / .env）")
        _settings = Settings()

    print(
        "[CONFIG] 基础状态:",
        "ENVIRONMENT=", _settings.ENVIRONMENT,
        "USE_AWS_PARAMETER_STORE=", _settings.USE_AWS_PARAMETER_STORE,
    )

    # ===== 环境约束 =====
    if _settings.ENVIRONMENT in ("production", "staging"):
        if not _settings.USE_AWS_PARAMETER_STORE:
            raise RuntimeError(
                f"[CONFIG ERROR] ENVIRONMENT={_settings.ENVIRONMENT} "
                f"必须启用 USE_AWS_PARAMETER_STORE=true，禁止使用 .env"
            )

    # ===== Parameter Store =====
    if _settings.USE_AWS_PARAMETER_STORE:
        print("[CONFIG] 尝试从 AWS Parameter Store 加载数据库配置")

        from app.core.aws_params import load_parameters_from_aws_sync

        try:
            params = load_parameters_from_aws_sync(
                path="/user-backend/",
                region=_settings.AWS_REGION,
            )
            print("[PARAMETER STORE] 读取成功 :" + str(params))
            if not params:
                print("[PARAMETER STORE] 返回为空，没有读取到任何参数")
            else:
                print("[CONFIG] Parameter Store 返回 keys:", list(params.keys()))
                if "database_url" in params and params["database_url"]:
                    _settings.DATABASE_URL = params["database_url"]
                    print("[CONFIG] DATABASE_URL 已从 Parameter Store 设置")
                else:
                    print("[PARAMETER STORE] Parameter Store 中未找到有效的 database_url")
            if "dynamodb_projects_table" in params:
                _settings.DYNAMODB_PROJECTS_TABLE = params["dynamodb_projects_table"]

            cognito_params = load_parameters_from_aws_sync(
                path="/user-backend-dev/cognito/",
                region=_settings.AWS_REGION,
            )
            print("cognito_params : " + str(cognito_params))
            if "user_pool_id" in cognito_params:
                _settings.COGNITO_USER_POOL_ID = cognito_params["user_pool_id"]
            if "app_client_id" in cognito_params:
                _settings.COGNITO_APP_CLIENT_ID = cognito_params["app_client_id"]
            if "app_client_secret" in cognito_params:
                _settings.COGNITO_APP_CLIENT_SECRET = cognito_params["app_client_secret"]
            if "identity_pool_id" in cognito_params:
                _settings.COGNITO_IDENTITY_POOL_ID = cognito_params["identity_pool_id"]

        except Exception as e:
            # ✅ 直接打印 AWS 调用失败信息，不抛 RuntimeError
            print("[PARAMETER STORE] 读取失败:", repr(e))
            import traceback
            traceback.print_exc()


    # ===== Secrets Manager 构建 DATABASE_URL（优先级最高）=====
    if _settings.DB_HOST and _settings.DB_PASSWORD:
        print("[CONFIG] 检测到 Secrets Manager 注入的 DB_HOST / DB_PASSWORD")

        encoded_password = urllib.parse.quote(_settings.DB_PASSWORD, safe="")
        _settings.DATABASE_URL = (
            f"postgresql://{_settings.DB_USERNAME}:{encoded_password}"
            f"@{_settings.DB_HOST}:{_settings.DB_PORT}/{_settings.DB_NAME}"
            f"?sslmode=require"
        )

        print("[CONFIG] DATABASE_URL 已由 Secrets Manager 构建")

    else:
        print(
            "[CONFIG] Secrets Manager 条件未满足:",
            "DB_HOST=", bool(_settings.DB_HOST),
            "DB_PASSWORD=", bool(_settings.DB_PASSWORD),
        )
    # ===== 最终兜底 / 校验 =====
    if not _settings.DATABASE_URL:
        print("[CONFIG WARNING] DATABASE_URL 仍为空，准备进入 fallback 逻辑")

        # 生产 / 预发环境禁止 fallback
        if _settings.ENVIRONMENT in ("production", "staging"):
            raise RuntimeError(
                "[CONFIG ERROR] DATABASE_URL 未配置。"
                "生产 / 预发环境必须通过 Parameter Store 或 Secrets Manager 提供"
            )

        BASE_DIR = Path(__file__).resolve().parent.parent.parent
        env_file = BASE_DIR / f".env.{_settings.ENVIRONMENT}"

        if not env_file.exists():
            raise RuntimeError(
                f"[CONFIG ERROR] DATABASE_URL 未配置，且本地配置文件不存在：{env_file}"
            )

        print(f"[CONFIG WARNING] 使用本地配置文件 {env_file}")

        from dotenv import load_dotenv

        load_dotenv(env_file, override=True)

        # ========== 1. 数据库参数兜底 ==========
        # 只补字段，不重建 Settings
        _settings.DB_HOST = _settings.DB_HOST or os.getenv("DB_HOST", "")
        _settings.DB_PORT = _settings.DB_PORT or os.getenv("DB_PORT", "5432")
        _settings.DB_USERNAME = _settings.DB_USERNAME or os.getenv("DB_USERNAME", "")
        _settings.DB_PASSWORD = _settings.DB_PASSWORD or os.getenv("DB_PASSWORD", "")
        _settings.DB_NAME = _settings.DB_NAME or os.getenv("DB_NAME", "postgres")

        print(
            "[CONFIG] Fallback DB 字段:",
            "DB_HOST=", bool(_settings.DB_HOST),
            "DB_USERNAME=", bool(_settings.DB_USERNAME),
            "DB_PASSWORD=", bool(_settings.DB_PASSWORD),
        )

        if not (_settings.DB_HOST and _settings.DB_USERNAME and _settings.DB_PASSWORD):
            raise RuntimeError(
                "[CONFIG ERROR] 本地 .env 缺少 DB_HOST / DB_USERNAME / DB_PASSWORD"
            )

        encoded_password = urllib.parse.quote(_settings.DB_PASSWORD, safe="")
        _settings.DATABASE_URL = (
            f"postgresql://{_settings.DB_USERNAME}:{encoded_password}"
            f"@{_settings.DB_HOST}:{_settings.DB_PORT}/{_settings.DB_NAME}"
            f"?sslmode=require"
        )

        print("[CONFIG] DATABASE_URL 已由本地 .env fallback 构建")

        # ========== 2. Cognito 参数兜底 ==========
        # 从同一个环境文件读取 Cognito 参数
        cognito_params = {
            "user_pool_id": os.getenv("COGNITO_USER_POOL_ID"),
            "app_client_id": os.getenv("COGNITO_APP_CLIENT_ID"),
            "app_client_secret": os.getenv("COGNITO_APP_CLIENT_SECRET"),
            "identity_pool_id": os.getenv("COGNITO_IDENTITY_POOL_ID"),
        }

        # 赋值到 settings 中
        if "user_pool_id" in cognito_params and cognito_params["user_pool_id"]:
            _settings.COGNITO_USER_POOL_ID = cognito_params["user_pool_id"]
            print(f"[CONFIG] Fallback COGNITO_USER_POOL_ID: {_settings.COGNITO_USER_POOL_ID}")
        if "app_client_id" in cognito_params and cognito_params["app_client_id"]:
            _settings.COGNITO_APP_CLIENT_ID = cognito_params["app_client_id"]
            print(f"[CONFIG] Fallback COGNITO_APP_CLIENT_ID: {_settings.COGNITO_APP_CLIENT_ID}")
        if "app_client_secret" in cognito_params and cognito_params["app_client_secret"]:
            _settings.COGNITO_APP_CLIENT_SECRET = cognito_params["app_client_secret"]
            print(f"[CONFIG] Fallback COGNITO_APP_CLIENT_SECRET: ******")  # 隐藏敏感信息
        if "identity_pool_id" in cognito_params and cognito_params["identity_pool_id"]:
            _settings.COGNITO_IDENTITY_POOL_ID = cognito_params["identity_pool_id"]
            print(f"[CONFIG] Fallback COGNITO_IDENTITY_POOL_ID: {_settings.COGNITO_IDENTITY_POOL_ID}")

        # 可选：校验关键 Cognito 参数（如果你的业务必须要有）
        required_cognito_params = ["user_pool_id", "app_client_id"]
        missing_cognito_params = [p for p in required_cognito_params if not cognito_params.get(p)]
        if missing_cognito_params:
            print(f"[CONFIG WARNING] 本地 .env 缺少 Cognito 参数: {missing_cognito_params}")
            # 如果是必须的参数，可取消下面注释抛出异常
            # raise RuntimeError(f"[CONFIG ERROR] 本地 .env 缺少 Cognito 参数: {missing_cognito_params}")
    print("[CONFIG] 最终 DATABASE_URL =", _settings.DATABASE_URL)
    print("_setting :", _settings)
    return _settings
