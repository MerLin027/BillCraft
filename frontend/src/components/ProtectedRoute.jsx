import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

// ─────────────────────────────────────────────────────────────────────────────
// ProtectedRoute (F-5)
//
// Wraps any route that requires authentication.
//   - While the session is restoring from localStorage (authLoading=true),
//     renders nothing to prevent a redirect flash.
//   - If no user is found after restore, saves the intended path and redirects
//     to /login so the user can be sent back after logging in.
//   - If authenticated, renders the children.
// ─────────────────────────────────────────────────────────────────────────────

export default function ProtectedRoute({ children }) {
  const { user, authLoading, setIntendedDestination } = useApp()
  const location = useLocation()

  // Still restoring session — show nothing (prevents flash redirect)
  if (authLoading) return null

  if (!user) {
    setIntendedDestination(location.pathname)
    return <Navigate to="/login" replace />
  }

  return children
}
