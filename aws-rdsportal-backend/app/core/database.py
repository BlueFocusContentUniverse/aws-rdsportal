"""
数据库连接管理（单文件，双数据库，实习生友好版）
"""

from typing import Dict

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import Pool

from app.core.config import get_settings
from app.core.logging import get_logger

settings = get_settings()
logger = get_logger(__name__)

# =========================
# ORM Base（两个库共用即可）
# =========================

Base = declarative_base()

# =========================
# Engine 工厂
# =========================

def _create_engine(db_url: str, name: str):
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_size=20,
        max_overflow=40,
        pool_recycle=3600,
        pool_timeout=30,
        echo=False,
    )

    @event.listens_for(Pool, "checkout")
    def on_checkout(dbapi_conn, connection_record, connection_proxy):
        pool = engine.pool
        logger.debug(
            f"{name}_db_checkout",
            pool_size=pool.size(),
            checked_in=pool.checkedin(),
            checked_out=pool.checkedout(),
            overflow=pool.overflow(),
        )

    @event.listens_for(Pool, "checkin")
    def on_checkin(dbapi_conn, connection_record):
        pool = engine.pool
        logger.debug(
            f"{name}_db_checkin",
            pool_size=pool.size(),
            checked_in=pool.checkedin(),
            checked_out=pool.checkedout(),
            overflow=pool.overflow(),
        )

    return engine


# =========================
# 主库
# =========================

engine_main = _create_engine(
    settings.DATABASE_MAIN_URL,
    name="main",
)

SessionMain = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine_main,
)

def get_main_db():
    db = SessionMain()
    try:
        yield db
    finally:
        db.close()


# =========================
# Dev / 展示库
# =========================

engine_dev = _create_engine(
    settings.DATABASE_DEV_URL,
    name="dev",
)

SessionDev = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine_dev,
)

def get_dev_db():
    db = SessionDev()
    try:
        yield db
    finally:
        db.close()


# =========================
# 连接池状态（可选）
# =========================

def get_pool_status() -> Dict:
    return {
        "main": {
            "pool_size": engine_main.pool.size(),
            "checked_in": engine_main.pool.checkedin(),
            "checked_out": engine_main.pool.checkedout(),
            "overflow": engine_main.pool.overflow(),
        },
        "dev": {
            "pool_size": engine_dev.pool.size(),
            "checked_in": engine_dev.pool.checkedin(),
            "checked_out": engine_dev.pool.checkedout(),
            "overflow": engine_dev.pool.overflow(),
        },
    }
