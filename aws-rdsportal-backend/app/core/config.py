"""
应用配置管理（数据库相关）
支持：
- .env 文件
- AWS Parameter Store
- AWS Secrets Manager 注入的数据库环境变量
"""

import os
import urllib.parse
from pathlib import Path
from typing import Optional, List, Dict

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


# =========================
# Settings 定义
# =========================

class Settings(BaseSettings):
    # ===== 基础环境 =====
    ENVIRONMENT: str = Field(default="development")
    LOG_LEVEL: str = Field(default="INFO")

    # ===== AWS =====
    AWS_REGION: str = Field(default="us-west-2")
    USE_AWS_PARAMETER_STORE: bool = Field(default=False)

    # ===== APP =====
    PROJECT_NAME: str = Field(default="AWS RDS Portal Backend")
    ALLOWED_ORIGINS: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:8080",
        ]
    )

    # ===== Database URLs =====
    DATABASE_MAIN_URL: str = Field(default="")
    DATABASE_DEV_URL: str = Field(default="")

    # ===== Secrets Manager 注入字段 =====
    DB_HOST: str = Field(default="")
    DB_PORT: str = Field(default="5432")
    DB_USERNAME: str = Field(default="")
    DB_PASSWORD: str = Field(default="")
    DB_NAME: str = Field(default="postgres")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


_settings: Optional[Settings] = None


# =========================
# 工具函数
# =========================

def _build_db_url(
        host: str,
        port: str,
        username: str,
        password: str,
        db_name: str,
) -> str:
    encoded_password = urllib.parse.quote(password, safe="")
    return (
        f"postgresql://{username}:{encoded_password}"
        f"@{host}:{port}/{db_name}?sslmode=require"
    )


def _load_from_parameter_store(
        path: str,
        region: str,
) -> Dict[str, str]:
    from app.core.aws_params import load_parameters_from_aws_sync
    return load_parameters_from_aws_sync(path=path, region=region)


def _load_db_url(
        *,
        settings: Settings,
        ps_path: str,
        env_prefix: str,
) -> str:
    """
    统一数据库加载逻辑：
    1. Secrets Manager
    2. Parameter Store
    3. 本地 .env.{ENVIRONMENT}
    """

    # ---------- 1. Secrets Manager ----------
    if settings.DB_HOST and settings.DB_PASSWORD:
        print(f"[CONFIG] 使用 Secrets Manager 构建 {env_prefix} DATABASE_URL")
        return _build_db_url(
            settings.DB_HOST,
            settings.DB_PORT,
            settings.DB_USERNAME,
            settings.DB_PASSWORD,
            settings.DB_NAME,
        )

    # ---------- 2. Parameter Store ----------
    if settings.USE_AWS_PARAMETER_STORE:
        print(f"[CONFIG] 从 Parameter Store 读取 {ps_path}")
        params = _load_from_parameter_store(ps_path, settings.AWS_REGION)
        if params and "database_url" in params:
            return params["database_url"]

    # ---------- 3. 本地 env fallback ----------
    if settings.ENVIRONMENT in ("production", "staging"):
        raise RuntimeError(
            f"[CONFIG ERROR] {env_prefix} DATABASE_URL 未配置（禁止 fallback）"
        )

    base_dir = Path(__file__).resolve().parent.parent.parent
    env_file = base_dir / f".env.{settings.ENVIRONMENT}"

    if not env_file.exists():
        raise RuntimeError(
            f"[CONFIG ERROR] 本地配置文件不存在: {env_file}"
        )

    print(f"[CONFIG] 使用本地配置文件 {env_file}")
    from dotenv import load_dotenv
    load_dotenv(env_file, override=True)

    host = os.getenv(f"{env_prefix}_DB_HOST", os.getenv("DB_HOST", ""))
    username = os.getenv(f"{env_prefix}_DB_USERNAME", os.getenv("DB_USERNAME", ""))
    password = os.getenv(f"{env_prefix}_DB_PASSWORD", os.getenv("DB_PASSWORD", ""))
    port = os.getenv(f"{env_prefix}_DB_PORT", os.getenv("DB_PORT", "5432"))
    db_name = os.getenv(f"{env_prefix}_DB_NAME", os.getenv("DB_NAME", "postgres"))

    if not (host and username and password):
        raise RuntimeError(
            f"[CONFIG ERROR] 本地 env 缺少 {env_prefix}_DB_* 配置"
        )

    return _build_db_url(host, port, username, password, db_name)


# =========================
# 主入口
# =========================

def get_settings() -> Settings:
    global _settings

    if _settings is None:
        print("[CONFIG] 初始化 Settings")
        _settings = Settings()

        # ===== 主库 =====
        _settings.DATABASE_MAIN_URL = _load_db_url(
            settings=_settings,
            ps_path="/user-backend/",
            env_prefix="MAIN",
        )

        # ===== Dev 库 =====
        _settings.DATABASE_DEV_URL = _load_db_url(
            settings=_settings,
            ps_path="/user-backend-dev/",
            env_prefix="DEV",
        )

        print("[CONFIG] DATABASE_MAIN_URL =", _settings.DATABASE_MAIN_URL)
        print("[CONFIG] DATABASE_DEV_URL  =", _settings.DATABASE_DEV_URL)

    return _settings
