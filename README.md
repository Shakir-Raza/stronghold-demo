# Stronghold Business Suite — Demo

Frontend demo for **Stronghold Pakistan** (post-tensioning / construction subcontractor).

All 10 modules: Dashboard, Customers, Vendors, Transactions, Loans, Assets, Spreadsheet, Documents, Reports, Settings.  
Light/dark theme. Seeded with realistic PKR (Crore) project data.

---

## 1. Run locally in VS Code (PowerShell)

### Prerequisites
- [Node.js 18+](https://nodejs.org/) (LTS)
- [VS Code](https://code.visualstudio.com/)
- PowerShell (built into Windows)

### Steps

```powershell
# 1. Open the project folder in VS Code
code path\to\stronghold-demo

# 2. In VS Code terminal (Ctrl+` ) — make sure shell is PowerShell
# File → Preferences → Terminal → Default Profile: Windows PowerShell

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev
```

Browser opens at `http://localhost:5173`.

### Useful PowerShell commands

```powershell
# If execution policy blocks npm scripts
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

# Clear install and retry
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install

# Production build (output in dist/)
npm run build
npm run preview
```

---

## 2. Project structure

```
stronghold-demo/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx              # entry
│   ├── index.css             # Tailwind
│   └── StrongholdDemo.jsx    # full app (all modules + seed data)
└── README.md
```

---

## 3. Supabase integration patterns

Keep the UI; swap seed arrays for API calls. Recommended shape:

### Tables (Postgres)

```sql
-- parties (customers + vendors)
create table parties (
  id text primary key,
  kind text check (kind in ('customer','vendor')),
  name text not null,
  type text,
  project text,
  contact_person text,
  phone text,
  email text,
  address text,
  status text default 'Active',
  paid_total numeric default 0,
  outstanding numeric default 0,
  active_loans int default 0,
  created_at timestamptz default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  party_id text references parties(id),
  type text check (type in ('credit','debit')),
  amount numeric not null,
  balance numeric,
  description text,
  reference text,
  txn_date date not null,
  created_at timestamptz default now()
);

create table loans (
  id text primary key,
  party_id text references parties(id),
  kind text,
  principal numeric,
  paid numeric default 0,
  remaining numeric,
  interest text,
  next_payment text,
  due_date text,
  status text,
  created_at timestamptz default now()
);

create table assets (
  id text primary key,
  name text,
  category text,
  value numeric,
  status text,
  location text,
  purchase_date text,
  serial text
);

-- optional: documents, loan_payments, etc.
```

### Client setup

```bash
npm install @supabase/supabase-js
```

```js
// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

`.env` (never commit):

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Fetch pattern (replace seed arrays)

```js
// Example: load customers
const { data, error } = await supabase
  .from("parties")
  .select("*")
  .eq("kind", "customer")
  .order("name");

// Insert transaction + update outstanding in one flow (RPC or two calls)
const { error: e1 } = await supabase.from("transactions").insert({ ... });
await supabase.from("parties").update({ outstanding: newBalance }).eq("id", partyId);
```

### Optional Flask API layer

If you prefer not to call Supabase from the browser:

```
React (Vite)  →  Flask API (Railway)  →  Supabase Postgres
```

Flask uses the **service role** key server-side; the SPA only talks to your API.

---

## 4. Railway deployment

### A. Frontend only (static)

1. Push repo to GitHub.
2. [railway.app](https://railway.app) → New Project → Deploy from GitHub.
3. Add service → select this repo.
4. Settings:
   - **Build command:** `npm run build`
   - **Start command:** `npx serve -s dist -l $PORT`  
     (or use Railway’s static site / Nixpacks auto-detect)
5. Add env vars if using Supabase: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`  
   (rebuild after changing Vite env vars).

```powershell
# From project root, after linking Railway CLI
npm i -g @railway/cli
railway login
railway init
railway up
```

### B. Frontend + Flask API on Railway

Typical layout:

```
/
├── frontend/     # this Vite app
└── backend/      # Flask
    ├── app.py
    ├── requirements.txt
    └── Procfile    # web: gunicorn app:app
```

- Two Railway services in one project (or monorepo with two deploy roots).
- Frontend `VITE_API_URL` → Flask public URL.
- Flask holds Supabase service key; SPA never sees it.

`requirements.txt` example:

```
flask
flask-cors
gunicorn
supabase
python-dotenv
```

---

## 5. Demo notes

- Amounts are in **Rs Crore** (`fmtCr`).
- Theme toggle in top bar and Settings.
- Spreadsheet: click Qty/Rate cells — Amount and TOTAL recalculate.
- Reports and Dashboard totals are derived from the same seed data so they reconcile.

When you wire Supabase, keep the same field names so components need minimal changes.
