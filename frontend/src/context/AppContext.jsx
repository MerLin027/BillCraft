import { createContext, useContext, useState } from 'react'

const AppContext = createContext()
const CLIENTS_KEY = 'billcraft_clients'
const GENERATIONS_KEY = 'billcraft_generations'
const USERS_KEY = 'billcraft_users'

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('billcraft_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [clients, setClients] = useState(() => {
    try {
      const stored = localStorage.getItem(CLIENTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [generations, setGenerations] = useState(() => {
    try {
      const stored = localStorage.getItem(GENERATIONS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [intendedDestination, setIntendedDestination] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const toggleSidebar = () => setSidebarCollapsed(v => !v)
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(USERS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })


  const login = ({ email, password }) => {
    const matched = users.find(
      u => u.provider === 'email' &&
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
    )
    if (!matched) {
      return { ok: false, error: 'Invalid email or password.' }
    }
    const userData = { name: matched.name, email: matched.email, provider: matched.provider }
    localStorage.setItem('billcraft_user', JSON.stringify(userData))
    setUser(userData)
    return { ok: true }
  }

  const signUp = ({ name, email, password }) => {
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase())
    if (exists) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const newUser = { id: Date.now(), name, email, password, provider: 'email' }
    const nextUsers = [...users, newUser]
    setUsers(nextUsers)
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers))
    const userData = { name, email, provider: 'email' }
    localStorage.setItem('billcraft_user', JSON.stringify(userData))
    setUser(userData)
    return { ok: true }
  }

  const loginWithGoogle = () => {
    const googleUser = {
      id: Date.now(),
      name: 'Google User',
      email: `google.user.${Date.now()}@gmail.com`,
      provider: 'google',
    }
    const nextUsers = [...users, googleUser]
    setUsers(nextUsers)
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers))
    const userData = { name: googleUser.name, email: googleUser.email, provider: googleUser.provider }
    localStorage.setItem('billcraft_user', JSON.stringify(userData))
    setUser(userData)
    return { ok: true }
  }

  const logout = () => {
    localStorage.removeItem('billcraft_user')
    setUser(null)
  }

  const addClient = (clientData) => {
    setClients(prev => {
      const exists = prev.find(c => c.email === clientData.email)
      if (exists) return prev
      const next = [...prev, { ...clientData, id: Date.now(), dateAdded: new Date().toLocaleDateString() }]
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(next))
      return next
    })
  }

  const updateClient = (id, updatedData) => {
    setClients(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updatedData } : c)
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(next))
      return next
    })
  }

  const deleteClient = (id) => {
    setClients(prev => {
      const next = prev.filter(c => c.id !== id)
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(next))
      return next
    })
  }

  const addGeneration = (generation) => {
    setGenerations(prev => {
      const next = [...prev, {
        ...generation,
        id: Date.now(),
        status: 'Pending',
        createdAt: new Date().toISOString(),
      }]
      localStorage.setItem(GENERATIONS_KEY, JSON.stringify(next))
      return next
    })
  }

  const updateGenerationStatus = (id, status) => {
    setGenerations(prev => {
      const next = prev.map(g => g.id === id ? { ...g, status } : g)
      localStorage.setItem(GENERATIONS_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <AppContext.Provider value={{
      user, login, signUp, loginWithGoogle, logout,
      clients, addClient, updateClient, deleteClient,
      generations, addGeneration, updateGenerationStatus,
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