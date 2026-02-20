import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function HomeScren() {
  const navigate = useNavigate()
  const { user, clients, generations } = useApp()

  const [clock, setClock] = useState('--:--:--')

  useEffect(() => {
    function updateClock() {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setClock(`${hours}:${minutes}:${seconds}`)
    }
    const id = setInterval(updateClock, 1000)
    updateClock()
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen flex flex-col font-display antialiased overflow-x-hidden">
      <header className="w-full flex items-center justify-between px-6 py-4 md:px-10 border-b border-primary/10 bg-background-dark/50 backdrop-blur-sm fixed top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#22c55e] text-2xl">schedule</span>
          <div className="font-mono text-lg md:text-xl font-medium tracking-wide text-[#22c55e]" id="clock">{clock}</div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="group relative px-6 py-2 rounded-lg border border-[#22c55e] text-white bg-transparent hover:bg-[#22c55e] hover:text-white transition-all duration-300 ease-in-out font-bold text-sm tracking-wide overflow-hidden"
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300"></div>
          </button>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-8 relative pt-20">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>
        <div className="relative z-10 flex flex-col items-center max-w-4xl w-full text-center mb-12 animate-fade-in-up">
          {/* Logo — copied exactly from SplashScreen.jsx */}
          <div className="mb-10 text-center relative">
            <div className="absolute -inset-10 bg-[#22c55e]/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
            <h1 className="font-cursive text-5xl md:text-6xl text-[#22c55e] tracking-wide relative z-10 drop-shadow-sm select-none">
              BillCraft
            </h1>
          </div>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium tracking-tight">
            Professional Freelance Management Made Easy
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          <button
            onClick={() => navigate('/contract-builder')}
            className="group flex flex-col items-start p-8 rounded-xl bg-[#1a1a1a] border border-white/10 hover:border-[#22c55e] transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:-translate-y-1 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#22c55e]">
              <span className="material-symbols-outlined">arrow_outward</span>
            </div>
            <div className="size-14 rounded-lg bg-[#22c55e]/10 border border-transparent shadow-none flex items-center justify-center mb-6 group-hover:bg-[#22c55e] group-hover:text-white transition-colors duration-300 text-[#22c55e]">
              <span className="material-symbols-outlined text-3xl">contract</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#22c55e] transition-colors">Generate Contract</h3>
            <p className="text-slate-400 font-normal leading-relaxed">Create airtight agreements in seconds. Protect your work and define clear terms.</p>
            <div className="mt-6 flex items-center text-sm font-bold text-[#22c55e]">
              <span>Start Drafting</span>
              <span className="material-symbols-outlined text-sm ml-1 transition-transform group-hover:translate-x-1">chevron_right</span>
            </div>
          </button>
          <button
            onClick={() => navigate('/invoice-generator')}
            className="group flex flex-col items-start p-8 rounded-xl bg-[#1a1a1a] border border-white/10 hover:border-[#22c55e] transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:-translate-y-1 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#22c55e]">
              <span className="material-symbols-outlined">arrow_outward</span>
            </div>
            <div className="size-14 rounded-lg bg-[#22c55e]/10 border border-transparent shadow-none flex items-center justify-center mb-6 group-hover:bg-[#22c55e] group-hover:text-white transition-colors duration-300 text-[#22c55e]">
              <span className="material-symbols-outlined text-3xl">receipt_long</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#22c55e] transition-colors">Generate Invoice</h3>
            <p className="text-slate-400 font-normal leading-relaxed">Get paid faster with professional invoices. Track payments and manage clients effortlessly.</p>
            <div className="mt-6 flex items-center text-sm font-bold text-[#22c55e]">
              <span>Create Invoice</span>
              <span className="material-symbols-outlined text-sm ml-1 transition-transform group-hover:translate-x-1">chevron_right</span>
            </div>
          </button>
        </div>
        <div className="relative z-10 mt-16 md:mt-24 grid grid-cols-3 gap-8 md:gap-16 text-center border-t border-white/10 pt-8 opacity-80 hover:opacity-100 transition-opacity duration-500">
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
  )
}
