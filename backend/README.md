# Backend

This backend uses Express, TypeScript, Sequelize, and PostgreSQL.

## Setup

1. Install dependencies.
2. Create `backend/.env`.
3. Add these values:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=your_postgres_connection_string
```

## Run

```bash
npm run dev
```

## Routes

- `GET /health` returns a simple health check response.
- `GET /env-test` confirms the runtime env variables are loaded.
- `GET /db-test` checks the PostgreSQL connection.

## Notes

- `DATABASE_URL` is required at startup. If it is missing, the app throws a clear error before Sequelize initializes.
- The app now runs `sequelize.sync()` on startup so the `users` table is created automatically if it does not exist.
