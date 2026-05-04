import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ServerBanner   from './components/ServerBanner'
import SplashScreen       from './pages/SplashScreen'
import HomeScreen         from './pages/HomeScreen'
import LoginScreen        from './pages/LoginScreen'
import SignUpScreen       from './pages/SignUpScreen'
import Dashboard          from './pages/Dashboard'
import ContractGenerator  from './pages/ContractGenerator'
import InvoiceGenerator   from './pages/InvoiceGenerator'
import MyGenerations      from './pages/MyGenerations'
import ProfileScreen      from './pages/ProfileScreen'
import ClientScreen       from './pages/ClientScreen'

// F-17: removed dead /client-screen duplicate and unused Clients.jsx import

function App() {
  return (
    <>
      <ServerBanner />
      <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"     element={<SplashScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/login"  element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />

        {/* F-5: Protected routes — redirect to /login if not authenticated */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/clients" element={
          <ProtectedRoute><ClientScreen /></ProtectedRoute>
        } />
        <Route path="/contract-builder" element={
          <ProtectedRoute><ContractGenerator /></ProtectedRoute>
        } />
        <Route path="/invoice-generator" element={
          <ProtectedRoute><InvoiceGenerator /></ProtectedRoute>
        } />
        <Route path="/my-generations" element={
          <ProtectedRoute><MyGenerations /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfileScreen /></ProtectedRoute>
        } />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App