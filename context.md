# BillCraft — Project Context

## Project Overview

BillCraft is a **freelance management web app** for creating invoices and contracts, tracking clients, and managing past generations (documents). Built as a 6th semester student group project (SGP) at CHARUSAT.

**Stack:** React (Vite) frontend · Python/FastAPI backend (unused in current frontend dev flow) · Deployed via Vercel (`vercel.json` present).

---

## Repository Structure

```
BillCraft/
├── frontend/          # React app (active dev)
├── backend/           # Python/FastAPI API (separate)
├── html-files/        # Original HTML mockups (source of truth for UI design)
├── vercel.json        # Vercel deployment config
└── context.md         # This file
```

---

## Frontend — Gist

**Tech:** React 18 · Vite · React Router v6 · Tailwind CSS · Material Symbols Outlined (Google icons) · Manrope font (body) · Pacifico font (logo/cursive)

**Entry:** `src/main.jsx` → `App.jsx` (router) → pages

**State:** Single global context via `src/context/AppContext.jsx`
- Stores: `user` (persisted to `localStorage`), `clients[]`, `generations[]`, `intendedDestination`
- Actions: `login`, `logout`, `addClient`, `updateClient`, `deleteClient`, `addGeneration`, `updateGenerationStatus`
- Auth is simulated — `login()` hardcodes user `{ name: 'Vrushank', email: '23it032@charusat.edu.in' }`

**Shared component:** `src/components/Sidebar.jsx`
- Fixed 260px left sidebar present on all authenticated pages
- Nav items: Dashboard · Clients · Contract Builder · Invoice Generator · My Generations
- Bottom user profile row with Edit Profile and Logout menu
- Handles page-transition fade overlay between routes

---

## Routes

| Path | Component | Notes |
|---|---|---|
| `/` | `SplashScreen` | Animated intro, auto-redirects |
| `/home` | `HomeScreen` | Public landing page |
| `/login` | `LoginScreen` | Split-panel with image left, form right |
| `/signup` | `SignUpScreen` | Same split-panel layout |
| `/dashboard` | `Dashboard` | Stats cards + recent generations table |
| `/clients` | `ClientScreen` | Full client table with search, edit/delete modals |
| `/contract-builder` | `ContractGenerator` | AI contract generation form |
| `/invoice-generator` | `InvoiceGenerator` | Invoice builder with line items |
| `/my-generations` | `MyGenerations` | History table of all invoices/contracts |
| `/profile` | `ProfileScreen` | Profile details + change password + danger zone |

> `Clients.jsx` and `ContractBuilder.jsx` are stub files — the real implementations are `ClientScreen.jsx` and `ContractGenerator.jsx`.

---

## Theme & Design System

| Token | Value |
|---|---|
| Background (base) | `#0a0a0a` |
| Background (card/surface) | `#1a1a1a` |
| Background (sidebar) | `#111111` |
| Border (default) | `#2a2a2a` / `#27272a` |
| Accent green | `#22c55e` |
| Text primary | `#f5f5f5` |
| Text secondary / muted | `#a3a3a3` |
| Text danger | `#ef4444` |
| Text warning | `#f59e0b` |

**Design language:**
- Full dark mode, no light surfaces
- Rounded cards (`rounded-xl`) with subtle `border` separators
- Accent green `#22c55e` used for: active nav, primary buttons, focus rings, table header text, status badges (paid/active)
- Status badges are colored pills: green (Paid/Active) · amber (Pending) · red (Overdue/Danger) · grey (Expired)
- Icons: Google Material Symbols Outlined throughout
- Page transitions: opacity fade (220–300 ms) via inline `style` on route entry/exit
- Sidebar fade overlay (200 ms) covers main content during navigation
- No scrollbars on main content areas (`.no-scrollbar`)

**Page anatomy (authenticated):**
1. Fixed `Sidebar` (260px left)
2. `<main>` offset `ml-[260px]`
3. Sticky `<header>` with page title (`text-3xl font-bold`) + subtitle (`text-slate-400`) + action buttons
4. Scrollable content body below header (tables, cards, forms)
5. Tables: green-tinted header row, `divide-y` body rows, green hover tint, pagination footer

**Auth/public pages** (Login, Signup): Split-panel — decorative image left (desktop only), form right; fade-in on mount, fade-out on navigate.
