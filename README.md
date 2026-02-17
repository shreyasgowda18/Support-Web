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

Run these from the repository root:

```bash
cd /workspace/Support-Web
npm install
npm run dev
```

Then open:
- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:4000/health`

## Alternative: Run services separately

```bash
# terminal 1
cd /workspace/Support-Web
npm run dev -w backend

# terminal 2
cd /workspace/Support-Web
npm run dev -w frontend
```

## Build & type-check

```bash
cd /workspace/Support-Web
npm run lint
npm run build
```

## Project Structure
- `frontend/` React dashboard UI
- `backend/` Express API with modular routes/services

## Notes
This repository includes a production-oriented scaffold and mock integrations for Gmail, Google Play, and App Store Connect APIs. Replace integration stubs with real API clients and persistent database providers for deployment.
