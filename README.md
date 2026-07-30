# Turnstile Identity API

Identity and access API: register, login, JWT (RS256), profile, users, and RBAC.

**Stack:** Node.js · Express · MongoDB (Mongoose) · Docker Compose for local Mongo

## Quick start

```bash
docker compose up -d
cp .env.example .env
npm install
mkdir -p keys
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem
npm run dev
```

Verify:

```bash
curl -s http://localhost:3000/health
# {"ok":true}
```

Default port: **3000**. Database: `identity_practice` (see `MONGO_URI` in `.env.example`).

## API overview

| Method | Path | Notes |
|--------|------|--------|
| GET | `/health` | Liveness |
| POST | `/api/auth/register` | Create user |
| POST | `/api/auth/login` | Returns access + refresh tokens |
| GET | `/api/auth/me` | Bearer token |
| GET | `/api/users` | Requires `admin:user:read` |
| GET | `/api/rbac/roles` | Requires `admin:role:assign` |
| POST | `/api/rbac/users/:id/roles` | Assign roles |

Details, curl examples, and status codes: **[docs/API.md](./docs/API.md)**.  
Implementation backlog: **[ROADMAP.md](./ROADMAP.md)**.

## Repo layout

- `src/` — Express app (`src/modules/identity/`)
- `keys/` — JWT PEM files (local only; not committed)
- `docs/` — API reference

## License

ISC
