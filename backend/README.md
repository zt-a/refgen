# RefGen AI Backend

RefGen AI is a FastAPI-based backend that automates the creation of academic essays and reference documents.  
It orchestrates OpenAI-powered agents that generate plan outlines, write the content for every section, and produce a formatted DOCX file ready for submission.

## Features
- FastAPI REST API with JWT authentication and profile management.
- Essay planning endpoint that splits the requested page count between introduction, chapters, conclusion, and references.
- Celery worker that asks OpenAI (via LangChain) to write every section with the required volume.
- DOCX exporter that assembles a title page, TOC, generated text, and bibliography using `python-docx`.
- PostgreSQL storage for essays, chapters, and metadata with async SQLAlchemy sessions.

## Tech Stack
- **Framework:** FastAPI, Pydantic v2
- **Database:** PostgreSQL + SQLAlchemy (async and sync engines)
- **Background jobs:** Celery + RabbitMQ
- **AI integration:** LangChain + OpenAI Chat API
- **Docs output:** python-docx

## Prerequisites
- Python 3.11+
- PostgreSQL 14+ with a database created for the app
- RabbitMQ (or compatible AMQP broker)
- OpenAI API key with access to the configured model
- RSA keypair for JWT (`certs/jwt-private.pem`, `certs/jwt-public.pem`)

## Setup
```bash
git clone <repo-url>
cd refgen_ai/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Configuration
Create a `.env` file in the project root (see `.env` for reference). Key variables:

| Variable | Description |
| --- | --- |
| `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT`, `DB_NAME` | PostgreSQL connection |
| `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND` | Celery broker/backend (RabbitMQ by default) |
| `OPENAI_API_KEY`, `MODEL_NAME`, `TEMPERATURE` | OpenAI credentials and model setup |
| `CHARS`, `FULL_CHARS`, `WORDS` | Per-page metrics used to convert pages into character limits |
| `JWT_ALGORITHM`, `ACCESS_TOKEN_EXPIRES_MINUTES`, `REFRESH_TOKEN_EXPIRES_DAYS` | Auth config |
| `SAVE_DIR` | Directory where generated DOCX files are stored (defaults to `saved_docs/`) |

> The app expects RSA keys under `certs/`. Generate them if you plan to issue tokens locally:
> ```bash
> openssl genrsa -out certs/jwt-private.pem 2048
> openssl rsa -in certs/jwt-private.pem -pubout -out certs/jwt-public.pem
> ```

## Running the services
Start your infrastructure (PostgreSQL, RabbitMQ), then launch the API and worker:

```bash
# Run FastAPI with Uvicorn
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

# In another terminal (same virtualenv)
celery -A src.celery_app.celery_app worker --loglevel=info
```

`src.main` calls `init_db()` on startup, so tables are auto-created based on the SQLAlchemy models.

## Docker deployment
A production-ready Compose stack (backend + worker + PostgreSQL + RabbitMQ + Redis + frontend) lives in the repository root as `docker-compose.prod.yml`.

1. Create the configuration file that will be shared by all backend containers:
   ```bash
   cd backend
   cp .env.docker.example .env.docker
   # fill in DB/OpenAI/JWT secrets, etc.
   ```
2. From the repo root, build and start the full stack (the flag feeds those variables both to Compose and to the containers):
   ```bash
   cd ..
   docker compose --env-file backend/.env.docker -f docker-compose.prod.yml up -d --build
   ```
3. Follow the logs when needed:
   ```bash
   docker compose --env-file backend/.env.docker -f docker-compose.prod.yml logs -f api worker frontend
   ```

What you get:
- `api`: FastAPI served by Gunicorn + Uvicorn workers. It waits for PostgreSQL, runs Alembic migrations automatically, and stores rendered DOCX files on the `saved_docs` named volume.
- `worker`: Celery worker based on the same image (entrypoint role switch via `docker/app/start.sh worker`).
- `frontend`: Vite build served by nginx (80/443) that proxies `/api` to the backend container. Mount real TLS certificates to `/etc/nginx/certs/tls.crt` and `/etc/nginx/certs/tls.key` in production; otherwise a self-signed pair baked into the image is used for smoke tests.
- `db`, `rabbitmq`, `redis`: PostgreSQL 15, RabbitMQ 3.12, and Redis 7. These services stay on the private `refgen` network and are not exposed to the host.

All containers share `.env.docker`, so keep it outside version control, rotate credentials, and prefer secrets managers for long-term deployments. When you need to reach auxiliary services (e.g., RabbitMQ management UI), tunnel through `docker compose exec` or expose the ports temporarily via an override compose file.

## Typical workflow
1. **Authenticate & fill profile** – most endpoints require `Authorization: Bearer <token>` and a complete profile (name, university, city, etc.).
2. **Generate a plan**
    ```http
    POST /api/v1/essays/plan/generate
    {
      "topic": "Программирование",
      "checked_by": "Учитель информатики",
      "subject": "Информатика",
      "page_count": 20,
      "chapters_count": 6,
      "language": "ru"
    }
    ```
    The backend distributes pages across sections, stores the plan, and returns the `essay_id`.
3. **Trigger content generation**
    ```http
    POST /api/v1/essays/{essay_id}/generate
    ```
    Celery picks up the job, calls the OpenAI agents, and fills the essay record.
4. **Poll status**
    ```http
    GET /api/v1/essays/{essay_id}/status
    ```
    Wait until the status becomes `GENERATED`.
5. **Download the DOCX**
    ```http
    GET /api/v1/refprint/{essay_id}
    ```
    The first request renders and caches a DOCX file under `saved_docs/`.

## Project structure
```
src/
├── auth/                # JWT auth, user services
├── routes/              # FastAPI routers (essay, refprint, profile)
├── refagent/            # OpenAI agents and helpers
├── refprint/            # DOCX builder utilities
├── tasks/               # Celery tasks (essay generation)
├── models/              # SQLAlchemy models
├── schemas/             # Pydantic schemas
└── main.py              # FastAPI entrypoint
```

## Development notes
- Run `ruff`/`black` (if added later) before committing to keep style consistent.
- Tests are not included; when adding features, prefer writing pytest suites under `tests/`.
- Long-running OpenAI calls happen inside Celery; keep API endpoints async and lightweight.

## Database migrations
- Alembic is configured under `alembic/` with `Base.metadata` as the source of truth.
- The default DSN in `alembic.ini` targets PostgreSQL (`postgresql+psycopg2`), but when you run `alembic ...` the URL is overridden automatically using values from `.env`. To point to a different database, export `ALEMBIC_DATABASE_URL`.
- Typical commands:
  - `alembic revision --autogenerate -m "message"` to create a new migration
  - `alembic upgrade head` to apply all migrations
  - `alembic downgrade -1` to revert the last migration
