import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SplashScreen from './pages/SplashScreen'
import HomeScreen from './pages/HomeScreen'
import LoginScreen from './pages/LoginScreen'
import SignUpScreen from './pages/SignUpScreen'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import ContractBuilder from './pages/ContractBuilder'
import ContractGenerator from './pages/ContractGenerator'
import InvoiceGenerator from './pages/InvoiceGenerator'
import MyGenerations from './pages/MyGenerations'
import ProfileScreen from './pages/ProfileScreen'
import ClientScreen from './pages/ClientScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<ClientScreen />} />
        <Route path="/contract-builder" element={<ContractGenerator />} />
        <Route path="/invoice-generator" element={<InvoiceGenerator />} />
        <Route path="/my-generations" element={<MyGenerations />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/client-screen" element={<ClientScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App