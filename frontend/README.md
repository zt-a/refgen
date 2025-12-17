# RefGen Frontend

React + TypeScript + Vite application that talks to the FastAPI backend through a JSON/REST API. This document describes how to run it locally and how to package it for production with Docker + nginx.

## Requirements

- Node.js 20+
- npm 10+

## Environment configuration

The frontend uses `import.meta.env.VITE_API_URL` to know where the backend lives.

| File | Purpose |
| --- | --- |
| `.env.example` | Copy to `.env` for local development. (Defaults to `http://127.0.0.1:8000`.) |
| `.env.development` | Loaded automatically when `npm run dev`. Override for local setups if needed. |
| `.env.production` | Loaded by `npm run build`. Defaults to `/api` so nginx can proxy requests on the same domain. |

You can override `VITE_API_URL` at build time: `VITE_API_URL=https://api.example.com npm run build`.

## Local development

```bash
cp .env.example .env   # or customize .env.development
npm install
npm run dev            # http://localhost:5173
```

## Manual production build

```bash
npm install
npm run build
npm run preview        # optional smoke-test of dist/
```

The compiled assets are placed in `dist/`. Serve that folder with any static server (nginx, S3, etc.) and make sure `/api` (or your chosen `VITE_API_URL`) is proxied to the FastAPI backend.

## Docker image (nginx + static files)

A multi-stage `Dockerfile` is available:

```bash
docker build \
  --build-arg VITE_API_URL=https://api.example.com \
  -t refgen-frontend:latest .

docker run -p 8080:80 refgen-frontend:latest
```

Stage 1 builds the React app, stage 2 serves it with nginx using `nginx.conf`. The server listens on 80/443, rewrites SPA routes (`try_files ... /index.html`) and proxies `/api` to the backend container named `api` on port `8000`. A self-signed certificate is generated during the build so HTTPS works out of the box; mount real certificates at runtime to `/etc/nginx/certs/tls.crt` and `/etc/nginx/certs/tls.key` for production.

## Full-stack Docker

Для продакшена теперь есть единый файл `../docker-compose.prod.yml`, который поднимает backend, worker, PostgreSQL, RabbitMQ, Redis и nginx-фронтенд в одной сети `refgen`.

```bash
cd ..                            # из папки frontend
cp backend/.env.docker.example backend/.env.docker
# заполни backend/.env.docker секретами

docker compose \
  --env-file backend/.env.docker \
  -f docker-compose.prod.yml \
  up -d --build
```

`VITE_API_URL` пробрасывается на этапе сборки через аргумент `VITE_API_URL` (по умолчанию `/api`). Чтобы прокинуть реальный TLS, смонтируй свои `tls.crt`/`tls.key` в контейнер `frontend` (`/etc/nginx/certs`). По умолчанию в образ вшит самоподписанный сертификат для smoke-тестов.

## Docker Compose (frontend only)

`docker-compose.yml` в директории `frontend` по-прежнему запускает **только фронтенд** (nginx + статические файлы). Бэкенд, БД, брокеры и воркеры остаются в своём проекте/compose. Чтобы фронт видел API, оба стека должны находиться в одной Docker-сети. Создай (или переиспользуй) сеть, например:

```bash
docker network create refgen    # однократно
```

Дальше запускай фронтенд:

```bash
FRONTEND_API_BASE=/api \
FRONTEND_HTTP_PORT=80 \
FRONTEND_HTTPS_PORT=443 \
BACKEND_NETWORK_NAME=refgen \
docker compose up --build -d
```

- `FRONTEND_API_BASE` задаёт URL API, который вшивается в build (оставь `/api`, если nginx фронта проксирует на контейнер API внутри той же сети).
- `FRONTEND_HTTP_PORT` / `FRONTEND_HTTPS_PORT` позволяют разместить nginx на других хост-портах при необходимости.
- `BACKEND_NETWORK_NAME` должен совпадать с сетью, где крутится твой backend compose (по умолчанию `refgen`). Если backend создаёт свою сеть автоматически, укажи её имя здесь.

Следи за тем, чтобы backend compose публиковал `/api` либо слушал `api:8000` на той же сети — тогда nginx фронта сможет прокинуть запросы.

To supply real TLS certificates create or mount files named `tls.crt` and `tls.key` into `/etc/nginx/certs` (for example via `docker compose -f docker-compose.yml -f docker-compose.prod.yml up` where the second file adds the bind mount). Without custom certs the container falls back to its self-signed pair—ideal for smoke tests but not browsers.

## Production checklist

1. Убедись, что backend stack уже работает (или хотя бы создана общая Docker-сеть `BACKEND_NETWORK_NAME`) и что он принимает трафик по `/api`.
2. Provide production-grade TLS certificates and mount them to the frontend container, or terminate TLS before traffic reaches Docker.
3. Double-check firewall rules: allow inbound 22/80/443 and deny everything else.
4. Run `docker compose up --build -d` from the `frontend` directory.
5. Tail logs with `docker compose logs -f frontend`.

With this setup nginx serves the built frontend over HTTPS, proxies `/api` to the FastAPI container, and all supporting infrastructure (DB/broker/cache/worker) stays on the internal Docker network.
