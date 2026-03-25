# BillCraft – Full Project Context File
> For AI agents / developers. Use this file to restore full project context.

---

## Project Identity
- **Name:** BillCraft
- **Tagline:** Freelancer Operations Management Platform
- **Team:** Urja Mehta (D24IT154) & Vrushank Ganatra (23IT032)
- **Stage:** Frontend nearly complete — backend not started
- **Repo License:** MIT

---

## What BillCraft Does
A cloud-native web app for freelancers to:
- Generate professional PDF invoices automatically
- Create freelance contracts using templates (Contract Builder)
- Store documents securely on Amazon S3
- Track invoice payment status (Paid / Pending / Overdue)

---

## Tech Stack

### Frontend
- React (Vite) — JavaScript variant
- React Router DOM v6
- Tailwind CSS v3
- Axios
- No external animation libraries — CSS transitions only

### Backend (not started)
- Node.js + Express
- JWT authentication
- bcrypt (password hashing)
- PDFKit (PDF generation)

### Database
- Amazon RDS (PostgreSQL)

### AWS Services
1. EC2 – hosts backend
2. S3 – stores invoice & contract PDFs (private buckets, signed URLs, versioning enabled)
3. RDS – structured data (users, clients, invoices, contracts)
4. IAM – role-based access, no hardcoded keys
5. Lambda – daily check for overdue invoices
6. SNS – sends overdue reminder emails
7. CloudWatch – logs and monitoring

---

## Folder Structure
```
BillCraft/
  frontend/               ← React + Vite project root
    src/
      components/         ← Sidebar.jsx, Logo (not yet a component)
      pages/              ← one file per screen
      context/            ← AppContext.jsx
      assets/             ← BillCraft_-_Logo.png
      App.jsx             ← React Router setup
      main.jsx
    tailwind.config.js
    postcss.config.js
    vite.config.js
    package.json
  backend/                ← empty, not started
  screens-html/           ← original Google Stitch HTML design files
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

## Components Built
- `src/components/Sidebar.jsx` — shared across all post-login screens
- Logo is NOT a separate component — logo code is copied from `SplashScreen.jsx` into each page that needs it

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
- Toggle button: `#1a1a1a` background, `#2a2a2a` border, chevron icon, green border on hover
- Expanded: logo + nav labels + profile name/email visible
- Collapsed: icons only, logo hidden, no text visible anywhere
- Profile avatar click does nothing in collapsed state
- Nav order: Dashboard → Clients → Contract Builder → Invoice Generator → My Generations
- Bottom items: Edit Profile, Logout (red `#ef4444`)
- Active item: green background `#22c55e`
- All page content uses `marginLeft` that transitions between 180px and 60px

---

## Key Behaviours
- **Mock auth:** any email/password logs in as Vrushank. JWT to be wired to backend later
- **Clients:** auto-populated from Invoice Generator and Contract Builder form submissions. No manual Add Client button. Deduplicated by email
- **Client autocomplete:** Contract Builder and Invoice Generator email field suggests existing clients and pre-fills on selection
- **My Generations status:** dropdown per row — Pending, Paid, Overdue. Auto-flip to Overdue if due date has passed and status is still Pending
- **Dashboard Pending Payments:** count of all Pending + Overdue records combined
- **Deleting a client** does NOT delete their generations
- **Page transitions:** transparent fade/dissolve between Home → Login, no white flash
- **Login ↔ Signup:** only right panel animates, left panel stays completely still
- **Sidebar transitions:** smooth 300ms ease-in-out on width and page margin

---

## Pending Tasks (in order)
1. ⬜ Contracts page — display 9 contracts by default, make search workable
2. ⬜ Invoice Generator fixes:
   - Remove upload company logo
   - "Create new client" button in Bill To dropdown navigates to `/clients`
   - Remove copyright line in footer
   - Form elongates when items are added — no scrolling in small space
   - Rate and qty editable by keyboard, not arrow keys
   - Input validation
   - Rename Word button to "Save as Word" (green), rename Download PDF to "Download as PDF"
   - Make downloading functional
   - Save Draft button works — shows in My Generations
3. ⬜ Input validation for every page
4. ⬜ Backend — Node.js + Express REST API
5. ⬜ AWS integration — S3, RDS, Lambda, SNS, CloudWatch
6. ⬜ Profile Screen — Save Changes must actually update user in AppContext and localStorage

---

## General Copilot Prompt Template (HTML to React conversion)
> "Convert the attached HTML file into a React functional component. It should be a direct 1:1 conversion — the JSX output must be an exact copy of the HTML, just written in React syntax.
>
> Rules:
> - Copy the structure, layout, styles, colors, fonts, and every element exactly as they are in the HTML
> - Convert HTML attributes to JSX equivalents (e.g. class → className, for → htmlFor)
> - Keep all existing CSS classes unchanged
> - Use useNavigate from react-router-dom for any navigation/links
> - Use useApp from ../context/AppContext for any shared state
> - Copy the logo code exactly from SplashScreen.jsx
> - Use the exact same sidebar from src/components/Sidebar.jsx — import Sidebar active='[SCREEN NAME]'
> - Export as a default function named exactly [SCREEN NAME]
> - Save to src/pages/[SCREEN NAME].jsx
> - The HTML file may contain visual inconsistencies — identify and fix all of them
> - The final output must fully match the BillCraft theme — dark background #0a0a0a, surface #111111, card #1a1a1a, border #2a2a2a, text #f5f5f5, secondary text #888888, accent green #22c55e, danger red #ef4444
> - Match the page format and layout style of existing screens
>
> [ATTACH HTML FILE]"

---

## How to Run
```bash
cd BillCraft/frontend
npm run dev
```

---

## Notes for Next Agent
- Do not make the sidebar collapsible toggle button look inconsistent — it must be a small circular button at the top right edge of the sidebar
- Do not change sidebar expanded width from 180px under any circumstance
- Logo is not a component — always copy from SplashScreen.jsx
- All screens are dark mode only — never add light mode styles
- When fixing any page, do not change font sizes, spacing or layout unless explicitly asked
- The left panel of Login/Signup never animates — only the right panel does
- User data persists via localStorage — always initialize from localStorage on app load