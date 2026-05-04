import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

// ─────────────────────────────────────────────────────────────────────────────
// ServerBanner — shows a dismissible amber warning bar when the backend server
// is unreachable. Automatically hides when serverOnline returns to true.
// ─────────────────────────────────────────────────────────────────────────────

export default function ServerBanner() {
  const { serverOnline } = useApp()
  const [dismissed, setDismissed] = useState(false)

  // Auto-show again if server goes offline after being dismissed
  useEffect(() => {
    if (serverOnline === false) setDismissed(false)
  }, [serverOnline])

  // Only show when we know server is offline and user hasn't dismissed
  if (serverOnline !== false || dismissed) return null

  return (
    <div
      role="alert"
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between gap-3 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/30 backdrop-blur-sm"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="flex items-center gap-2.5 text-amber-400 text-sm font-medium">
        <span className="material-symbols-outlined text-[18px] shrink-0 animate-pulse">
          wifi_off
        </span>
        <span>
          Server offline —{' '}
          <span className="font-semibold">data cannot be saved</span>.
          Start the backend on{' '}
          <code className="font-mono text-amber-300 text-xs bg-amber-500/15 px-1.5 py-0.5 rounded">
            {import.meta.env.VITE_API_URL || 'http://localhost:4000'}
          </code>{' '}
          to restore full functionality.
        </span>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-amber-400/70 hover:text-amber-300 transition-colors"
        aria-label="Dismiss"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  )
}
