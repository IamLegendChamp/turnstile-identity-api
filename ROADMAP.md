# Roadmap

**Last updated:** 2026-07-30

## Status at a glance

| Area | State |
|------|--------|
| Core auth + RBAC routes | Done |
| MongoDB (Docker) + seed data | Done (maintained locally) |
| CORS for browser clients | Not done |
| Refresh / logout endpoints | Not done |
| HttpOnly cookie sessions | Out of scope |

## Done

- [x] `GET /health` → `{ "ok": true }`
- [x] `POST /api/auth/register` → 201 / 409
- [x] `POST /api/auth/login` → `{ accessToken, refreshToken }`
- [x] `GET /api/auth/me` (Bearer)
- [x] `GET /api/users` — requires `admin:user:read`
- [x] `GET /api/rbac/roles` — requires `admin:role:assign`
- [x] `POST /api/rbac/users/:id/roles` — body `{ "roles": [] }`
- [x] JWT RS256 keys in `keys/`
- [x] Permissions embedded in access token at login
- [x] `refreshTokenHash` stored on login (for future refresh/logout)
- [x] Docker MongoDB (`docker compose up -d`)

## Remaining

### High priority

- [ ] **CORS** — read `CORS_ORIGINS` from `.env`, handle OPTIONS preflight

### Nice-to-have

- [ ] **`POST /api/auth/refresh`** — verify refresh token, return new `accessToken`
- [ ] **`POST /api/auth/logout`** — clear `refreshTokenHash` on user
- [ ] **`GET /api/auth/me` includes `permissions`** in JSON body
- [ ] **`npm run seed`** — reproducible roles and test users in MongoDB

## Completion log

| Date | Item | Notes |
|------|------|-------|
| — | — | Add a row when items ship |
