import os
import eureka_client
import logging

logger = logging.getLogger(__name__)


def register_with_eureka(port: int = None):
    if port is None:
        port = int(os.environ.get("SERVICE_PORT", 8084))
    eureka_server_url = os.environ.get(
        "EUREKA_SERVER_URL", "http://localhost:8761/eureka/"
    )
    service_ip = os.environ.get("SERVICE_IP", "localhost")
    service_name = os.environ.get("EUREKA_APP_NAME", "semantic-search-service")

    instance = eureka_client.ApplicationInstance(
        host=service_ip,
        port=port,
        endpoint="/",
        status_page_url=f"http://{service_ip}:{port}/",
        health_check_url=f"http://{service_ip}:{port}/",
        app=service_name,
        eureka_url=eureka_server_url,
    )

    eureka_client.register(instance)
    logger.info("Registered with Eureka at %s as %s", eureka_server_url, service_name)
    return instance
