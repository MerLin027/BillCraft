# BillCraft Master Context Document

This document is a technical handoff focused on the exact runtime behavior and data shapes in the repo.

## 1. Core Tech Stack and Setup

### Frontend
- React 19.2.0 (react, react-dom)
- React Router DOM 7.13.0
- Vite 7.3.1
- Tailwind CSS 3.4.19
- PostCSS 8.5.6
- Autoprefixer 10.4.24
- ESLint 9.39.1
- @vitejs/plugin-react 5.1.1
- puppeteer 24.37.5 (dev dependency only, not used in runtime code)

### Backend
- Node.js 18+
- Express 5.2.1
- cors 2.8.6
- pdfkit 0.18.0
- docx 9.6.1

### Runtime wiring
- Backend listens on port 4000. Entry point: [backend/src/server.js](backend/src/server.js).
- Vite dev server proxies /api to http://localhost:4000. Config: [frontend/vite.config.js](frontend/vite.config.js).
- CORS allows only http://localhost:* and http://127.0.0.1:* (other origins rejected).

## 2. Database Schemas (Critical)

There is NO MongoDB or Mongoose integration in this repo. No schema/model files exist. All data persistence is in browser localStorage via React context.

### Users (localStorage only)
- Storage keys: billcraft_users (array), billcraft_user (current user object)
- User record in billcraft_users
  - id: number (Date.now())
  - name: string
  - email: string
  - password: string (plaintext)
  - provider: "email" | "google"
- Current user object in billcraft_user
  - name: string
  - email: string
  - provider: "email" | "google"
- Source: [frontend/src/context/AppContext.jsx](frontend/src/context/AppContext.jsx)

### Clients (localStorage only)
- Storage key: billcraft_clients (array)
- Client record
  - id: number (Date.now())
  - name: string
  - email: string
  - phone: string
  - business: string
  - industry: string
  - dateAdded: string (new Date().toLocaleDateString())
- Source: [frontend/src/context/AppContext.jsx](frontend/src/context/AppContext.jsx)

### Invoices (payload only, no DB collection)
- There is no invoice collection. Invoices are created as payloads and optionally stored inside generations[*].downloadPayload.
- Invoice payload shape (used by PDF/Word routes)
  - invoiceNumber: string
  - dateIssued: string
  - dateDue: string
  - fromName: string
  - fromEmail: string
  - fromStreet: string
  - fromCity: string
  - fromZip: string
  - toName: string
  - toEmail: string
  - toCompany: string
  - toPhone: string
  - toStreet: string
  - toCity: string
  - toZip: string
  - items: array of { desc: string, rate: number|string, qty: number|string }
  - taxRate: number
  - notes: string
- Source: [frontend/src/pages/InvoiceGenerator.jsx](frontend/src/pages/InvoiceGenerator.jsx)

### Contracts (payload only, no DB collection)
- There is no contract collection. Contracts are created as payloads and optionally stored inside generations[*].downloadPayload.
- Contract payload shape (used by PDF/Word routes)
  - contractTitle: string
  - freelancerName: string
  - freelancerEmail: string
  - effectiveDate: string
  - clientName: string
  - businessName: string
  - clientPhone: string
  - businessType: string
  - items: array of { desc: string, rate: number|string, qty: number|string }
  - deposit: number
  - dueDate: string
  - milestones: boolean
  - lateFee: boolean
  - ipTransfer: boolean
  - portfolio: boolean
- Source: [frontend/src/pages/ContractBuilderEditor.jsx](frontend/src/pages/ContractBuilderEditor.jsx)

### Generations (localStorage only)
- Storage key: billcraft_generations (array)
- Generation record
  - id: number (Date.now())
  - title: string
  - subtitle: string
  - type: string ("Invoice" | "Contract")
  - typeIcon: string
  - date: string
  - dateRed: boolean
  - amount: string (formatted currency)
  - status: string (paid | pending | overdue)
  - statusOptions: string[]
  - downloadKind: string (invoice | contract)
  - downloadPayload: object (invoice or contract payload)
  - createdAt: string (ISO)
- Source: [frontend/src/context/AppContext.jsx](frontend/src/context/AppContext.jsx)

## 3. Happy Path Status

### Auth
- Login and signup are LOCAL ONLY and rely on localStorage. No JWT, no bcrypt, no backend auth routes.
- login() validates against billcraft_users and returns { ok: true/false }.
- signUp() stores plaintext password.
- Source: [frontend/src/context/AppContext.jsx](frontend/src/context/AppContext.jsx)

### Entity Creation (Clients)
- Client creation works and persists to localStorage.
- Dedup by email: addClient() ignores a new client if email already exists.
- Source: [frontend/src/pages/ClientScreen.jsx](frontend/src/pages/ClientScreen.jsx), [frontend/src/context/AppContext.jsx](frontend/src/context/AppContext.jsx)

### Document Generation
- Working locally when backend is running on port 4000.
- PDF and Word downloads are fetched from /api endpoints, then saved via blob URLs.
- Source: [frontend/src/pages/InvoiceGenerator.jsx](frontend/src/pages/InvoiceGenerator.jsx), [frontend/src/pages/ContractBuilderEditor.jsx](frontend/src/pages/ContractBuilderEditor.jsx)

## 4. Active API Routes

All endpoints accept JSON POST and return a file download.

- GET /health -> { status: "BillCraft backend running" }
- POST /api/invoices/download -> Invoice PDF
- POST /api/invoices/word -> Invoice DOCX
  - Payload: invoiceNumber, dateIssued, dateDue, fromName, fromEmail, fromStreet, fromCity, fromZip, toName, toEmail, toCompany, toPhone, toStreet, toCity, toZip, items[], taxRate, notes
- POST /api/contracts/download -> Contract PDF
- POST /api/contracts/word -> Contract DOCX
  - Payload: contractTitle, freelancerName, freelancerEmail, effectiveDate, clientName, businessName, clientPhone, businessType, items[], deposit, dueDate, milestones, lateFee, ipTransfer, portfolio

Sources:
- [backend/src/server.js](backend/src/server.js)
- [backend/src/routes/invoices.js](backend/src/routes/invoices.js)
- [backend/src/routes/invoiceWord.js](backend/src/routes/invoiceWord.js)
- [backend/src/routes/contracts.js](backend/src/routes/contracts.js)
- [backend/src/routes/contractWord.js](backend/src/routes/contractWord.js)

## 5. Critical Blockers and Missing Logic

- No MongoDB or Mongoose models exist. All persistence is in localStorage, so no server-side CRUD or queries are possible.
- Auth is not real. No JWT, no bcrypt, no backend auth routes. Passwords are stored in plaintext.
- No API endpoints exist for users, clients, invoices, or contracts. Backend only generates files.
- Production deployment is frontend-only (Vercel config). /api requests will 404 unless a backend service + proxy is added.
- CORS rejects any non-local origin; a hosted frontend cannot call the backend without changes.
- Client Edit and Delete modals are UI-only and do not call updateClient() or deleteClient().
- ContractBuilderEditor uses a static SUGGESTED_CLIENTS list instead of AppContext clients, so newly added clients do not appear there.
- Invoice payload uses clientSearch for both toName and toEmail; if the user types an email, the generated PDF will use that email as the name field.

## Appendix: Where the demo data lives
- Static demo clients: [frontend/src/data/staticClients.js](frontend/src/data/staticClients.js)
- Static contract list (Contract Builder list view): [frontend/src/pages/ContractGenerator.jsx](frontend/src/pages/ContractGenerator.jsx)
- Static generations rows (My Generations list view): [frontend/src/pages/MyGenerations.jsx](frontend/src/pages/MyGenerations.jsx)
