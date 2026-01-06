# app/core/token_cache.py

# app/core/token_cache.py
from datetime import datetime, timedelta
from typing import Optional

# token -> { user: {...}, expires_at: datetime }
_token_cache: dict[str, dict] = {}

def set_token(token: str, user: dict, ttl_seconds: int = 3600):
    """
    根据 access_token 缓存用户信息和过期时间
    """
    _token_cache[token] = {
        "user": user,
        "expires_at": datetime.utcnow() + timedelta(seconds=ttl_seconds),
    }

def get_token_by_token(token: str) -> Optional[dict]:
    """
    根据 access_token 查找缓存，过期则删除并返回 None，否则返回用户信息
    """
    entry = _token_cache.get(token)
    if not entry:
        return None

    if entry["expires_at"] < datetime.utcnow():
        # token 过期，删除缓存
        _token_cache.pop(token, None)
        return None

    return entry["user"]

