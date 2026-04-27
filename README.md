# NestJS Headless API

A production-ready NestJS monorepo — headless REST API with PostgreSQL (TypeORM), Prometheus metrics, and Grafana dashboards.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20 |
| npm | >= 10 |
| Docker | >= 24 |
| Docker Compose | >= 2 |

---

## Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd nestjs-headless

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env
```

---

## Running the project

### Option A — Docker Compose (recommended)

Starts everything together: **API + PostgreSQL + Prometheus + Grafana**

```bash
docker compose up --build
```

On first boot TypeORM automatically creates the database tables from the entity definitions — no migration step needed in development.

| Service | URL | Credentials |
|---------|-----|-------------|
| NestJS API | http://localhost:3000/v1 | — |
| Metrics endpoint | http://localhost:3000/v1/metrics | — |
| PostgreSQL | localhost:5432 | nestjs / nestjs_pass |
| Prometheus | http://localhost:9090 | — |
| Grafana | http://localhost:3001 | admin / admin |

**Stop all services:**
```bash
docker compose down
```

**Stop and wipe all data (DB + Prometheus + Grafana volumes):**
```bash
docker compose down -v
```

---

### Option B — Local development (API only)

Requires a running PostgreSQL instance. Update `.env` with your local DB credentials.

```bash
# Install dependencies (if not done)
npm install

# Start in watch mode
npm run start:dev
```

API runs at `http://localhost:3000/v1`

---

## Environment variables

Copy `.env.example` to `.env` and adjust as needed.

```env
NODE_ENV=development
PORT=3000

# PostgreSQL
DB_HOST=postgres        # use 'localhost' for local dev
DB_PORT=5432
DB_USERNAME=nestjs
DB_PASSWORD=nestjs_pass
DB_NAME=nestjs_db

# Auth
JWT_SECRET=supersecretkey123
```

---

## API endpoints

All routes are prefixed with `/v1`.

### Users

```
GET     /v1/users           List all users
POST    /v1/users           Create a user
GET     /v1/users/:id       Get a user by ID
PATCH   /v1/users/:id       Update a user
DELETE  /v1/users/:id       Delete a user
```

### Products

```
GET     /v1/products        List all products
POST    /v1/products        Create a product
GET     /v1/products/:id    Get a product by ID
PATCH   /v1/products/:id    Update a product
DELETE  /v1/products/:id    Delete a product
```

### Quick test

```bash
# Create a user
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","role":"user"}'

# List users
curl http://localhost:3000/v1/users

# Create a product
curl -X POST http://localhost:3000/v1/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Widget","description":"A great widget","price":9.99}'
```

**Success response format:**
```json
{ "success": true, "data": {} }
```

**Error response format:**
```json
{ "success": false, "message": "User not found", "errorCode": "NOTFOUND" }
```

---

## Available scripts

```bash
npm run start:dev     # Start in watch mode (development)
npm run build         # Compile TypeScript to dist/
npm run start:prod    # Run compiled build
npm run lint          # Run ESLint with auto-fix
npm run test          # Run unit tests
npm run test:cov      # Run tests with coverage report
npm run test:e2e      # Run end-to-end tests
```

---

## Database

- **ORM:** TypeORM
- **Database:** PostgreSQL 16
- **Tables:** Created automatically from entity definitions when `NODE_ENV=development` (`synchronize: true`)
- **Production:** Set `NODE_ENV=production` — `synchronize` is disabled, use migrations instead

---

## Monitoring

The **NestJS API** Grafana dashboard is auto-provisioned on first start.

Open **http://localhost:3001** → Dashboards → NestJS → **NestJS API**

Dashboard panels:
- Request rate per route (req/s)
- Error rate (5xx) per route
- P50 / P90 / P99 latency per route
- Total request counter
- Node.js heap usage
- Event loop lag

**Useful Prometheus queries:**
```promql
# Request rate by route
sum(rate(http_requests_total[1m])) by (method, route)

# P99 latency by route
histogram_quantile(0.99,
  sum(rate(http_request_duration_seconds_bucket[1m])) by (le, method, route)
)

# Error rate (5xx)
sum(rate(http_requests_total{status_code=~"5.."}[1m])) by (route)
```

---

## Project structure

```
apps/
  api/src/
    modules/
      user/               # User CRUD (entity, service, controller, repository)
      product/            # Product CRUD
    config/               # Env validation (Joi), configuration loader
    app.module.ts
    main.ts

libs/
  common/                 # Shared: interceptors, filters, guards, decorators, pipes
  database/               # TypeORM DatabaseModule (shared DB connection)
  monitoring/             # Prometheus metrics service, interceptor, controller
  types/                  # Shared TypeScript interfaces (user, auth)
  utils/                  # AppLogger (structured JSON in prod, readable in dev)

docker/
  prometheus/
    prometheus.yml        # Scrape config — targets api:3000/v1/metrics
  grafana/
    provisioning/         # Auto-provisioned datasource + dashboard
```
