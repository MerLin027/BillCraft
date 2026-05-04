# Billcraft Deep Audit Results

## 🔴 Critical Blockers (Security & Stability)

- **`backend/src/routes/auth.js`**
  No rate limiting or lockout mechanism exists on the `/login` and `/register` endpoints, leaving the application highly vulnerable to brute-force credential stuffing attacks.
  
- **`backend/src/routes/auth.js`**
  The `PATCH /profile` route updates user emails without pre-checking for uniqueness, causing an unhandled MongoDB Duplicate Key Error (11000) that crashes the request if the email is already registered.
  
- **`backend/src/server.js`**
  The CORS configuration is overly permissive for production, explicitly bypassing origin checks for `!origin` (allowing raw curl/Postman requests) and accepting any wildcard localhost port via regex.
  
- **`backend/src/routes/invoices.js` & `contracts.js`**
  The PDF/Word document generation logic utilizing `pdfkit` lacks a `try/catch` wrapper and `doc.on('error')` listener, meaning malformed payload data will throw an unhandled exception and crash the entire Node server process.

## 🟡 Logical Bugs (Data Flow & Edge Cases)

- **`backend/src/models/User.js` & `auth.js`**
  While the User schema allows `hashedPassword` to be `null` to support future OAuth integrations, the `/login` endpoint does not check for this, meaning a manual login attempt on an OAuth account will throw an error when `bcrypt.compare` receives `null`.
  
- **`backend/src/routes/generations.js`**
  The `nextInvoiceNumber` helper generates IDs by simply counting existing database documents, creating a race condition where concurrent generation requests will result in identical duplicate invoice numbers.
  
- **`frontend/src/services/api.js`**
  The JWT token is sent in the `Authorization` header as a raw string without the standard `Bearer ` prefix, which technically violates RFC 6750 HTTP authentication standards and could break if standard external middleware is ever introduced.
  
- **`frontend/src/context/AppContext.jsx`**
  If the backend goes offline mid-session, the `fetchData` interval catches the network error but fails to invalidate the UI, allowing the user to continue interacting with stale React state that cannot be saved.

## 🟢 Tech Debt (Cleanup & Best Practices)

- **`frontend/src/pages/ContractGenerator.jsx`**
  Line 125 contains a direct `localStorage.getItem('billcraft_token')` call, violating the established pattern of using the centralized `getToken()` helper defined in `api.js`.
  
- **`frontend/src/App.jsx`**
  The file contains lingering commented-out notes (e.g., `// F-17: removed dead /client-screen duplicate...`) and remnants of a deprecated `Clients.jsx` architectural flow that should be scrubbed.
  
- **`backend/src/server.js`**
  The server startup sequence dumps excessive `console.log` statements mapping out the exact API route structure, which clutters production logs and unnecessarily exposes backend architecture.
  
- **`frontend/src/pages/HomeScreen.jsx`**
  While the clock `setInterval` is properly cleared on unmount, relying on a 1000ms React state update for a visual clock forces unnecessary rapid re-renders of the entire `HomeScreen` component tree.
