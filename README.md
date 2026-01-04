# AWS RDS Portal

内部数据库管理工具，基于 FastAPI + Vite 构建。

---

## 环境要求

- Python >= 3.11
- Node.js >= 18
- pnpm / npm / yarn（前端依赖管理）
- uv 命令可用（Python 依赖管理）

---

## 后端依赖安装（Python）

1. **创建虚拟环境（可选）**

```bash
uv venv
uv sync
```

1. **配置本地环境文件**（开发 fallback）

在项目根目录创建 `.env.development`：

```env
DB_HOST="host"
DB_PORT="123456"
DB_USERNAME="user"
DB_PASSWORD="Password"
DB_NAME="name"
```

> ⚠️ 注意：密码中有特殊字符时请使用引号

------

## 前端依赖安装（Vite）

```bash
cd aws-rdsportal-frontend        
pnpm install       
```

------

## 启动项目

### 后端

```bash
cd aws-rdsportal-backend
python -m app.main:app
```

- 默认地址：`http://localhost:8000/docs`（FastAPI API 文档）

### 前端

```bash
cd aws-rdsportal-frontend
pnpm run dev
```

- 默认地址：`http://localhost:3000`

## 前端打包（生产模式）

```
cd aws-rdsportal-frontend
pnpm run build
```

- 打包输出在 `frontend/dist/`（默认 Vite 输出目录）
- 可将静态文件部署到 Nginx、S3 或后端静态路由

如果希望 FastAPI 直接提供前端静态文件，可以将 `dist` 目录挂载到 FastAPI 的静态文件路由中，例如：

------
## 构建Docker镜像
```shell
docker build -t rds_viewer .
```

## 后端配置管理

优先级：

1. **Secrets Manager / ECS 注入**（生产）
2. **AWS Parameter Store**（staging / 测试）
3. **本地 `.env` 文件**（开发 fallback）