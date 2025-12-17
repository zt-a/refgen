from celery import Celery

from src.config import settings
import src.tasks

celery_app = Celery(
    "worker",
    broker=settings.celery.broker_url,
    backend=settings.celery.backend_url,
    include=["src.tasks.essay"],
)

celery_app.conf.task_routes = {
    "tasks.*": {"queue": "refagent"},
}

celery_app.conf.task_default_queue = "refagent"
celery_app.conf.task_default_exchange = "refagent"
celery_app.conf.task_default_routing_key = "refagent"
celery_app.conf.task_default_exchange_type = "direct"
celery_app.conf.task_default_priority = 1
