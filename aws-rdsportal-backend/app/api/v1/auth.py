import logging
import requests
from datetime import datetime
from fastapi import APIRouter, Request, HTTPException, status

from app.schemas.auth import LoginRequest, LoginSuccessResponse
from app.core.token_cache import set_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Auth"])

BLUE_CONVERSE_LOGIN_URL = "https://api.blue-converse.com/api/v1/auth/login"
TIMEOUT = 10


@router.post(
    "/login",
    response_model=LoginSuccessResponse,
    summary="用户登录",
    description="后端代理登录，调用 Blue-Converse 接口",
)
def login(payload: LoginRequest, request: Request):
    logger.info(f"Login attempt: {payload.username}")

    try:
        resp = requests.post(
            BLUE_CONVERSE_LOGIN_URL,
            json={
                "username": payload.username,
                "password": payload.password,
            },
            headers={"Content-Type": "application/json"},
            timeout=TIMEOUT,
        )
    except requests.RequestException:
        logger.exception("Auth service unreachable")
        raise HTTPException(
            status_code=502,
            detail="Auth service unavailable",
        )

    # ---------- 登录失败 ----------
    if resp.status_code != 200:
        try:
            error = resp.json()
        except Exception:
            error = {
                "error_code": "AUTH_FAILED",
                "message": "登录失败",
                "detail": resp.text,
            }

        error.update({
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "path": str(request.url.path),
            "request_id": None,
        })

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error,
        )

    # ---------- 登录成功 ----------
    data = resp.json()

    token_payload = {
        "access_token": data["access_token"],
        "id_token": data.get("id_token"),
        "refresh_token": data.get("refresh_token"),
        "token_type": data.get("token_type", "Bearer"),
        "expires_in": data.get("expires_in", 3600),
    }

    user_info = {
        "username": payload.username,
        "sub": data["user"]["sub"],
        "email": data["user"].get("email"),
        "phone_number": data["user"].get("phone_number"),
    }

    # 🔐 缓存 access_token 作为 key，ttl 为 expires_in
    set_token(
        token=token_payload["access_token"],
        user=user_info,
        ttl_seconds=token_payload["expires_in"],
    )

    logger.info(f"Login success: {payload.username}")

    return token_payload
