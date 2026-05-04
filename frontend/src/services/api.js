// ─────────────────────────────────────────────────────────────────────────────
// api.js — BillCraft API service layer
//
// Every backend call goes through here. This layer:
//   1. Reads the base URL from VITE_API_URL env variable
//   2. Automatically attaches the JWT Authorization header
//   3. Distinguishes between network failures vs. API errors
//   4. Returns normalized error objects — never throws to callers
// ─────────────────────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const TOKEN_KEY = 'billcraft_token'

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken   = ()        => localStorage.getItem(TOKEN_KEY)
export const setToken   = (token)   => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = ()        => localStorage.removeItem(TOKEN_KEY)

// ── Network error sentinel ────────────────────────────────────────────────────
// Thrown when fetch itself fails (server down, no internet, CORS preflight fail)
class NetworkError extends Error {
  constructor() {
    super('Cannot reach the BillCraft server. Please ensure the backend is running.')
    this.isNetworkError = true
  }
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────
// Returns parsed JSON on success.
// Throws NetworkError for connection failures, or Error with server message for API errors.
async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  let res
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers })
  } catch {
    // fetch() itself threw — server is unreachable (offline, wrong port, CORS preflight)
    throw new NetworkError()
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`
    const err = new Error(msg)
    err.status = res.status
    throw err
  }
  return data
}

// ── Auth endpoints ────────────────────────────────────────────────────────────
export const apiRegister = (name, email, password) =>
  request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })

export const apiLogin = (email, password) =>
  request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const apiGetMe = () => request('/api/auth/me')

export const apiUpdateProfile = (fields) =>
  request('/api/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(fields),
  })

export const apiChangePassword = (currentPassword, newPassword) =>
  request('/api/auth/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  })

// ── Client endpoints ──────────────────────────────────────────────────────────
export const apiGetClients = () => request('/api/clients')

export const apiAddClient = (clientData) =>
  request('/api/clients', {
    method: 'POST',
    body: JSON.stringify(clientData),
  })

export const apiUpdateClient = (id, clientData) =>
  request(`/api/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  })

export const apiDeleteClient = (id) =>
  request(`/api/clients/${id}`, { method: 'DELETE' })

// ── Generation endpoints ──────────────────────────────────────────────────────
export const apiGetGenerations = () => request('/api/generations')

export const apiAddGeneration = (generationData) =>
  request('/api/generations', {
    method: 'POST',
    body: JSON.stringify(generationData),
  })

export const apiUpdateGenerationStatus = (id, status) =>
  request(`/api/generations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })

export const apiUpdateGeneration = (id, fields) =>
  request(`/api/generations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(fields),
  })

export const apiDeleteGeneration = (id) =>
  request(`/api/generations/${id}`, { method: 'DELETE' })

// ── Account deletion ──────────────────────────────────────────────────────────
export const apiDeleteAccount = () =>
  request('/api/auth/account', { method: 'DELETE' })
