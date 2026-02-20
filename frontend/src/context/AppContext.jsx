import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [clients, setClients] = useState([])
  const [generations, setGenerations] = useState([])
  const [intendedDestination, setIntendedDestination] = useState(null)

  const login = () => {
    setUser({ name: 'Vrushank', email: '23it032@charusat.edu.in' })
  }

  const logout = () => {
    setUser(null)
  }

  const addClient = (clientData) => {
    setClients(prev => {
      const exists = prev.find(c => c.email === clientData.email)
      if (exists) return prev
      return [...prev, { ...clientData, id: Date.now(), dateAdded: new Date().toLocaleDateString() }]
    })
  }

  const updateClient = (id, updatedData) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c))
  }

  const deleteClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id))
  }

  const addGeneration = (generation) => {
    setGenerations(prev => [...prev, {
      ...generation,
      id: Date.now(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    }])
  }

  const updateGenerationStatus = (id, status) => {
    setGenerations(prev => prev.map(g => g.id === id ? { ...g, status } : g))
  }

  return (
    <AppContext.Provider value={{
      user, login, logout,
      clients, addClient, updateClient, deleteClient,
      generations, addGeneration, updateGenerationStatus,
      intendedDestination, setIntendedDestination,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}