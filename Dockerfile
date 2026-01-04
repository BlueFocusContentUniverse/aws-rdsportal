############################
# 1️⃣ Builder 阶段
############################
FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /build

# 安装系统依赖（uv + poetry 所需）
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# 只 COPY 依赖文件（用于 cache）
COPY aws-rdsportal-backend/pyproject.toml aws-rdsportal-backend/uv.lock ./

# 安装 uv CLI
RUN pip install --no-cache-dir uv \
    && uv pip install --system --no-cache -e .




############################
# 2️⃣ Runtime 阶段
############################
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# 运行时依赖（最小）
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# 拷贝 Python 运行环境
COPY --from=builder /usr/local /usr/local

# 拷贝应用代码（含前端）
COPY aws-rdsportal-backend/app ./app

# 拷贝 .env.development
COPY aws-rdsportal-backend/.env.development ./.env.development

EXPOSE 8080

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
