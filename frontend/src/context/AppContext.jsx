import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getToken, setToken, clearToken,
  apiGetMe, apiLogin, apiRegister,
  apiGetClients, apiAddClient, apiUpdateClient, apiDeleteClient,
  apiGetGenerations, apiAddGeneration, apiUpdateGeneration, apiUpdateGenerationStatus, apiDeleteGeneration,
} from '../services/api'

// ─────────────────────────────────────────────────────────────────────────────
// AppContext — single source of truth for auth, clients, and generations.
// All state is driven by the backend (MongoDB). localStorage is used only for
// the JWT token and the sidebar collapsed preference.
//
// serverOnline: tracks whether the backend was reachable on the last attempt.
//   true  = last request succeeded
//   false = last request got a network-level failure (server down / wrong URL)
//   null  = not yet determined (app is still loading)
// ─────────────────────────────────────────────────────────────────────────────

const AppContext = createContext()

const SIDEBAR_KEY = 'billcraft_sidebar_collapsed'

export function AppProvider({ children }) {

  // ── Auth state ──────────────────────────────────────────────────────────────
  const [user,        setUser]        = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // ── Server reachability state ───────────────────────────────────────────────
  // null = unknown (startup), true = reachable, false = unreachable
  const [serverOnline, setServerOnline] = useState(null)

  // ── Data state ─────────────────────────────────────────────────────────────
  const [clients,     setClients]     = useState([])
  const [generations, setGenerations] = useState([])

  // ── UI state ───────────────────────────────────────────────────────────────
  const [intendedDestination, setIntendedDestination] = useState(null)

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === 'true' } catch { return false }
  })
  const toggleSidebar = () => setSidebarCollapsed(v => {
    const next = !v
    try { localStorage.setItem(SIDEBAR_KEY, String(next)) } catch {}
    return next
  })

  // ── Helper: tag error type ─────────────────────────────────────────────────
  const isNetworkErr = (err) => err?.isNetworkError === true

  // ── Session restore on mount ───────────────────────────────────────────────
  // If a JWT exists, validate it via GET /api/auth/me.
  // - Auth failure (401) → token is stale, clear it, mark server online
  // - Network failure    → don't clear token (server may just be starting up),
  //                        mark server offline
  useEffect(() => {
    const token = getToken()
    if (!token) { setAuthLoading(false); setServerOnline(null); return }

    apiGetMe()
      .then(data => {
        setUser(data.user)
        setServerOnline(true)
      })
      .catch(err => {
        if (isNetworkErr(err)) {
          // Server unreachable — keep the token so the user stays "logged in"
          // when the server comes back. Banner will inform them.
          setServerOnline(false)
        } else {
          // Token expired or invalid — clear it and log out
          clearToken()
          setUser(null)
          setServerOnline(true)  // server responded, so it IS online
        }
      })
      .finally(() => setAuthLoading(false))
  }, [])

  // ── Fetch clients + generations when user is known ─────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const [cRes, gRes] = await Promise.all([apiGetClients(), apiGetGenerations()])
      setClients(cRes.clients || [])
      setGenerations(gRes.generations || [])
      setServerOnline(true)
    } catch (err) {
      if (isNetworkErr(err)) {
        setServerOnline(false)
        setClients([])
        setGenerations([])
      } else {
        // Auth error mid-session -> token expired/invalid
        clearToken()
        setUser(null)
        setServerOnline(true)
      }
    }
  }, [])

  useEffect(() => {
    if (user) fetchData()
    else { setClients([]); setGenerations([]) }
  }, [user, fetchData])

  // ── Auth actions ───────────────────────────────────────────────────────────

  const login = async ({ email, password }) => {
    try {
      const data = await apiLogin(email, password)
      setToken(data.token)
      setUser(data.user)
      setServerOnline(true)
      return { ok: true }
    } catch (err) {
      if (isNetworkErr(err)) {
        setServerOnline(false)
        return { ok: false, error: err.message, isNetworkError: true }
      }
      setServerOnline(true)
      return { ok: false, error: err.message || 'Invalid email or password.' }
    }
  }

  const signUp = async ({ name, email, password }) => {
    try {
      const data = await apiRegister(name, email, password)
      setToken(data.token)
      setUser(data.user)
      setServerOnline(true)
      return { ok: true }
    } catch (err) {
      if (isNetworkErr(err)) {
        setServerOnline(false)
        return { ok: false, error: err.message, isNetworkError: true }
      }
      setServerOnline(true)
      return { ok: false, error: err.message || 'Sign up failed.' }
    }
  }

  const loginWithGoogle = () => ({ ok: false, error: 'Google login coming soon.' })

  const logout = () => {
    clearToken()
    setUser(null)
    setClients([])
    setGenerations([])
  }

  const updateUser = (updatedUser) => setUser(updatedUser)

  // ── Client actions ─────────────────────────────────────────────────────────

  const addClient = async (clientData) => {
    try {
      const data = await apiAddClient(clientData)
      setClients(prev => [...prev, data.client])
      setServerOnline(true)
      return { ok: true, client: data.client }
    } catch (err) {
      if (isNetworkErr(err)) setServerOnline(false)
      return { ok: false, error: err.message, isNetworkError: isNetworkErr(err) }
    }
  }

  const updateClient = async (id, updatedData) => {
    try {
      const data = await apiUpdateClient(id, updatedData)
      setClients(prev => prev.map(c => (c._id === id ? data.client : c)))
      setServerOnline(true)
      return { ok: true }
    } catch (err) {
      if (isNetworkErr(err)) setServerOnline(false)
      return { ok: false, error: err.message, isNetworkError: isNetworkErr(err) }
    }
  }

  const deleteClient = async (id) => {
    try {
      await apiDeleteClient(id)
      setClients(prev => prev.filter(c => c._id !== id))
      setServerOnline(true)
      return { ok: true }
    } catch (err) {
      if (isNetworkErr(err)) setServerOnline(false)
      return { ok: false, error: err.message, isNetworkError: isNetworkErr(err) }
    }
  }

  // ── Generation actions ─────────────────────────────────────────────────────

  const addGeneration = async (generationData) => {
    try {
      const data = await apiAddGeneration(generationData)
      setGenerations(prev => [data.generation, ...prev])
      setServerOnline(true)
      return { ok: true, generation: data.generation }
    } catch (err) {
      if (isNetworkErr(err)) setServerOnline(false)
      return { ok: false, error: err.message, isNetworkError: isNetworkErr(err) }
    }
  }

  const updateGenerationStatus = async (id, status) => {
    try {
      const data = await apiUpdateGenerationStatus(id, status)
      setGenerations(prev => prev.map(g => (g._id === id ? data.generation : g)))
      setServerOnline(true)
      return { ok: true }
    } catch (err) {
      if (isNetworkErr(err)) setServerOnline(false)
      return { ok: false, error: err.message, isNetworkError: isNetworkErr(err) }
    }
  }

  const updateGeneration = async (id, fields) => {
    try {
      const data = await apiUpdateGeneration(id, fields)
      setGenerations(prev => prev.map(g => (g._id === id ? data.generation : g)))
      setServerOnline(true)
      return { ok: true, generation: data.generation }
    } catch (err) {
      if (isNetworkErr(err)) setServerOnline(false)
      return { ok: false, error: err.message, isNetworkError: isNetworkErr(err) }
    }
  }

  const deleteGeneration = async (id) => {
    try {
      await apiDeleteGeneration(id)
      setGenerations(prev => prev.filter(g => g._id !== id))
      setServerOnline(true)
      return { ok: true }
    } catch (err) {
      if (isNetworkErr(err)) setServerOnline(false)
      return { ok: false, error: err.message, isNetworkError: isNetworkErr(err) }
    }
  }

  return (
    <AppContext.Provider value={{
      // Auth
      user, authLoading, login, signUp, loginWithGoogle, logout, updateUser,
      // Server status
      serverOnline,
      // Clients
      clients, addClient, updateClient, deleteClient,
      // Generations
      generations, addGeneration, updateGeneration, updateGenerationStatus, deleteGeneration,
      // UI
      intendedDestination, setIntendedDestination,
      sidebarCollapsed, toggleSidebar,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}