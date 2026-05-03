# BillCraft – Full Project Context File
> For AI agents / developers. Use this file to restore full project context.

---

## Project Identity
- **Name:** BillCraft
- **Tagline:** Freelancer Operations Management Platform
- **Team:** Urja Mehta (D24IT154) & Vrushank Ganatra (23IT032)
- **Stage:** Frontend complete — backend integrated (PDF + Word export)
- **Repo License:** MIT

---

## What BillCraft Does
A web app for freelancers to:
- Generate professional PDF invoices and download them locally
- Generate professional Word (.docx) invoices and download them locally
- Create freelance contracts as PDF or Word documents
- Track invoice payment status (Paid / Pending / Overdue)
- Manage clients

---

## Tech Stack

### Frontend
- React (Vite) — JavaScript variant
- React Router DOM v7
- Tailwind CSS v3
- No external animation libraries — CSS transitions only

### Backend
- Node.js + Express
- PDFKit (PDF generation)
- docx (Word document generation)
- CORS enabled for localhost:5173

---

## Folder Structure
```
BillCraft/
  frontend/               ← React + Vite project root
    src/
      components/         ← Sidebar.jsx
      pages/              ← one file per screen
      context/            ← AppContext.jsx
      data/               ← staticClients.js
      assets/             ← BillCraft_Logo.png
      App.jsx
      main.jsx
    tailwind.config.js
    postcss.config.js
    vite.config.js
    package.json

  backend/                ← Express API server
    src/
      server.js           ← Entry point, port 4000
      routes/
        invoices.js       ← POST /api/invoices/download  (PDF)
        invoiceWord.js    ← POST /api/invoices/word      (Word)
        contracts.js      ← POST /api/contracts/download (PDF)
        contractWord.js   ← POST /api/contracts/word     (Word)
    package.json
```

---

## Colour Scheme
> **Dark mode only — no theme toggle, no light mode.**

| Token | Value |
|---|---|
| Background | `#0a0a0a` |
| Sidebar | `#111111` |
| Card/Surface | `#1a1a1a` |
| Primary Text | `#f5f5f5` |
| Secondary Text | `#888888` |
| Border/Divider | `#2a2a2a` |
| Accent Green | `#22c55e` |
| Accent Hover | `#16a34a` |
| Danger/Delete/Logout | `#ef4444` |
| Status – Paid | `#22c55e` |
| Status – Pending | `#f59e0b` |
| Status – Overdue | `#ef4444` |

---

## Route Map
| Route | Screen |
|---|---|
| `/` | Splash Screen |
| `/home` | Home Screen |
| `/login` | Login Screen |
| `/signup` | Sign Up Screen |
| `/dashboard` | Dashboard |
| `/clients` | Clients |
| `/contract-builder` | Contract Builder |
| `/invoice-generator` | Invoice Generator |
| `/my-generations` | My Generations |
| `/profile` | Profile Screen |

---

## Completed Screens
All 9 screens are built and working:
1. ✅ Splash Screen
2. ✅ Home Screen
3. ✅ Login Screen
4. ✅ Sign Up Screen
5. ✅ Dashboard
6. ✅ Clients
7. ✅ Contract Builder
8. ✅ Invoice Generator
9. ✅ My Generations
10. ✅ Profile Screen

---

## Backend API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Server health check |
| POST | `/api/invoices/download` | Generate and download invoice as PDF |
| POST | `/api/invoices/word` | Generate and download invoice as Word (.docx) |
| POST | `/api/contracts/download` | Generate and download contract as PDF |
| POST | `/api/contracts/word` | Generate and download contract as Word (.docx) |

---

## AppContext (`src/context/AppContext.jsx`)
Manages global state:
- `user` — persisted to `localStorage` (mock user: name "Vrushank", email "23it032@charusat.edu.in")
- `clients` — list of all clients, deduplicated by email
- `generations` — list of all invoices and contracts
- `intendedDestination` — stores where to redirect after login
- `sidebarCollapsed` — persisted to `localStorage`
- `toggleSidebar()` — toggles sidebar state
- `login()` — sets mock user
- `logout()` — clears user and redirects to `/home`
- `addClient()` — deduplicates by email
- `updateClient()` — updates existing client
- `deleteClient()` — removes client, does NOT affect generations
- `addGeneration()` — adds new invoice/contract with default status Pending
- `updateGenerationStatus()` — manually updates status

---

## Sidebar Spec
- Expanded width: **180px** — DO NOT change this
- Collapsed width: **60px**
- Collapsible — toggle button is a small circular dark button at the top right edge of sidebar
- Nav order: Dashboard → Clients → Contract Builder → Invoice Generator → My Generations
- Bottom items: Edit Profile, Logout (red `#ef4444`)
- Active item: green background `#22c55e`

---

## How to Run
```bash
# Terminal 1 — backend
cd BillCraft/backend
npm install
npm start

# Terminal 2 — frontend
cd BillCraft/frontend
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend:  http://localhost:4000

---

## Pending Tasks
1. ⬜ Authentication — real JWT + bcrypt (currently mock)
2. ⬜ Database — PostgreSQL for persistent data
3. ⬜ Profile Screen — Save Changes must update AppContext + localStorage
4. ⬜ Input validation for every page
