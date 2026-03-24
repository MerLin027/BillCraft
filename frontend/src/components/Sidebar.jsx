import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const NAV_ITEMS = [
  { label: 'Dashboard',         icon: 'dashboard',   path: '/dashboard',         filled: true },
  { label: 'Clients',           icon: 'group',        path: '/clients' },
  { label: 'Contract Builder',  icon: 'gavel',        path: '/contract-builder' },
  { label: 'Invoice Generator', icon: 'receipt_long', path: '/invoice-generator' },
  { label: 'My Generations',    icon: 'history',      path: '/my-generations' },
]

export default function Sidebar({ active }) {
  const navigate = useNavigate()
  const { user, logout, sidebarCollapsed, toggleSidebar } = useApp()

  const displayFullName = user?.name  ?? 'Alex Morgan'
  const displayEmail    = user?.email ?? 'alex@billcraft.io'
  const avatarInitial   = displayFullName.trim().charAt(0).toUpperCase()

  const location = useLocation()
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [navigating, setNavigating] = useState(false)
  const menuRef = useRef(null)

  const W = sidebarCollapsed ? 72 : 260

  useEffect(() => {
    const t = setTimeout(() => setNavigating(false), 50)
    return () => clearTimeout(t)
  }, [location.pathname])

  useEffect(() => {
    function handleOutsideClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [menuOpen])

  function navTo(path) {
    if (location.pathname === path) return
    setNavigating(true)
    setTimeout(() => navigate(path), 200)
  }

  function handleLogout() {
    setMenuOpen(false)
    logout()
    navTo('/home')
  }

  return (
    <>
    {/* Page-transition overlay */}
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: W,
        right: 0,
        bottom: 0,
        background: '#0a0a0a',
        opacity: navigating ? 1 : 0,
        transition: 'opacity 200ms ease-in-out, left 300ms ease-in-out',
        pointerEvents: navigating ? 'all' : 'none',
        zIndex: 40,
      }}
    />

    <aside
      style={{ width: W, transition: 'width 300ms ease-in-out' }}
      className="h-screen bg-[#111111] border-r border-[#27272a] flex flex-col justify-between shrink-0 fixed left-0 top-0 z-50 overflow-hidden"
    >
      <div className="flex flex-col flex-grow min-w-0">

        {/* Brand + collapse toggle */}
        <div className="h-20 flex items-center border-b border-[#27272a]/50 shrink-0 px-3 gap-2">
          {/* Logo — hide text when collapsed */}
          <div
            className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden cursor-pointer"
            onClick={() => navTo('/dashboard')}
          >
            <div className="relative shrink-0">
              <div className="absolute -inset-3 bg-[#22c55e]/10 rounded-full blur-xl opacity-30 pointer-events-none" />
              {sidebarCollapsed ? (
                <span className="material-symbols-outlined text-[#22c55e] text-[28px] relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>receipt</span>
              ) : (
                <h1 className="font-cursive text-2xl text-[#22c55e] tracking-wide relative z-10 drop-shadow-sm select-none whitespace-nowrap">
                  BillCraft
                </h1>
              )}
            </div>
          </div>

          {/* Collapse toggle */}
          <button
            onClick={toggleSidebar}
            className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 p-3 flex-grow">
          {NAV_ITEMS.map(({ label, icon, path, filled }) => {
            const isActive = path === '/' + active
            return (
              <button
                key={path}
                onClick={() => navTo(path)}
                title={sidebarCollapsed ? label : undefined}
                className={`flex items-center gap-3 rounded-lg transition-all duration-200 ease-in-out w-full text-left ${
                  sidebarCollapsed ? 'px-3 py-2.5 justify-center' : 'px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#22c55e]/15 text-[#22c55e]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px] shrink-0"
                  style={isActive && filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>
                {!sidebarCollapsed && (
                  <span className={`text-sm whitespace-nowrap overflow-hidden ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {label}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* User profile */}
      <div className="flex flex-col">
        <div className="p-3 border-t border-[#27272a]/50 bg-[#111111]">
          <div className="relative" ref={menuRef}>

            {/* Profile row */}
            <div
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
              onClick={sidebarCollapsed ? () => setMenuOpen(v => !v) : undefined}
            >
              <div className="size-9 rounded-full bg-[#22c55e]/20 border-2 border-[#22c55e]/40 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-[#22c55e] select-none">{avatarInitial}</span>
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{displayFullName}</p>
                    <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
                  </div>
                  <button
                    onClick={() => setMenuOpen(v => !v)}
                    className="ml-auto p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-lg">more_vert</span>
                  </button>
                </>
              )}
            </div>

            {/* Dropdown */}
            {menuOpen && (
              <div className={`absolute bottom-full mb-2 bg-[#1a1a1a] border border-[#27272a] rounded-lg shadow-xl overflow-hidden z-50 ${sidebarCollapsed ? 'left-0 w-40' : 'left-0 w-full'}`}>
                <button
                  onClick={() => { setMenuOpen(false); navTo('/profile') }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-[#f5f5f5] hover:bg-white/5 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">manage_accounts</span>
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
    </>
  )
}
