"""
AWS Parameter Store 参数加载器
"""

import structlog

logger = structlog.get_logger(__name__)


from typing import Dict
import boto3


def load_parameters_from_aws_sync(
        path: str = "/user-backend/",
        region: str = "us-west-2",
) -> Dict[str, str]:
    print(f"[SSM] param path : {path}")
    print(f"[SSM] region     : {region}")

    ssm = boto3.client("ssm", region_name=region)
    parameters: Dict[str, str] = {}

    try:
        next_token = None

        while True:
            kwargs = {
                "Path": path,
                "Recursive": True,
                "WithDecryption": True,
            }
            if next_token:
                kwargs["NextToken"] = next_token

            response = ssm.get_parameters_by_path(**kwargs)

            for param in response.get("Parameters", []):
                name = (
                    param["Name"]
                    .replace(path.rstrip("/"), "")
                    .lstrip("/")
                    .replace("/", "_")
                )
                value = param["Value"]
                parameters[name] = value
                print(f"[SSM] {name} = {value}")

            next_token = response.get("NextToken")
            if not next_token:
                break

        logger.info(
            "aws_params_loaded_by_path",
            path=path,
            region=region,
            param_count=len(parameters),
        )
        return parameters

    except Exception as e:
        logger.error(
            "aws_params_load_failed",
            path=path,
            region=region,
            error=str(e),
        )
        print("[SSM] ERROR:", e)
        return {}



async def load_parameters_from_aws(
    path: str = "/user-backend-dev/database-url", region: str = "us-west-2"
    ) -> Dict[str, str]:
    print("param : " + path)
    print("region : " + region)
    """
    从 AWS Systems Manager Parameter Store 批量加载参数（异步版本）

    Note: boto3 本身不支持异步，这里使用 asyncio.to_thread 包装同步调用
    """
    import asyncio

    return await asyncio.to_thread(load_parameters_from_aws_sync, path, region)
