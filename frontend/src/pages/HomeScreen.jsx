import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { user, clients, generations, setIntendedDestination } = useApp()
  const [clock, setClock] = useState('--:--:--')
  const [fading, setFading] = useState(false)

  function navigateWithFade(path) {
    setFading(true)
    setTimeout(() => navigate(path), 220)
  }

  useEffect(() => {
    function updateClock() {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setClock(`${hours}:${minutes}:${seconds}`)
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#0a0a0a] h-screen overflow-hidden">
      <div
        className="text-[#f5f5f5] h-full flex flex-col font-display antialiased"
        style={{
          opacity: fading ? 0 : 1,
          transition: 'opacity 220ms ease-in-out',
        }}
      >

      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-3 md:px-10 border-b border-[#22c55e]/10 bg-[#0a0a0a]/50 backdrop-blur-sm z-50">
        <div className="flex items-center gap-3 text-white">
          <span className="material-symbols-outlined text-[#22c55e] text-2xl">schedule</span>
          <div className="font-mono text-lg md:text-xl font-medium tracking-wide text-white">
            {clock}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateWithFade('/login')}
            className="group relative px-6 py-2 rounded-lg border border-[#22c55e] text-[#22c55e] bg-transparent hover:bg-[#22c55e] hover:text-white transition-all duration-300 ease-in-out font-bold text-sm tracking-wide overflow-hidden"
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-[#22c55e]/0 group-hover:bg-[#22c55e]/10 transition-colors duration-300"></div>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 relative">

        {/* Dot grid background */}
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        ></div>

        {/* Logo + tagline */}
        <div className="relative z-10 flex flex-col items-center max-w-4xl w-full text-center mb-6">
          <h1 className="text-7xl md:text-8xl text-white font-logo mb-3 drop-shadow-2xl selection:bg-[#22c55e] selection:text-white">
            BillCraft
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl font-medium tracking-tight">
            Professional Freelance Management Made Easy
          </p>
        </div>

        {/* Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">

          {/* Contract card */}
          <button
            onClick={() => { setIntendedDestination('/contract-builder'); navigateWithFade('/login') }}
            className="group flex flex-col items-start p-6 rounded-xl bg-[#171717] border border-white/10 hover:border-[#22c55e] transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:-translate-y-1 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#22c55e]">
              <span className="material-symbols-outlined">arrow_outward</span>
            </div>
            <div className="size-12 rounded-lg bg-[#22c55e]/10 border border-transparent flex items-center justify-center mb-4 group-hover:bg-[#22c55e] group-hover:text-white transition-colors duration-300 text-[#22c55e]">
              <span className="material-symbols-outlined text-2xl">contract</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#22c55e] transition-colors">Generate a Contract</h3>
            <p className="text-slate-400 font-normal text-sm leading-relaxed">Create airtight agreements in seconds. Protect your work and define clear terms.</p>
            <div className="mt-4 flex items-center text-sm font-bold text-white group-hover:text-[#22c55e]">
              <span>Start Drafting</span>
              <span className="material-symbols-outlined text-sm ml-1 transition-transform group-hover:translate-x-1">chevron_right</span>
            </div>
          </button>

          {/* Invoice card */}
          <button
            onClick={() => { setIntendedDestination('/invoice-generator'); navigateWithFade('/login') }}
            className="group flex flex-col items-start p-6 rounded-xl bg-[#171717] border border-white/10 hover:border-[#22c55e] transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:-translate-y-1 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#22c55e]">
              <span className="material-symbols-outlined">arrow_outward</span>
            </div>
            <div className="size-12 rounded-lg bg-[#22c55e]/10 border border-transparent flex items-center justify-center mb-4 group-hover:bg-[#22c55e] group-hover:text-white transition-colors duration-300 text-[#22c55e]">
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#22c55e] transition-colors">Build an Invoice</h3>
            <p className="text-slate-400 font-normal text-sm leading-relaxed">Get paid faster with professional invoices. Track payments and manage clients effortlessly.</p>
            <div className="mt-4 flex items-center text-sm font-bold text-white group-hover:text-[#22c55e]">
              <span>Create Invoice</span>
              <span className="material-symbols-outlined text-sm ml-1 transition-transform group-hover:translate-x-1">chevron_right</span>
            </div>
          </button>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-8 grid grid-cols-3 gap-8 md:gap-16 text-center border-t border-white/10 pt-6 w-full max-w-3xl opacity-80 hover:opacity-100 transition-opacity duration-500">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white">10k+</div>
            <div className="text-xs uppercase tracking-widest text-slate-400 mt-1">Freelancers</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white">$50M+</div>
            <div className="text-xs uppercase tracking-widest text-slate-400 mt-1">Invoiced</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white">24/7</div>
            <div className="text-xs uppercase tracking-widest text-slate-400 mt-1">Support</div>
          </div>
        </div>

      </main>
      </div>
    </div>
  )
}
