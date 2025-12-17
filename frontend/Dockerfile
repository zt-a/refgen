# Stage 1: build the React app with Vite
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

# Allow overriding the API URL at build time: docker build --build-arg VITE_API_URL=https://api.example.com .
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
ENV NODE_ENV=production

RUN npm run build

# Stage 2: serve the compiled assets with nginx
FROM nginx:1.27-alpine

RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/certs && \
    openssl req -x509 -nodes -days 365 \
        -subj "/CN=localhost" \
        -newkey rsa:2048 \
        -keyout /etc/nginx/certs/tls.key \
        -out /etc/nginx/certs/tls.crt

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
