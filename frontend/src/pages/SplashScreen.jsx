import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const DURATION = 4000 // ms for bar to go 0 → 100%
const TICK = 16     // ~60fps

export default function SplashScreen() {
  const navigate = useNavigate()
  const { user, clients, generations } = useApp()

  const [progress, setProgress] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    // rAF-driven progress 0 → 100 over DURATION ms with ease-out
    const easeOut = t => 1 - Math.pow(1 - t, 3)

    const step = (ts) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const t = Math.min(elapsed / DURATION, 1)
      const p = Math.round(easeOut(t) * 100)
      setProgress(p)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        // Navigate after a short pause so the user sees 100%
        setTimeout(() => navigate('/home'), 300)
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [navigate])

  return (
    <div className="bg-[#0a0a0a] font-display min-h-screen flex flex-col overflow-hidden text-white">
      <main className="flex-grow flex flex-col items-center justify-center relative w-full h-screen z-50">

        {/* Center content */}
        <div className="flex flex-col items-center justify-center w-full max-w-md px-6 animate-fade-in-up">

          {/* Logo */}
          <div className="mb-10 text-center relative">
            <div className="absolute -inset-10 bg-[#22c55e]/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
            <h1 className="font-cursive text-6xl md:text-7xl text-[#22c55e] tracking-wide relative z-10 drop-shadow-sm select-none">
              BillCraft
            </h1>
          </div>

          {/* Progress section */}
          <div className="w-64 max-w-full flex flex-col gap-3">
            <div className="flex justify-between items-end px-1">
              <span className="text-[#a3a3a3] text-xs font-medium tracking-wider uppercase">
                Initializing Workspace
              </span>
              <span className="text-[#22c55e] text-xs font-bold">{progress}%</span>
            </div>

            {/* Progress bar track */}
            <div className="h-1 w-full bg-[#262626] rounded-full overflow-hidden relative">
              <div
                className="absolute top-0 left-0 h-full bg-[#22c55e] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse-slow" />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom footer */}
        <div className="absolute bottom-8 left-0 w-full flex flex-col items-center gap-2 opacity-50">
          <div className="flex items-center gap-1 text-[#a3a3a3] text-lg">
            <span>Made for Freelancers</span>
          </div>
        </div>

      </main>
    </div>
  )
}
