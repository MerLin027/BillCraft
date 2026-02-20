import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SplashScreen from './pages/SplashScreen'
import HomeScreen from './pages/HomeScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="/clients" element={<div>Clients</div>} />
        <Route path="/contract-builder" element={<div>Contract Builder</div>} />
        <Route path="/invoice-generator" element={<div>Invoice Generator</div>} />
        <Route path="/my-generations" element={<div>My Generations</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App