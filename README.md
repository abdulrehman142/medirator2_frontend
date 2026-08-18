# Medirator 2.0 — Frontend

React UI for the **AI hospital knowledge assistant**. Users sign in with Google, chat in **Medibot**, browse the knowledge base, and submit complaints. All clinical answers come from the companion backend (keyword RAG + Gemini).

**Live:** https://medirator2.netlify.app  
**Backend repo:** https://github.com/abdulrehman142/medirator2_backend

Synthetic data only · not for real PHI or clinical decisions.

---

## What this app does

| Feature | Description |
|---------|-------------|
| **Landing / hero** | Scroll-scrubbed canvas frames + product copy |
| **Google auth** | `@react-oauth/google` → backend verifies ID token → JWT stored for API calls |
| **Medibot** | Category tiles (patients / medicines / inventory / instruments) + chat |
| **Structured cards** | SOAP, medicine, inventory, instrument panels (`#eaeae8` / black text) |
| **Data Explorer** | Browse synthetic KB categories via API |
| **Complaints** | Multipart form → backend (+ optional FormSubmit email) |

---

## Tech stack — what & why

| Technology | Why |
|------------|-----|
| **React 19 + TypeScript** | Typed UI, component model for chat + cards |
| **Vite** | Fast dev server and production builds for Netlify |
| **Tailwind CSS v4** | Utility styling for the dark product UI |
| **React Router 7** | Public pages + protected `/medibot`, `/data`, `/profile` |
| **`@react-oauth/google`** | Official Google Sign-In / ID token in the browser |
| **Fetch + cookies / Bearer** | Talks to FastAPI with `credentials: "include"` and JWT in `localStorage` |

### Typography

| Font | Class | Use |
|------|-------|-----|
| Eczar | `font-eczar` | Brand wordmark |
| IBM Plex Mono | `font-ibm-plex-mono` | Default UI |
| Jersey 10 | `font-jersey` | Hero / footer display |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              Frontend  (Netlify / Vite :5173)                  │
│                                                              │
│  GoogleAuthButton ──► Google Identity Services               │
│         │                     │                              │
│         │ ID token            │                              │
│         ▼                     │                              │
│  AuthContext ── POST /auth/google ─────────────────────┐     │
│       │                                                │     │
│       ▼                                                │     │
│  Medibot ── POST /query ───────────────────────────────┤     │
│  DataExplorer ── GET /data/{category} ─────────────────┤     │
│  Complaints ── POST /complaints ───────────────────────┤     │
│  Cards: PatientSOAP · MedicineCard · Inventory · Instrument  │
└────────────────────────────────────────────────────────┼─────┘
                                                         │ HTTPS
                                                         ▼
                                              Backend (Render / FastAPI)
                                              Keyword RAG + Gemini
```

```
User question
    │
    ▼
api.ts  →  POST {API}/query  { query, category? }
    │
    ▼
Backend retrieves JSON rows + calls Gemini
    │
    ▼
Medibot renders SOAP / medicine / inventory / instrument card
         + Confidence % · model name
```

---

## Project structure

```
frontend/
├── public/
│   ├── black-frames/          # Hero scroll frames
│   └── medimages/             # Icons / brand images
├── src/
│   ├── api/api.ts             # Backend HTTP client
│   ├── components/
│   │   ├── GoogleAuthButton.tsx
│   │   ├── PatientSOAP.tsx
│   │   ├── MedicineCard.tsx
│   │   ├── InventoryPanel.tsx
│   │   ├── InstrumentPanel.tsx
│   │   ├── ScrollAnimation.tsx
│   │   ├── Complaints.tsx
│   │   ├── Navbar.tsx / Footer.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/AuthContext.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Medibot.tsx
│   │   ├── Login.tsx / Register.tsx
│   │   ├── DataExplorer.tsx
│   │   └── About / FAQs / HowItWorks / …
│   ├── types/types.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
└── vite.config.ts
```

---

## Setup (local)

### Prerequisites

- Node.js 18+ (20+ recommended)
- Backend running (local or https://medirator2-backend.onrender.com)
- Google OAuth **Web** client ID (same value as backend `GOOGLE_CLIENT_ID`)

### Install & run

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

For production backend while developing UI:

```env
VITE_API_URL=https://medirator2-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

```bash
npm run dev
```

Open **http://localhost:5173**

### Google Cloud Console

Authorized JavaScript origins (frontend only — **not** the backend URL):

- `http://localhost:5173`
- `https://medirator2.netlify.app`

---

## Deploy (Netlify)

| Setting | Value |
|---------|--------|
| Repo | `medirator2_frontend` |
| Build command | `npm install && npm run build` |
| Publish directory | `dist` |

**Environment variables (required at build time):**

| Key | Example |
|-----|---------|
| `VITE_API_URL` | `https://medirator2-backend.onrender.com` |
| `VITE_GOOGLE_CLIENT_ID` | same Google web client ID |

After changing env vars, **Clear cache and deploy** so Vite bakes them into the bundle.

---

## Design decisions

**Why Vite + React?** Fast local UX and simple static hosting on Netlify.  
**Why Google in the browser?** Familiar sign-in; backend still verifies the ID token (frontend never trusts itself for auth).  
**Why structured cards?** Backend returns category JSON; cards make SOAP / doses / stock readable instead of a wall of text.  
**Why Bearer token in `localStorage`?** Cross-site Netlify → Render cookies are fragile; login response token + `Authorization` header works reliably with CORS.

---

## Companion services

| Service | URL |
|---------|-----|
| Backend API | https://medirator2-backend.onrender.com |
| Backend repo | https://github.com/abdulrehman142/medirator2_backend |
| Frontend live | https://medirator2.netlify.app |
