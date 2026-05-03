# BillCraft — Project Context

## Project Overview

BillCraft is a **freelance management web app** for creating invoices and contracts, tracking clients, and managing past generations (documents). Built as a 6th semester student group project (SGP) at CHARUSAT.

**Stack:** React (Vite) frontend · Node.js + Express backend · Deployed via Vercel (`vercel.json` present for frontend).

---

## Repository Structure

```
BillCraft/
├── frontend/          # React app (Vite)
├── backend/           # Node.js + Express API
│   └── src/
│       ├── server.js
│       └── routes/
│           ├── invoices.js       # PDF invoice
│           ├── invoiceWord.js    # Word invoice
│           ├── contracts.js      # PDF contract
│           └── contractWord.js   # Word contract
└── vercel.json        # Vercel frontend deployment config
```

---

## Frontend — Gist

**Tech:** React 19 · Vite · React Router v7 · Tailwind CSS · Material Symbols Outlined · Manrope/Pacifico fonts

**State:** `src/context/AppContext.jsx`
- `user`, `clients[]`, `generations[]`, `intendedDestination`, `sidebarCollapsed`
- Auth is simulated — `login()` hardcodes user `{ name: 'Vrushank', email: '23it032@charusat.edu.in' }`

---

## Backend — Gist

**Tech:** Node.js · Express · PDFKit · docx

Runs on port 4000. All routes accept JSON POST body and stream back a file download.

| Route | Output |
|---|---|
| POST `/api/invoices/download` | .pdf |
| POST `/api/invoices/word` | .docx |
| POST `/api/contracts/download` | .pdf |
| POST `/api/contracts/word` | .docx |

---

## Theme

| Token | Value |
|---|---|
| Background | `#0a0a0a` |
| Card/surface | `#1a1a1a` |
| Sidebar | `#111111` |
| Border | `#2a2a2a` |
| Accent green | `#22c55e` |
| Text primary | `#f5f5f5` |
| Text muted | `#a3a3a3` / `#888888` |
| Danger | `#ef4444` |
| Warning/Pending | `#f59e0b` |

---

## How to Run

```bash
# Backend (Terminal 1)
cd backend && npm install && npm start

# Frontend (Terminal 2)
cd frontend && npm install && npm run dev
```
