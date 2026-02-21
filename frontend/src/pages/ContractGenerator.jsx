import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'
import ContractBuilderEditor from './ContractBuilderEditor'

const STATIC_CONTRACTS = [
  {
    title: 'Web Development Agreement',
    client: 'John Doe',
    clientInitials: 'JD',
    avatarBg: 'bg-purple-500/20',
    avatarText: 'text-purple-400',
    avatarBorder: 'border-purple-500/30',
    type: 'Service Agreement',
    typeBg: 'bg-blue-900/30',
    typeText: 'text-blue-300',
    typeBorder: 'border-blue-800/50',
    status: 'Signed',
    statusBg: 'bg-green-900/30',
    statusText: 'text-green-300',
    statusBorder: 'border-green-800/50',
    date: 'Oct 24, 2023',
  },
  {
    title: 'Brand Identity NDA',
    client: 'Jane Smith',
    clientInitials: 'JS',
    avatarBg: 'bg-blue-500/20',
    avatarText: 'text-blue-400',
    avatarBorder: 'border-blue-500/30',
    type: 'NDA',
    typeBg: 'bg-orange-900/30',
    typeText: 'text-orange-300',
    typeBorder: 'border-orange-800/50',
    status: 'Sent',
    statusBg: 'bg-yellow-900/30',
    statusText: 'text-yellow-300',
    statusBorder: 'border-yellow-800/50',
    date: 'Oct 22, 2023',
  },
  {
    title: 'Logo Design Contract',
    client: 'Robert Paulson',
    clientInitials: 'RP',
    avatarBg: 'bg-teal-500/20',
    avatarText: 'text-teal-400',
    avatarBorder: 'border-teal-500/30',
    type: 'Design Contract',
    typeBg: 'bg-teal-900/30',
    typeText: 'text-teal-300',
    typeBorder: 'border-teal-800/50',
    status: 'Draft',
    statusBg: 'bg-[#2a2a2a]',
    statusText: 'text-[#a3a3a3]',
    statusBorder: 'border-[#3a3a3a]',
    date: 'Oct 20, 2023',
  },
  {
    title: 'SEO Retainer Agreement',
    client: 'Peter Lumburgh',
    clientInitials: 'PL',
    avatarBg: 'bg-orange-500/20',
    avatarText: 'text-orange-400',
    avatarBorder: 'border-orange-500/30',
    type: 'Retainer',
    typeBg: 'bg-purple-900/30',
    typeText: 'text-purple-300',
    typeBorder: 'border-purple-800/50',
    status: 'Signed',
    statusBg: 'bg-green-900/30',
    statusText: 'text-green-300',
    statusBorder: 'border-green-800/50',
    date: 'Oct 18, 2023',
  },
  {
    title: 'Security Audit Contract',
    client: 'Albert Wesker',
    clientInitials: 'AW',
    avatarBg: 'bg-red-500/20',
    avatarText: 'text-red-400',
    avatarBorder: 'border-red-500/30',
    type: 'Service Agreement',
    typeBg: 'bg-blue-900/30',
    typeText: 'text-blue-300',
    typeBorder: 'border-blue-800/50',
    status: 'Sent',
    statusBg: 'bg-yellow-900/30',
    statusText: 'text-yellow-300',
    statusBorder: 'border-yellow-800/50',
    date: 'Oct 15, 2023',
  },
]

const STATUS_STYLES = {
  Draft:  { bg: 'bg-[#2a2a2a]',       text: 'text-[#a3a3a3]',  border: 'border-[#3a3a3a]',      select: '#a3a3a3' },
  Sent:   { bg: 'bg-yellow-900/30',   text: 'text-yellow-300', border: 'border-yellow-800/50',   select: '#fde047' },
  Signed: { bg: 'bg-green-900/30',    text: 'text-green-300',  border: 'border-green-800/50',    select: '#86efac' },
}

export default function ContractGenerator() {
  const { user, clients, generations } = useApp()

  const [view,       setView]       = useState('list')
  const [editOpen,   setEditOpen]   = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [search,     setSearch]     = useState('')
  const [statuses,   setStatuses]   = useState(() => STATIC_CONTRACTS.map(c => c.status))
  const [fading,     setFading]     = useState(false)

  function setStatus(i, val) {
    setStatuses(prev => prev.map((s, idx) => idx === i ? val : s))
  }

  function transitionTo(cb) {
    setFading(true)
    setTimeout(() => {
      cb()
      requestAnimationFrame(() => requestAnimationFrame(() => setFading(false)))
    }, 220)
  }

  function openEditor()  { transitionTo(() => setView('editor')) }
  function closeEditor() { transitionTo(() => setView('list'))   }

  return (
    <>
      {/* Persistent fade overlay — stays mounted in both views */}
      <div
        className="fixed inset-0 bg-[#0a0a0a] z-[200] pointer-events-none"
        style={{ opacity: fading ? 1 : 0, transition: 'opacity 220ms ease-in-out' }}
      />

      {view === 'editor'
        ? <ContractBuilderEditor onBack={closeEditor} />
        : (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] font-display antialiased overflow-hidden flex h-screen w-full flex-row">

      {/* Sidebar */}
      <Sidebar active="contract-builder" />

      {/* Main */}
      <main className="flex-1 flex flex-col h-full bg-[#0a0a0a] ml-[260px]">

        {/* Header */}
        <header className="px-8 pt-10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">Contract Builder</h2>
            <p className="text-slate-400">Create and manage your client contracts.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#a3a3a3] group-focus-within:text-[#22c55e] transition-colors">search</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2.5 border border-[#2a2a2a] rounded-lg leading-5 bg-[#1a1a1a] text-white placeholder-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] sm:text-sm transition-all"
                placeholder="Search contracts..."
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={openEditor}
              className="flex items-center gap-2 bg-[#22c55e] hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#22c55e]/20 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              <span className="hidden md:inline">New Contract</span>
            </button>
          </div>
        </header>

        {/* Table area */}
        <div className="flex-1 overflow-y-auto px-8 pt-5 pb-8">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#22c55e]/10 border-b border-[#2a2a2a] text-[#a3a3a3] text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Contract Title</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Client</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Type</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Status</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Date Created</th>
                    <th className="px-6 py-4 font-semibold text-right text-[#22c55e]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a] text-sm">
                  {STATIC_CONTRACTS.map((c, i) => {
                    const s = statuses[i]
                    const ss = STATUS_STYLES[s] ?? STATUS_STYLES.Draft
                    return (
                    <tr key={i} className="group hover:bg-[#22c55e]/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#22c55e] text-[18px]">gavel</span>
                          </div>
                          <div className="font-bold text-white">{c.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-7 w-7 rounded-full ${c.avatarBg} ${c.avatarText} flex items-center justify-center font-bold text-xs border ${c.avatarBorder}`}>
                            {c.clientInitials}
                          </div>
                          <span className="text-[#a3a3a3]">{c.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.typeBg} ${c.typeText} border ${c.typeBorder}`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={s}
                          onChange={e => setStatus(i, e.target.value)}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#22c55e] transition-colors ${ss.bg} ${ss.text} ${ss.border}`}
                          style={{ colorScheme: 'dark' }}
                        >
                          {Object.keys(STATUS_STYLES).map(opt => (
                            <option key={opt} value={opt} style={{ background: '#1a1a1a', color: STATUS_STYLES[opt].select }}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-[#a3a3a3]">{c.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="px-3 py-1.5 rounded-md bg-transparent border border-[#2a2a2a] text-[#a3a3a3] hover:text-[#22c55e] hover:border-[#22c55e] text-xs font-medium transition-colors"
                            onClick={() => setEditOpen(true)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1.5 rounded-md bg-transparent border border-[#2a2a2a] text-[#a3a3a3] hover:text-[#ef4444] hover:border-[#ef4444] text-xs font-medium transition-colors"
                            onClick={() => setDeleteOpen(true)}
                          >
                            Delete
                          </button>
                          <button
                            className="px-3 py-1.5 rounded-md bg-transparent border border-[#2a2a2a] text-[#a3a3a3] hover:text-[#22c55e] hover:border-[#22c55e] text-xs font-medium transition-colors flex items-center gap-1"
                            onClick={() => {}}
                          >
                            <span className="material-symbols-outlined text-[14px] text-[#22c55e]">download</span>
                            <span>Download</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-[#2a2a2a] px-6 py-4 flex items-center justify-between bg-[#1a1a1a]">
              <div className="text-xs text-[#a3a3a3]">
                Showing <span className="text-white font-semibold">1</span> to <span className="text-white font-semibold">5</span> of <span className="text-white font-semibold">12</span> contracts
              </div>
              <div className="flex items-center gap-2">
                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#2a2a2a] text-[#a3a3a3] hover:bg-[#2a2a2a] hover:text-white transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#22c55e] text-white border border-[#22c55e] text-sm font-bold">1</button>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#2a2a2a] text-[#a3a3a3] hover:bg-[#2a2a2a] hover:text-white transition-colors text-sm">2</button>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#2a2a2a] text-[#a3a3a3] hover:bg-[#2a2a2a] hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Edit Modal ── */}
      {editOpen && (
        <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
          <div
            className="absolute w-full h-full bg-black/80 backdrop-blur-sm"
            onClick={() => setEditOpen(false)}
          />
          <div className="relative bg-[#1a1a1a] w-full md:max-w-lg mx-auto rounded-xl shadow-2xl z-50 overflow-y-auto max-h-[90vh] border border-[#2a2a2a]">
            <div className="flex justify-between items-center py-4 px-6 border-b border-[#2a2a2a]">
              <p className="text-xl font-bold text-white">Edit Contract</p>
              <div className="cursor-pointer z-50" onClick={() => setEditOpen(false)}>
                <span className="material-symbols-outlined text-[#a3a3a3] hover:text-white transition-colors">close</span>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-title">Contract Title</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-title" type="text" defaultValue="Web Development Agreement" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-client">Client Name</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-client" type="text" defaultValue="John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-type">Contract Type</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-type" type="text" defaultValue="Service Agreement" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-status">Status</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-status" type="text" defaultValue="Signed" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 bg-[#111111] rounded-b-xl border-t border-[#2a2a2a]">
              <button
                className="px-4 py-2 bg-transparent border border-[#2a2a2a] text-[#a3a3a3] rounded-lg text-sm font-semibold hover:bg-[#0a0a0a] hover:text-white transition-colors"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#22c55e] text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors shadow-md shadow-[#22c55e]/20"
                onClick={() => setEditOpen(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleteOpen && (
        <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
          <div
            className="absolute w-full h-full bg-black/80 backdrop-blur-sm"
            onClick={() => setDeleteOpen(false)}
          />
          <div className="relative bg-[#1a1a1a] w-full md:max-w-md mx-auto rounded-xl shadow-2xl z-50 border border-[#2a2a2a]">
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-900/20 flex items-center justify-center mx-auto mb-4 border border-red-900/30">
                <span className="material-symbols-outlined text-3xl text-red-500">warning</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
              <p className="text-[#a3a3a3] text-sm mb-6">This will permanently delete the contract. This action cannot be undone.</p>
              <div className="flex justify-center gap-3">
                <button
                  className="px-4 py-2 bg-transparent border border-[#2a2a2a] text-[#a3a3a3] rounded-lg text-sm font-semibold hover:bg-[#0a0a0a] hover:text-white transition-colors w-28"
                  onClick={() => setDeleteOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#ef4444] text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors shadow-md shadow-red-500/20 w-28"
                  onClick={() => setDeleteOpen(false)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
        )
      }
    </>
  )
}
