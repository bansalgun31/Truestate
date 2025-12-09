# Backend (Node.js / Express)

This folder contains the backend API for Truestate.

## Quick start (Windows PowerShell)

```
cd backend; npm install
npm run dev
```

Check `backend/package.json` for available scripts. Common scripts:

- `npm run dev` — start development server (often using nodemon)
- `npm start` — start production server

## Environment variables
Create a `.env` file in `backend/` with the required values. Typical keys used by this project:

- `PORT` — port for the API (e.g. `3000`)
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` — database connection settings

See `backend/config/db.js` to confirm which variables are required and how the DB is configured.

## Structure
- `src/controllers/` — request handlers
- `src/models/` — data models
- `src/routes/` — route definitions
- `src/services/` — business logic
- `src/utils/` — utility scripts (imports, helpers)

## Troubleshooting
- If the server fails to start, check `.env` and database connectivity.
- Check logs printed to the terminal for stack traces.
