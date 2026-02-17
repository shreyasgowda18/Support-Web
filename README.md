# Support & App Review Management Dashboard

Production-ready scaffold for a centralized Support & App Review Management platform with:
- Multi-account Gmail inbox workflow (`New -> Replied -> Resolved`)
- App review workflow (`New -> Replied`) for Play Store / App Store apps
- AI-assisted categorization, sentiment, and reply generation (editable + approval flow)
- Analytics, settings, unified inbox, RBAC, rate-limiting, and modular API architecture

## Stack
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Security foundations: Helmet, CORS policy, rate limiting, token encryption helpers, RBAC middleware

## First Run (copy/paste)

Run these from your local clone path (repository root):

```bash
cd /path/to/Support-Web
npm install
npm run dev
```

If that fails, try two terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

> Important: run `dev:backend` and `dev:frontend` **without a leading colon**.

Then open:
- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:4000/health`

## Alternative: Run services separately

```bash
# terminal 1
cd /path/to/Support-Web
npm run dev -w backend

# terminal 2
cd /path/to/Support-Web
npm run dev -w frontend
```

## Build & type-check

```bash
cd /path/to/Support-Web
npm run lint
npm run build
```

## Project Structure
- `frontend/` React dashboard UI
- `backend/` Express API with modular routes/services

## Notes
- Backend dev mode now uses `tsc` + `node --watch` (no `tsx`/`esbuild` dependency), to avoid Windows `esbuild.exe` install/spawn issues.
This repository includes a production-oriented scaffold and mock integrations for Gmail, Google Play, and App Store Connect APIs. Replace integration stubs with real API clients and persistent database providers for deployment.


## If the folder does not exist

If you do not have this project on your PC yet, clone it first:

```bash
git clone <YOUR_REPO_URL>
cd Support-Web
npm install
npm run dev
```

Tip: `/workspace/Support-Web` is only the path used in this cloud environment, not your local machine path.


## Troubleshooting

- If `npm install` fails with `403 Forbidden`, your network or company policy is blocking npm registry access.
- Verify registry: `npm config get registry`
- Clear proxy settings if misconfigured: `npm config delete http-proxy && npm config delete https-proxy`
- If your company uses a private registry, set/login to it before install.

- If you previously saw `esbuild.exe`/`tsx` install errors, pull latest and reinstall after clearing `node_modules` (PowerShell block below).

### Windows PowerShell cleanup commands (safe)

PowerShell does **not** support `rmdir /s /q` (that is CMD syntax). Use:

```powershell
cd D:\UnityProjects\Support
if (Test-Path .\node_modules) { Remove-Item .\node_modules -Recurse -Force }
if (Test-Path .\package-lock.json) { Remove-Item .\package-lock.json -Force }
npm cache clean --force
npm install
```

If `package-lock.json` does not exist, that is fine—skip deleting it.
