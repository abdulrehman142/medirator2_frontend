# Medirator 2.0 — Step-by-Step Process (Updated)

This document explains **everything that happens** in the deployed app: Google auth, keyword retrieval, confidence, **Gemini** generation, UI cards, missing data, deploy layout, and where QLoRA fits (and does not).

**Important:** QLoRA and the confidence score are **not connected**. Confidence comes only from **keyword retrieval**. QLoRA is optional training and is **not** used in live chat.

---

## 1. What the product is

Medirator is a **deployed hospital knowledge Q&A app** (synthetic Houston data):

1. You sign in with Google on the frontend  
2. You ask about patients / medicines / inventory / instruments in Medibot  
3. Backend finds matching rows in local JSON (keyword RAG — no vector DB)  
4. **Gemini** answers using **only those rows** (optional Grok via `LLM_PROVIDER=grok`)  
5. UI shows a structured card (SOAP, medicine, inventory, instrument)

Synthetic data only · tokenized PII · not for real clinical decisions.

---

## 2. Deployed pieces

| Piece | Where | Job |
|-------|--------|-----|
| Frontend | https://medirator2.netlify.app (Vite/React) | UI, Medibot, login |
| Backend | https://medirator2-backend.onrender.com (FastAPI) | Auth, RAG, data, complaints |
| LLM | Google Gemini API (`gemini-3.5-flash` default) | Structured generation |
| Knowledge base | `backend/data/*.json` on Render disk | 1,270 synthetic records |

Repos:

- Frontend: https://github.com/abdulrehman142/medirator2_frontend  
- Backend: https://github.com/abdulrehman142/medirator2_backend  

Local ports when developing: frontend `:5173`, backend `:8000`.

---

## 3. Knowledge base

| File | Count | Example |
|------|------:|---------|
| `data/patients.json` | 450 | Alex Rivera, SOAP fields, vitals, linked meds |
| `data/medicines.json` | 320 | Metformin dose, contraindications |
| `data/inventory.json` | 280 | N95 stock, location |
| `data/instruments.json` | 220 | Ultrasound maintenance |
| **Total** | **1,270** | Synthetic · Houston facility |

Each record has **keywords**. Sensitive IDs are **tokens** (`MRN-5000`), not real PHI.

---

## 4. Step-by-step: Google login

```
1. User opens https://medirator2.netlify.app/login
2. Clicks Google Sign-In (@react-oauth/google)
3. Google returns an ID token in the browser
4. Frontend → POST https://medirator2-backend.onrender.com/auth/google
   body: { "credential": "<google-id-token>" }
5. Backend verifies token with Google tokeninfo
   (audience must equal GOOGLE_CLIENT_ID)
6. Backend upserts user (role = "user")
7. Backend returns JWT + sets HTTP-only cookie (SameSite=None; Secure when COOKIE_CROSS_SITE=true)
8. Frontend stores JWT in localStorage as medirator_token
9. AuthContext sets user → navigate to /medibot
```

Later calls use `Authorization: Bearer <token>` (and cookies when possible).  
`GET /auth/me` runs **only if** a token exists (avoids noisy 401 when logged out).

**Google OAuth origins** (frontend only — **not** the Render backend URL):

- `http://localhost:5173`
- `https://medirator2.netlify.app`

**Files:** `GoogleAuthButton.tsx` · `AuthContext.tsx` · `backend/app/auth.py` · `routes/auth.py`

---

## 5. Step-by-step: Asking a question (RAG)

### Step A — UI

1. Optional: select category tile (Patients / Medicines / Inventory / Instruments)  
2. Type a question (see `test.txt` for demo queries)  
3. `Medibot.tsx` → `queryAssistant(text, selectedCategory)`  
4. `POST /query` `{ "query": "...", "category": "medicines" | null }`

### Step B — Category

`retriever.detect_category(query, explicit)`:

1. If sidebar category set → **force** that category  
2. Else score hint words (`soap`, `dose`, `ppe`, `ultrasound`, …)  
3. Else name heuristics (`metformin` → medicines)  
4. Default → `patients`

### Step C — Keyword retrieval (**confidence**)

```
1. Tokenize query; drop stopwords
2. For each record in category:
     +2.5 if token in keywords
     +1.0 if token in record text
     +0.5 substring hit
3. Keep top 2 (faster Gemini / fewer timeouts)
4. If nothing in category → search all categories
5. If still nothing → empty context
```

```text
confidence = min(1.0, best_score / 8.0)
```

UI: `Confidence {(confidence * 100)}%`  
= retrieval match strength · **not** Gemini quality · **not** QLoRA

### Step D — Generation (Gemini)

```
1. Empty context → "No matching records found…" (no LLM invent)
2. No API key → deterministic fallback from top JSON row
3. Else build category prompt (SOAP / medicine / inventory / instrument JSON schema)
4. System: reply JSON only; use only provided context
5. POST Gemini generateContent (model GEMINI_MODEL, default gemini-3.5-flash)
6. Parse JSON → summary + structured fields
7. On LLM failure → fallback structured answer (avoid bare 500s)
```

Optional: `LLM_PROVIDER=grok` uses xAI instead.

### Step E — UI cards

| Category | Component | Style |
|----------|-----------|--------|
| patients | `PatientSOAP` | `#eaeae8` bg, black text |
| medicines | `MedicineCard` | same |
| inventory | `InventoryPanel` | same |
| instruments | `InstrumentPanel` | same |

Footer: `Confidence X% · gemini-3.5-flash`

---

## 6. Successful chat diagram

```
You: "SOAP for Alex Rivera"  [Patients selected]
        │
        ▼
POST /query
        │
        ├─ category = patients
        ├─ score patients.json → P-1000 (high)
        ├─ confidence = min(1, score/8)  → e.g. 100%
        ├─ Gemini prompt + P-1000 context (top matches)
        ├─ JSON { subjective, objective, assessment, plan, summary }
        │
        ▼
Medibot: SOAP card + Confidence % · gemini-3.5-flash

QLoRA: not in this path
```

---

## 7. Wrong category selected

**Patients** selected + `Metformin dosage…`

1. Search `patients.json` first  
2. Patient on Metformin may win → SOAP (awkward for a pure dose question)  
3. Or zero patient hits → search all → medicines → Medicine card  

No tile selected → auto-detect from words like `metformin` / `dose`.

---

## 8. Data not in the knowledge base

```
Unknown topic / fake ID
  → no keyword hits
  → empty context
  → "No matching records found in the local knowledge base."
  → confidence 0%
```

Weak shared words (`houston`, `patient`) can still retrieve loosely related rows.

---

## 9. Confidence summary

| Question | Answer |
|----------|--------|
| Who computes it? | `retriever.py` |
| Formula | `min(1.0, best_score / 8.0)` |
| Related to Gemini quality? | **No** |
| Related to QLoRA? | **No** |
| 100% | Strong keyword match |
| 0% | Nothing retrieved |

---

## 10. QLoRA (optional — not live)

| Path | Role |
|------|------|
| `finetune/data/train.jsonl` | Training pairs |
| `finetune/data/eval.jsonl` | Eval pairs |
| `finetune/train_qlora.py` | Needs CUDA |
| `finetune/evaluate_baseline.py` | No GPU |

Live chat uses **prompt + retrieve + Gemini**. QLoRA does not affect confidence.

---

## 11. Other flows

### Data Explorer
Protected `/data` → `GET /data/{category}`

### Complaints
`POST /complaints` → store under `data/complaints/` (+ optional FormSubmit)

### Health
`GET /health` → `llm_provider`, `llm_configured`, `llm_reachable`, `llm_model`, KB counts

### Scroll hero
Home page canvas scrubbing `public/black-frames/`

---

## 12. Environment (deploy)

### Frontend (Netlify — build-time)

```env
VITE_API_URL=https://medirator2-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=<same as backend GOOGLE_CLIENT_ID>
```

Redeploy after changing env (Vite bakes values at build).

### Backend (Render)

```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=<AI Studio key>
GEMINI_MODEL=gemini-3.5-flash
GOOGLE_CLIENT_ID=<web client id>
JWT_SECRET=<long secret>
CORS_ORIGINS=https://medirator2.netlify.app
COOKIE_CROSS_SITE=true
```

Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`  
No database required.

---

## 13. Mental model

1. **Auth** — Google ID token → backend JWT (Bearer + cookie)  
2. **Retrieve** — keywords over JSON → top records + **confidence**  
3. **Generate** — Gemini fills category template from those records only  
4. **Render** — structured card in Medibot  
5. **QLoRA** — offline only; not in live path  

---

## 14. Demo queries

See **`test.txt`** in this repo for copy-paste examples (patients, medicines, inventory, instruments).
