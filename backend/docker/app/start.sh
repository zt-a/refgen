#!/usr/bin/env bash
set -euo pipefail

ROLE=${1:-${APP_ROLE:-api}}
if [[ $# -gt 0 ]]; then
    shift
fi

wait_for_db() {
python <<'PY'
import asyncio
import os
import sys

import asyncpg

DB_USER = os.environ.get("DB_USER")
DB_PASS = os.environ.get("DB_PASS")
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = int(os.environ.get("DB_PORT", "5432"))
DB_NAME = os.environ.get("DB_NAME")


async def ensure_db():
    for attempt in range(30):
        try:
            conn = await asyncpg.connect(
                user=DB_USER,
                password=DB_PASS,
                host=DB_HOST,
                port=DB_PORT,
                database=DB_NAME,
            )
            await conn.close()
            print("Database connection established.")
            return
        except Exception as exc:  # noqa: BLE001
            wait_time = 2
            print(f"Database not ready ({exc}); retrying in {wait_time}s...")
            await asyncio.sleep(wait_time)

    print("Database not available after multiple attempts.", file=sys.stderr)
    raise SystemExit(1)


asyncio.run(ensure_db())
PY
}

run_api() {
    wait_for_db
    alembic upgrade head

    exec gunicorn -k uvicorn.workers.UvicornWorker \
        -w "${WEB_CONCURRENCY:-4}" \
        -b "0.0.0.0:${PORT:-8000}" \
        src.main:app
}

run_worker() {
    wait_for_db
    alembic upgrade head
    exec celery -A src.celery_app.celery_app worker --loglevel="${CELERY_LOG_LEVEL:-info}" "$@"
}

case "$ROLE" in
  api)
    run_api "$@"
    ;;
  worker)
    run_worker "$@"
    ;;
  *)
    exec "$ROLE" "$@"
    ;;
esac
