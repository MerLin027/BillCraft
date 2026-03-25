import { useRef, useEffect, useState } from 'react'
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

  useEffect(() => {
    const t = setTimeout(() => setNavigating(false), 50)
    return () => clearTimeout(t)
  }, [location.pathname])

  // Close dropdown when collapsing
  useEffect(() => {
    if (sidebarCollapsed) setMenuOpen(false)
  }, [sidebarCollapsed])

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

  const sidebarWidth = sidebarCollapsed ? 60 : 260

  return (
    <>
    {/* Page-transition overlay */}
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: sidebarWidth,
        right: 0,
        bottom: 0,
        background: '#0a0a0a',
        opacity: navigating ? 1 : 0,
        transition: 'opacity 200ms ease-in-out',
        pointerEvents: navigating ? 'all' : 'none',
        zIndex: 40,
      }}
    />

    <aside
      style={{
        width: sidebarWidth,
        transition: 'width 300ms ease-in-out',
      }}
      className="h-screen bg-[#111111] border-r border-[#27272a] flex flex-col justify-between shrink-0 fixed left-0 top-0 z-50 overflow-hidden"
    >
      <div className="flex flex-col flex-grow">

        {/* Top: Brand (expanded) / Toggle button (always) */}
        <div className="h-20 flex items-center border-b border-[#27272a]/50 shrink-0"
          style={{ justifyContent: sidebarCollapsed ? 'center' : 'space-between', padding: sidebarCollapsed ? '0' : '0 24px' }}
        >
          {/* Logo — only visible when expanded */}
          {!sidebarCollapsed && (
            <div className="relative">
              <div className="absolute -inset-4 bg-[#22c55e]/10 rounded-full blur-xl opacity-30 pointer-events-none" />
              <h1 className="font-cursive text-2xl text-[#22c55e] tracking-wide relative z-10 drop-shadow-sm select-none">
                BillCraft
              </h1>
            </div>
          )}

          {/* Toggle button */}
          <button
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#22c55e',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '6px',
              lineHeight: 1,
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(34,197,94,0.6))' }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              {sidebarCollapsed ? 'menu' : 'menu_open'}
            </span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 p-2 flex-grow" style={{ padding: sidebarCollapsed ? '8px 0' : '16px' }}>
          {NAV_ITEMS.map(({ label, icon, path, filled }) => {
            const isActive = path === '/' + active
            return (
              <button
                key={path}
                onClick={() => navTo(path)}
                title={sidebarCollapsed ? label : undefined}
                style={sidebarCollapsed ? {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '10px 0',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(34,197,94,0.15)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 200ms ease-in-out',
                } : undefined}
                className={!sidebarCollapsed ? `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out w-full text-left ${
                  isActive
                    ? 'bg-[#22c55e]/15 text-[#22c55e]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }` : undefined}
                onMouseEnter={sidebarCollapsed ? (e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                } : undefined}
                onMouseLeave={sidebarCollapsed ? (e) => {
                  e.currentTarget.style.background = isActive ? 'rgba(34,197,94,0.15)' : 'transparent'
                } : undefined}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '22px',
                    color: sidebarCollapsed
                      ? isActive ? '#22c55e' : '#94a3b8'
                      : undefined,
                  }}
                >
                  {icon}
                </span>
                {!sidebarCollapsed && (
                  <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* User profile */}
      <div className="flex flex-col">
        <div className="p-4 border-t border-[#27272a]/50 bg-[#111111]"
          style={{ padding: sidebarCollapsed ? '12px 0' : '16px' }}
        >
          <div className="relative" ref={menuRef}>

            {sidebarCollapsed ? (
              /* Collapsed: avatar only, no action */
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="size-9 rounded-full bg-[#22c55e]/20 border-2 border-[#22c55e]/40 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-[#22c55e] select-none">{avatarInitial}</span>
                </div>
              </div>
            ) : (
              <>
                {/* Profile row */}
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                  <div className="size-9 rounded-full bg-[#22c55e]/20 border-2 border-[#22c55e]/40 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[#22c55e] select-none">{avatarInitial}</span>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate">{displayFullName}</p>
                    <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
                  </div>
                  <button
                    onClick={() => setMenuOpen(v => !v)}
                    className="ml-auto p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">more_vert</span>
                  </button>
                </div>

                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-full bg-[#1a1a1a] border border-[#27272a] rounded-lg shadow-xl overflow-hidden z-50">
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
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
    </>
  )
}
