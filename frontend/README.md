# Frontend (React)

This folder contains the frontend React application.

## Quick start (Windows PowerShell)

```
cd frontend; npm install
npm run dev
```

Check `frontend/package.json` for available scripts. Common scripts for Vite-based projects:

- `npm run dev` — start dev server
- `npm run build` — create production build
- `npm run preview` — preview production build locally

## Environment variables
- If the project uses Vite, set `VITE_API_BASE_URL` in a `.env` file at project root or in `frontend/`.
- If the project uses Create React App, use `REACT_APP_API_URL` instead.

## Notes
- The app consumes the backend API; set the frontend API base URL to point to the backend (e.g. `http://localhost:3000`).
- Check `frontend/src/services/api.js` for how the API base URL is read.
# Truestate_frontend