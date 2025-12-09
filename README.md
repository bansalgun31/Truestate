# Truestate

Monorepo for Truestate — a small project with a Node.js backend and a React frontend.

## Overview
- Backend: REST API (Node.js/Express) located in `backend/`.
- Frontend: React app located in `frontend/`.

## Prerequisites
- Node.js (v16+ recommended)
- npm (comes with Node.js)

## Quick start (Windows PowerShell)
1. Install dependencies for backend:

```
cd backend; npm install
```

2. Install dependencies for frontend:

```
cd frontend; npm install
```

3. Run both (in separate terminals):

```
cd backend; npm run dev

cd frontend; npm run dev
```

## Environment variables
- Backend: create a `.env` file in `backend/` with values for database and port. Typical keys: `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `PORT`.
- Frontend: if the frontend uses Vite set `VITE_API_BASE_URL`, or if CRA set `REACT_APP_API_URL`. Check `frontend/src` for the actual variable used by the app.

## Project structure
- `backend/` — Express app, controllers, services, routes, and utils.
- `frontend/` — React UI, components, hooks, and styles.

## Troubleshooting
- If `npm run dev` fails, check the terminal output for missing environment variables or port conflicts.
- Ensure Node.js version is compatible.

## Next steps
- Review `frontend/package.json` and `backend/package.json` for available scripts.
- Add CI, tests, and deployment instructions as needed.

---
If you want, I can also open the files and tailor the README with exact npm scripts and env variables detected from the codebase.
# Truestate
# Truestate
