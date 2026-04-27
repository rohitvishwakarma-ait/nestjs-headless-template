# NestJS Headless API

Monorepo — NestJS headless API with Prometheus metrics and Grafana dashboards.

---

## Running everything

### Option A — Docker Compose (recommended)

Starts the API, Prometheus, and Grafana in one command.

```bash
# 1. copy env file (only needed once)
cp .env.example .env

# 2. build and start all services
docker compose up --build
```

| Service    | URL                          | Credentials      |
|------------|------------------------------|------------------|
| NestJS API | http://localhost:3000/v1      | —                |
| Metrics    | http://localhost:3000/v1/metrics | —            |
| Prometheus | http://localhost:9090         | —                |
| Grafana    | http://localhost:3001         | admin / admin    |

Stop everything:
```bash
docker compose down
```

Stop and wipe volumes (resets Prometheus + Grafana data):
```bash
docker compose down -v
```

---

### Option B — Local dev (API only)

```bash
npm install
cp .env.example .env
npm run start:dev
```

API runs at `http://localhost:3000/v1`

---

## Grafana dashboard

The **NestJS API** dashboard is auto-provisioned on first start.

Open Grafana → Dashboards → NestJS → **NestJS API**

Panels:
- Request rate per route (req/s)
- Error rate (5xx) per route
- **P50 / P90 / P99 latency per route** (histogram buckets)
- Total request counter
- Node.js heap usage
- Event loop lag

---

## Prometheus queries (manual)

```promql
# Request rate by route
sum(rate(http_requests_total[1m])) by (method, route)

# P99 latency by route
histogram_quantile(0.99,
  sum(rate(http_request_duration_seconds_bucket[1m])) by (le, method, route)
)

# Error rate
sum(rate(http_requests_total{status_code=~"5.."}[1m])) by (route)
```

---

## Project structure

```
apps/
  api/src/
    modules/
      user/       # user CRUD
      product/    # product CRUD
    config/       # env validation, configuration loader
    app.module.ts
    main.ts

libs/
  common/         # interceptors, filters, guards, decorators, pipes
  database/       # DB module (plug in TypeORM / Prisma / Drizzle)
  monitoring/     # Prometheus metrics service + interceptor
  types/          # shared TypeScript interfaces
  utils/          # logger

docker/
  prometheus/prometheus.yml
  grafana/provisioning/
```
