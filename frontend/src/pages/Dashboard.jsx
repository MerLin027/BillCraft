import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'

const RECENT_ROWS = [
  {
    type: 'Invoice',
    typeStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    initials: 'AC',
    client: 'Acme Corp',
    date: 'Oct 24, 2023',
    amount: '$1,200.00',
    amountClass: 'text-[#f5f5f5]',
    status: 'Paid',
    statusStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dotStyle: 'bg-emerald-400',
  },
  {
    type: 'Contract',
    typeStyle: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    initials: 'SI',
    client: 'Stark Industries',
    date: 'Oct 22, 2023',
    amount: '-',
    amountClass: 'text-slate-400',
    status: 'Active',
    statusStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dotStyle: 'bg-blue-400',
  },
  {
    type: 'Invoice',
    typeStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    initials: 'CS',
    client: 'Cyberdyne Systems',
    date: 'Oct 20, 2023',
    amount: '$850.00',
    amountClass: 'text-[#f5f5f5]',
    status: 'Overdue',
    statusStyle: 'bg-red-500/10 text-red-400 border-red-500/20',
    dotStyle: 'bg-red-400',
  },
  {
    type: 'Invoice',
    typeStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    initials: 'WE',
    client: 'Wayne Enterprises',
    date: 'Oct 18, 2023',
    amount: '$2,400.00',
    amountClass: 'text-[#f5f5f5]',
    status: 'Pending',
    statusStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dotStyle: 'bg-amber-400',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, clients, generations } = useApp()

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

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen overflow-hidden flex font-display antialiased">

      {/* ── Sidebar ── */}
      <Sidebar active="dashboard" />

      {/* ── Main content ── */}
      <main className="flex-1 ml-[260px] h-screen overflow-y-auto no-scrollbar bg-[#0a0a0a] relative">
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
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +16.6%
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Clients</p>
                <h3 className="text-2xl font-bold text-[#f5f5f5] mt-1">12</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">+2 this month</p>
            </div>

            {/* Total Invoices */}
            <div className="bg-[#1a1a1a] border border-[#27272a] p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden group hover:border-[#27272a]/80 transition-all shadow-none">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-lg bg-[#111111] border border-[#27272a] text-slate-400">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +8.2%
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Invoices</p>
                <h3 className="text-2xl font-bold text-[#f5f5f5] mt-1">48</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">+5 this month</p>
            </div>

            {/* Active Contracts */}
            <div className="bg-[#1a1a1a] border border-[#27272a] p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden group hover:border-[#27272a]/80 transition-all shadow-none">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-lg bg-[#111111] border border-[#27272a] text-slate-400">
                  <span className="material-symbols-outlined">contract</span>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-[#111111] px-2 py-1 rounded-full">
                  <span>Same</span>
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Contracts</p>
                <h3 className="text-2xl font-bold text-[#f5f5f5] mt-1">3</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">+1 this month</p>
            </div>

            {/* Pending Payments */}
            <div className="bg-[#1a1a1a] border border-[#27272a] p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden group hover:border-[#22c55e]/30 transition-all shadow-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/5 to-transparent pointer-events-none"></div>
              <div className="flex items-start justify-between relative z-10">
                <div className="p-2.5 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e]">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +12%
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-slate-400 text-sm font-medium">Pending Payments</p>
                <h3 className="text-2xl font-bold text-[#f5f5f5] mt-1">$3,250.00</h3>
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
                    {RECENT_ROWS.map((row, i) => (
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
                          <button className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
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
