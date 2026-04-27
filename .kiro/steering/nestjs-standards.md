---
inclusion: always
---

# NestJS Handbook Standards

This project follows the **NestJS Developer Guidelines** (Organization Standard).

## Architecture
- Monorepo: `apps/` for deployable apps, `libs/` for shared code
- Headless API-first design — no frontend coupling
- Feature-based module structure under `apps/api/src/modules/`

## Non-Negotiable Rules
- **No `any`** — use `unknown`, typed DTOs, or interfaces
- **No `console.log`** — use `AppLogger` from `libs/utils`
- **No `process.env` direct access** — always use `ConfigService`
- Controllers = thin layer only (no business logic)
- Services = business logic only (no direct DB calls)
- Repositories = data access layer only
- Every API must have a DTO with validation

## API Design
- REST conventions: GET/POST/PATCH/DELETE on plural resource names
- Global prefix: `/v1`
- Standard response: `{ success: true, data: {} }`
- Error response: `{ success: false, message: "...", errorCode: "..." }`

## Shared Libraries
- `libs/common` — interceptors, filters, guards, decorators, pipes
- `libs/database` — DB module (TypeORM / Prisma / Drizzle)
- `libs/monitoring` — Prometheus metrics
- `libs/types` — shared TypeScript interfaces (frontend + backend)
- `libs/utils` — logger and helpers
