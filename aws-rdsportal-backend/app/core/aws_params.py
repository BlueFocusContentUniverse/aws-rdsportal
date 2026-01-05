"""
AWS Parameter Store 参数加载器
"""

from typing import Dict

import boto3
import structlog

logger = structlog.get_logger(__name__)


from typing import Dict
import boto3
import logging



def load_parameters_from_aws_sync(
        path: str = "/user-backend-dev/",
        region: str = "us-west-2",
) -> Dict[str, str]:
    print(f"[SSM] param path : {path}")
    print(f"[SSM] region     : {region}")

    ssm = boto3.client("ssm", region_name=region)
    parameters: Dict[str, str] = {}

    try:
        # 👉 先尝试当「目录」读
        response = ssm.get_parameters_by_path(
            Path=path,
            Recursive=True,
            WithDecryption=True,
        )

        # 如果目录下有参数
        if response.get("Parameters"):
            print(f"[SSM] detected path parameters ({len(response['Parameters'])})")

            for param in response["Parameters"]:
                name = (
                    param["Name"]
                    .replace(path, "")
                    .lstrip("/")
                    .replace("/", "_")
                )
                value = param["Value"]
                parameters[name] = value
                print(f"[SSM] {name} = {value}")

            logger.info(
                "aws_params_loaded_by_path",
                path=path,
                region=region,
                param_count=len(parameters),
            )
            return parameters

        # 👉 如果目录下是空的，说明它可能是「单个参数」
        print("[SSM] no parameters under path, trying get_parameter")

        single = ssm.get_parameter(
            Name=path,
            WithDecryption=True,
        )

        key = path.split("/")[-1]
        value = single["Parameter"]["Value"]
        parameters[key] = value

        print(f"[SSM] {key} = {value}")

        logger.info(
            "aws_param_loaded_single",
            name=path,
            region=region,
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
