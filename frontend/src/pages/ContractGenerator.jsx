import { useState, useMemo, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'
import ContractBuilderEditor from './ContractBuilderEditor'
import { getToken, API_BASE } from '../services/api'

const STATUS_CONFIG = {
  Draft:  { label: 'Draft',  pill: 'bg-[#2a2a2a] text-[#a3a3a3] border border-[#3a3a3a]',              text: 'text-[#a3a3a3]' },
  Sent:   { label: 'Sent',   pill: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',        text: 'text-amber-400' },
  Signed: { label: 'Signed', pill: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25', text: 'text-emerald-400' },
}

function ContractStatusBadge({ status, onChange }) {
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 })
  const btnRef  = useRef(null)
  const dropRef = useRef(null)
  const cfg       = STATUS_CONFIG[status] ?? STATUS_CONFIG.Draft
  const textColor = cfg.text

  function handleOpen() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setDropPos({ top: rect.bottom + 4, left: rect.left })
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e) {
      if (dropRef.current?.contains(e.target)) return
      if (btnRef.current?.contains(e.target))  return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open])

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${cfg.pill}`}
      >
        <span>{cfg.label}</span>
        <span className={`material-symbols-outlined leading-none ${textColor}`} style={{ fontSize: '12px' }}>expand_more</span>
      </button>

      {open && createPortal(
        <div
          ref={dropRef}
          style={{ top: dropPos.top, left: dropPos.left }}
          className="fixed z-[9999] min-w-[110px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl py-1 overflow-hidden"
        >
          {Object.keys(STATUS_CONFIG).map(opt => {
            const oc = STATUS_CONFIG[opt]
            return (
              <button
                key={opt}
                type="button"
                onMouseDown={e => e.stopPropagation()}
                onClick={() => { onChange(opt); setOpen(false) }}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[#2a2a2a] flex items-center gap-2 ${oc.text}`}
              >
                {opt === status && <span className="material-symbols-outlined text-[12px]">check</span>}
                {opt !== status && <span className="w-[12px]" />}
                {oc.label}
              </button>
            )
          })}
        </div>,
        document.body
      )}
    </div>
  )
}

export default function ContractGenerator() {
  const { sidebarCollapsed, generations, updateGeneration, updateGenerationStatus, deleteGeneration } = useApp()

  const [view,        setView]        = useState('list')
  const [editOpen,    setEditOpen]    = useState(false)
  const [deleteOpen,  setDeleteOpen]  = useState(false)
  const [selectedId,  setSelectedId]  = useState(null)   // MongoDB _id of selected contract
  const [editForm,    setEditForm]    = useState({})
  const [search,      setSearch]      = useState('')
  const [fading,      setFading]      = useState(false)
  const [downloading, setDownloading] = useState(null)
  const [actionError, setActionError] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [editError,   setEditError]   = useState('')

  // Pull only 'Contract' type generations from the real DB
  const contractList = useMemo(
    () => generations.filter(g => (g.type || '').toLowerCase() === 'contract'),
    [generations]
  )

  const filteredContracts = useMemo(() => {
    const q = search.toLowerCase()
    return contractList.filter(c =>
      (c.title || '').toLowerCase().includes(q) ||
      (c.subtitle || '').toLowerCase().includes(q)
    )
  }, [contractList, search])

  // Map DB generation status → contract STATUS_CONFIG key
  function toContractStatus(dbStatus) {
    const s = (dbStatus || '').toLowerCase()
    if (s === 'paid' || s === 'signed') return 'Signed'
    if (s === 'active' || s === 'sent') return 'Sent'
    return 'Draft'
  }

  async function handleStatusChange(contractId, val) {
    setActionError('')
    // Map displayed status back to DB status
    const dbStatus = val === 'Signed' ? 'paid' : val === 'Sent' ? 'active' : 'pending'
    const result = await updateGenerationStatus(contractId, dbStatus)
    if (!result.ok) setActionError(result.isNetworkError ? 'Server offline — status not saved.' : result.error)
  }

  async function handleDelete() {
    if (!selectedId) return
    setActionError('')
    const result = await deleteGeneration(selectedId)
    if (!result.ok) setActionError(result.isNetworkError ? 'Server offline — could not delete.' : result.error)
    setDeleteOpen(false)
    setSelectedId(null)
  }

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  async function handleDownload(c) {
    setDownloading(c._id || c.title)
    setActionError('')
    try {
      const payload = c.downloadPayload || {
        contractTitle: c.title,
        freelancerName: '',
        freelancerEmail: '',
        effectiveDate: c.date,
        clientName: c.subtitle || c.title,
        businessName: c.subtitle || c.title,
        clientPhone: '',
        businessType: c.subtitle || 'Service Agreement',
        items: [{ desc: c.subtitle || 'Service', rate: 0, qty: 1 }],
        deposit: 50, dueDate: 'Net 30',
        milestones: false, lateFee: true, ipTransfer: true, portfolio: false,
      }
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/contracts/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Server ${res.status}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Contract-${c.title || 'document'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setActionError(`Download failed: ${err?.message || 'Please ensure the backend is running.'}`)
    } finally {
      setDownloading(null)
    }
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
      <main className="flex-1 flex flex-col h-full bg-[#0a0a0a]" style={{ marginLeft: sidebarCollapsed ? '60px' : '260px', transition: 'margin-left 300ms ease-in-out' }}>

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
              className="h-11 px-5 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-[#0a0a0a] font-bold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
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
                  {filteredContracts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-500">
                          <span className="material-symbols-outlined text-4xl text-slate-600">gavel</span>
                          <p className="text-sm font-medium">No contracts yet</p>
                          <p className="text-xs">Click "New Contract" to build your first contract.</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredContracts.map((c) => {
                    const contractStatus = toContractStatus(c.status)
                    return (
                    <tr key={c._id} className="group hover:bg-[#22c55e]/5 transition-colors">
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
                          <div className="h-7 w-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-500/30">
                            {(c.title || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[#a3a3a3]">{c.subtitle || 'Service Agreement'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-800/50">
                          {c.subtitle || 'Contract'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <ContractStatusBadge
                          status={contractStatus}
                          onChange={val => handleStatusChange(c._id, val)}
                        />
                      </td>
                      <td className="px-6 py-4 text-[#a3a3a3]">{c.date || new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="px-3 py-1.5 rounded-md bg-transparent border border-[#2a2a2a] text-[#a3a3a3] hover:text-[#22c55e] hover:border-[#22c55e] text-xs font-medium transition-colors"
                            onClick={() => { setSelectedId(c._id); setEditForm({ title: c.title, subtitle: c.subtitle }); setEditOpen(true) }}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1.5 rounded-md bg-transparent border border-[#2a2a2a] text-[#a3a3a3] hover:text-[#ef4444] hover:border-[#ef4444] text-xs font-medium transition-colors"
                            onClick={() => { setSelectedId(c._id); setDeleteOpen(true) }}
                          >
                            Delete
                          </button>
                          <button
                            className="px-3 py-1.5 rounded-md bg-transparent border border-[#2a2a2a] text-[#a3a3a3] hover:text-[#22c55e] hover:border-[#22c55e] text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
                            onClick={() => handleDownload(c)}
                            disabled={downloading === c._id}
                          >
                            <span className="material-symbols-outlined text-[14px] text-[#22c55e]">download</span>
                            <span>{downloading === c._id ? 'Downloading…' : 'Download'}</span>
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
                Showing <span className="text-white font-semibold">{filteredContracts.length}</span> contract{filteredContracts.length !== 1 ? 's' : ''}
              </div>
              {actionError && (
                <div className="flex items-center gap-1.5 text-xs text-amber-400">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  {actionError}
                </div>
              )}
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
                <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-title" type="text" value={editForm.title || ''} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-client">Client Name</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-client" type="text" value={editForm.client || ''} onChange={e => setEditForm(p => ({ ...p, client: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-type">Contract Type</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-type" type="text" value={editForm.type || ''} onChange={e => setEditForm(p => ({ ...p, type: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-status">Status</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-status" type="text" value={editForm.status || ''} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))} />
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
                className="px-4 py-2 bg-[#22c55e] text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors shadow-md shadow-[#22c55e]/20 flex items-center gap-1.5 disabled:opacity-70"
                disabled={editLoading}
                onClick={async () => {
                  if (!editForm.title?.trim()) { setEditError('Title is required.'); return }
                  setEditError('')
                  setEditLoading(true)
                  const result = await updateGeneration(selectedId, {
                    title:    editForm.title.trim(),
                    subtitle: editForm.client?.trim() || editForm.subtitle || '',
                  })
                  setEditLoading(false)
                  if (!result.ok) {
                    setEditError(result.isNetworkError ? 'Server offline — changes not saved.' : result.error || 'Save failed.')
                    return
                  }
                  setEditOpen(false)
                  setEditError('')
                }}
              >
                {editLoading && <span className="material-symbols-outlined text-[15px] animate-spin">progress_activity</span>}
                {editLoading ? 'Saving…' : 'Save Changes'}
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
                  onClick={handleDelete}
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
