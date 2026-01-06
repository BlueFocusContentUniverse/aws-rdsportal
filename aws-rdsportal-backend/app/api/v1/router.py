"""
API v1 Router
"""

from fastapi import APIRouter

from app.api.v1 import projects
from app.api.v1 import auth

router = APIRouter()

# 包含各个模块的路由
# 添加项目路由
router.include_router(projects.router)
# 添加认证路由
router.include_router(auth.router)
