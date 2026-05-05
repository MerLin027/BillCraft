import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'


// Compute the numeric dollar value for a generation, falling back to payload items
function getNumericAmount(g) {
  const amtStr = String(g.amount || '')
  if (amtStr && amtStr !== '-' && amtStr !== '$0.00') {
    const n = Number(amtStr.replace(/[^0-9.-]+/g, ''))
    if (Number.isFinite(n) && n > 0) return n
  }
  // Fallback: compute from downloadPayload (handles invoices with tax, and contracts)
  const payload = g.downloadPayload
  if (!payload) return 0
  const items = payload.items
  if (!Array.isArray(items)) return 0
  const subtotal = items.reduce((sum, it) => sum + (Number(it.rate) || 0) * (Number(it.qty) || 0), 0)
  if (subtotal <= 0) return 0
  // Apply tax if present (invoice payloads include taxRate %)
  const taxRate = Number(payload.taxRate) || 0
  return subtotal + (subtotal * taxRate) / 100
}

const STATUS_STYLES = {
  paid:    { label: 'Paid',    statusStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dotStyle: 'bg-emerald-400' },
  active:  { label: 'Active',  statusStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',           dotStyle: 'bg-blue-400' },
  pending: { label: 'Pending', statusStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/20',         dotStyle: 'bg-amber-400' },
  overdue: { label: 'Overdue', statusStyle: 'bg-red-500/10 text-red-400 border-red-500/20',               dotStyle: 'bg-red-400' },
  expired: { label: 'Expired', statusStyle: 'bg-slate-500/10 text-slate-400 border-slate-500/20',         dotStyle: 'bg-slate-400' },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, clients, generations, sidebarCollapsed } = useApp()

  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    const now = new Date()
    const formatted = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    setDateStr(formatted)
  }, [])

  const displayName = user?.name ?? 'Alex'
  const invoiceGenerations = useMemo(
    () => generations.filter(g => (g.type || 'Invoice').toLowerCase() === 'invoice'),
    [generations]
  )
  const pendingOrOverdueTotal = useMemo(() => {
    return generations
      .filter(g => ['pending', 'overdue'].includes((g.status || '').toLowerCase()))
      .reduce((sum, g) => sum + getNumericAmount(g), 0)
  }, [generations])
  const activeContractsCount = useMemo(() => {
    return generations.filter(g =>
      (g.type || '').toLowerCase() === 'contract' &&
      ['active', 'sent', 'signed', 'paid'].includes((g.status || '').toLowerCase())
    ).length
  }, [generations])
  const recentRows = useMemo(() => {
    const mapped = generations
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6)
      .map(g => {
        const normalizedStatus = (g.status || 'pending').toLowerCase()
        const cfg = STATUS_STYLES[normalizedStatus] || STATUS_STYLES.pending
        const name = g.title || 'Untitled'
        const initials = name
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map(s => s[0].toUpperCase())
          .join('')
        return {
          type: g.type || 'Invoice',
          typeStyle: (g.type || 'Invoice').toLowerCase() === 'contract'
            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
            : 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          initials: initials || 'NA',
          client: name,
          date: g.date || new Date(g.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          amount: g.amount || '-',
          amountClass: g.amount && g.amount !== '-' ? 'text-[#f5f5f5]' : 'text-slate-400',
          status: cfg.label,
          statusStyle: cfg.statusStyle,
          dotStyle: cfg.dotStyle,
        }
      })
    return mapped
  }, [generations])

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen overflow-hidden flex font-display antialiased">

      {/* ── Sidebar ── */}
      <Sidebar active="dashboard" />

      {/* ── Main content ── */}
      <main className="flex-1 h-screen overflow-y-auto no-scrollbar bg-[#0a0a0a] relative" style={{ marginLeft: sidebarCollapsed ? '60px' : '260px', transition: 'margin-left 300ms ease-in-out' }}>
        <div className="max-w-7xl mx-auto p-8 flex flex-col gap-8">

          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                <span>{dateStr}</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">Welcome back, {displayName} 👋</h2>
              <p className="text-slate-400">Here's what's happening with your projects today.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/clients')}
                className="h-11 px-5 rounded-lg border border-[#27272a] bg-[#1a1a1a] text-slate-300 font-medium hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Add Client</span>
              </button>
              <button
                onClick={() => navigate('/invoice-generator')}
                className="h-11 px-5 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-[#0a0a0a] font-bold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              >
                <span className="material-symbols-outlined text-[20px]">bolt</span>
                <span>New Invoice</span>
              </button>
            </div>
          </header>

          {/* Stats cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Total Clients */}
            <div className="bg-[#1a1a1a] border border-[#27272a] p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden group hover:border-[#27272a]/80 transition-all shadow-none">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-lg bg-[#111111] border border-[#27272a] text-slate-400">
                  <span className="material-symbols-outlined">group</span>
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Clients</p>
                <h3 className="text-2xl font-bold text-[#f5f5f5] mt-1">{clients.length}</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">All time</p>
            </div>

            {/* Total Invoices */}
            <div className="bg-[#1a1a1a] border border-[#27272a] p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden group hover:border-[#27272a]/80 transition-all shadow-none">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-lg bg-[#111111] border border-[#27272a] text-slate-400">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Invoices</p>
                <h3 className="text-2xl font-bold text-[#f5f5f5] mt-1">{invoiceGenerations.length}</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">All time</p>
            </div>

            {/* Active Contracts */}
            <div className="bg-[#1a1a1a] border border-[#27272a] p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden group hover:border-[#27272a]/80 transition-all shadow-none">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-lg bg-[#111111] border border-[#27272a] text-slate-400">
                  <span className="material-symbols-outlined">contract</span>
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Contracts</p>
                <h3 className="text-2xl font-bold text-[#f5f5f5] mt-1">{activeContractsCount}</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">All time</p>
            </div>

            {/* Pending Payments */}
            <div className="bg-[#1a1a1a] border border-[#27272a] p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden group hover:border-[#22c55e]/30 transition-all shadow-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/5 to-transparent pointer-events-none"></div>
              <div className="flex items-start justify-between relative z-10">
                <div className="p-2.5 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e]">
                  <span className="material-symbols-outlined">payments</span>
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-slate-400 text-sm font-medium">Pending Payments</p>
                <h3 className="text-2xl font-bold text-[#f5f5f5] mt-1">
                  {`$${pendingOrOverdueTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium relative z-10">Includes Overdue &amp; Pending</p>
            </div>
          </section>

          {/* Recent Generations */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#f5f5f5]">Recent Generations</h3>
              <button
                onClick={() => navigate('/my-generations')}
                className="text-sm font-medium text-[#22c55e] hover:text-[#16a34a] flex items-center gap-1 transition-colors"
              >
                View all
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-[#27272a] bg-[#1a1a1a] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#111111] border-b border-[#27272a] text-slate-400 uppercase text-xs font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-4 w-32">Type</th>
                      <th className="px-6 py-4">Client Name</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272a]/50 text-slate-200">
                    {recentRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3 text-slate-500">
                            <span className="material-symbols-outlined text-4xl text-slate-600">receipt_long</span>
                            <p className="text-sm font-medium">No activity yet</p>
                            <p className="text-xs">Generate your first invoice or contract to see it here.</p>
                          </div>
                        </td>
                      </tr>
                    ) : recentRows.map((row, i) => (
                      <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${row.typeStyle}`}>
                            {row.type}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                              {row.initials}
                            </div>
                            <span className="font-medium text-[#f5f5f5]">{row.client}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{row.date}</td>
                        <td className={`px-6 py-4 font-medium ${row.amountClass}`}>{row.amount}</td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${row.statusStyle}`}>
                            <span className={`size-1.5 rounded-full ${row.dotStyle}`}></span>
                            {row.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => navigate('/my-generations')} className="text-slate-500 hover:text-[#22c55e] p-1 rounded-md hover:bg-[#22c55e]/10 transition-colors" title="View details">
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
