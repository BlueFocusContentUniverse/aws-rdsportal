import logging
from datetime import datetime
from math import ceil

from fastapi import APIRouter, Depends, Query
from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_main_db,get_dev_db
from app.models.project import Project
from app.schemas.project import ProjectListResponse, ProjectResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/projects", tags=["Project"])
settings = get_settings()


# async def enrich_projects_with_user_info(projects: List[ProjectResponse], cognito_client) -> List[ProjectResponse]:
#     """
#     给每个项目行添加 username 和 phone_number（串行逐行查询）
#     """
#     # 初始化一个空列表用于存储处理后的项目
#     enriched_projects = []
#     aws_client = get_aws_clients()
#
#     # 逐行遍历项目列表，串行查询用户信息
#     for project in projects:
#         user_id = project.user_id
#         if not user_id:
#             project.username = None
#             project.phone_number = None
#             enriched_projects.append(project)
#             continue
#
#         # 逐行查询Cognito用户信息
#         user_info = await cognito_client.get_user_by_sub(user_id)
#         logger.info(f"查询用户ID {user_id} 的Cognito信息: {user_info}")
#
#         # 拼接用户名和手机号
#         if user_info:
#             attrs = user_info.get("Attributes", {})
#             project.username = attrs.get("name")  # 显示名
#             project.phone_number = attrs.get("phone_number")
#         else:
#             project.username = None
#             project.phone_number = None
#
#         # 获取任务ID
#         item = await aws_client.dynamodb_get_item(
#             table_name=settings.DYNAMODB_PROJECTS_TABLE,
#             pk=user_id,
#             sk=str(project.project_id)
#         )
#         videoTaskId=item.get("VideoTaskId")
#
#         # 根据任务ID 获取草稿ID和视频名称
#         # todo
#
#         # 将处理后的项目添加到结果列表
#         enriched_projects.append(project)
#
#     return enriched_projects


@router.get(
    "/list",
    response_model=ProjectListResponse,
    summary="分页获取项目列表",
    description="分页获取项目列表（内部使用），支持按用户ID、项目ID、时间段过滤",
)
async def list_projects(
        # 分页参数
        page: int = Query(1, ge=1, description="页码，从 1 开始"),
        page_size: int = Query(20, ge=1, le=100, description="每页数量"),
        # 新增查询过滤参数
        user_id: str = Query(None, description="用户ID，过滤指定用户的项目"),
        project_id: int = Query(None, description="项目ID，精准查询某个项目"),
        start_time: datetime = Query(None, description="开始时间（UTC），格式：2025-01-01T00:00:00"),
        end_time: datetime = Query(None, description="结束时间（UTC），格式：2025-12-31T23:59:59"),
        environment: str = Query(None, description="环境，过滤指定环境"),
        # 数据库依赖
        main_db: Session = Depends(get_main_db),
        dev_db: Session = Depends(get_dev_db),
):
    offset = (page - 1) * page_size

    # 构建查询条件
    if environment == "dev":
        db = dev_db
    else:
        db = main_db
    query = db.query(Project)

    # 1. 按项目ID过滤（精准匹配）
    if project_id:
        query = query.filter(Project.project_id == project_id)

    # 2. 按用户ID过滤（假设Project模型有user_id字段）
    if user_id:
        query = query.filter(Project.user_id == user_id)

    # 3. 按时间段过滤（假设按created_at字段筛选，可替换为update_at等）
    if start_time and end_time:
        query = query.filter(and_(
            Project.created_at >= start_time,
            Project.created_at <= end_time
        ))
    elif start_time:  # 只有开始时间：大于等于开始时间
        query = query.filter(Project.created_at >= start_time)
    elif end_time:  # 只有结束时间：小于等于结束时间
        query = query.filter(Project.created_at <= end_time)

    # 获取总数（过滤后的总数）
    total = query.count()

    # 获取当前页数据（保持排序和分页）
    items = (
        query
        .order_by(Project.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    # 转换为响应模型
    items = [
        ProjectResponse.model_validate(p)
        for p in items
    ]

    # 计算总页数
    total_pages = ceil(total / page_size) if page_size != 0 else 0

    return ProjectListResponse(
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages
    )
