# API reference

**Base URL:** `http://localhost:3000`

## Authentication

Protected routes expect:

```http
Authorization: Bearer <accessToken>
```

Access tokens are RS256 JWTs issued at login. Permissions are embedded at login time; re-login after role changes if you rely on token claims.

## Endpoints

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/health` | — | `{ "ok": true }` |
| POST | `/api/auth/register` | — | Body: `{ "email", "password" }` → 201 / 409 |
| POST | `/api/auth/login` | — | `{ "accessToken", "refreshToken" }` |
| GET | `/api/auth/me` | Bearer | Current user profile |
| GET | `/api/users` | Bearer + `admin:user:read` | User list |
| GET | `/api/rbac/roles` | Bearer + `admin:role:assign` | Roles |
| POST | `/api/rbac/users/:id/roles` | Bearer + `admin:role:assign` | Body: `{ "roles": [] }` |

### Examples

```bash
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}'

curl -s http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

curl -s -X POST http://localhost:3000/api/rbac/users/USER_ID/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"roles":["platform_admin"]}'
```

## Status codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad input |
| 401 | Not authenticated |
| 403 | Forbidden (RBAC) |
| 409 | Conflict (e.g. duplicate email) |

## CORS

Browser clients on another origin need CORS enabled on this API. Server-to-server and `curl` are unaffected. Configure `CORS_ORIGINS` in `.env` when CORS middleware is added (see [ROADMAP.md](../ROADMAP.md)).
