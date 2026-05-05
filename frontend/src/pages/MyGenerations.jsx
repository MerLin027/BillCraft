import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// ── Status badge config — filled pills ────────────────────────────────────────
const STATUS_CONFIG = {
  paid:    { label: 'Paid',    pill: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' },
  active:  { label: 'Active',  pill: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' },
  pending: { label: 'Pending', pill: 'bg-amber-500/15   text-amber-400   border border-amber-500/25'   },
  overdue: { label: 'Overdue', pill: 'bg-red-500/15     text-red-400     border border-red-500/25'     },
  expired: { label: 'Expired', pill: 'bg-[#2a2a2a]      text-[#a3a3a3]   border border-[#3a3a3a]'     },
}

// ── Text colour per status (for dropdown text + chevron) ─────────────────────
const STATUS_TEXT = {
  paid:    'text-emerald-400',
  active:  'text-emerald-400',
  pending: 'text-amber-400',
  overdue: 'text-red-400',
  expired: 'text-[#a3a3a3]',
}

function toAmountFromPayload(g) {
  if (g.amount && g.amount !== '-') return g.amount
  const items = g.downloadPayload?.items
  if (!Array.isArray(items)) return '-'
  const total = items.reduce((sum, it) => sum + (Number(it.rate) || 0) * (Number(it.qty) || 0), 0)
  if (total <= 0) return '-'
  return `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function StatusBadge({ status, options, onChange }) {
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 })
  const btnRef  = useRef(null)
  const dropRef = useRef(null)
  const cfg       = STATUS_CONFIG[status] ?? STATUS_CONFIG.expired
  const textColor = STATUS_TEXT[status]   ?? 'text-[#a3a3a3]'

  function handleOpen() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setDropPos({ top: rect.bottom + 4, left: rect.left })
    }
    setOpen(v => !v)
  }

  // Close only when clicking outside both the trigger AND the portal panel
  useEffect(() => {
    if (!open) return
    function handleMouseDown(e) {
      if (dropRef.current?.contains(e.target)) return  // inside portal panel
      if (btnRef.current?.contains(e.target))  return  // inside trigger button
      setOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open])

  return (
    <div className="relative inline-block">
      {/* Trigger pill */}
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className={`
          inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
          text-xs font-medium cursor-pointer transition-colors
          ${cfg.pill}
        `}
      >
        <span>{cfg.label}</span>
        <span
          className={`material-symbols-outlined leading-none ${textColor}`}
          style={{ fontSize: '12px' }}
        >
          expand_more
        </span>
      </button>

      {/* Portal — renders on document.body, fully outside the overflow:auto table */}
      {open && createPortal(
        <div
          ref={dropRef}
          style={{ top: dropPos.top, left: dropPos.left }}
          className="fixed z-[9999] min-w-[110px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl py-1 overflow-hidden"
        >
          {options.map(opt => {
            const optCfg = STATUS_CONFIG[opt] ?? STATUS_CONFIG.expired
            const optText = STATUS_TEXT[opt]   ?? 'text-[#a3a3a3]'
            return (
              <button
                key={opt}
                type="button"
                onMouseDown={e => e.stopPropagation()}   // prevent the doc listener from firing first
                onClick={() => { onChange(opt); setOpen(false) }}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-[#22c55e]/10 transition-colors ${optText} ${
                  opt === status ? 'bg-[#22c55e]/5' : ''
                }`}
              >
                {optCfg.label}
              </button>
            )
          })}
        </div>,
        document.body
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MyGenerations() {
  const navigate = useNavigate()
  const { user, generations, updateGenerationStatus, deleteGeneration, sidebarCollapsed } = useApp()
  const [downloadError, setDownloadError] = useState('')
  const [busyDownloadId, setBusyDownloadId] = useState('')

  // F-4: Map MongoDB generations — use _id; no static demo merge
  const allRows = generations.map(g => ({
    _id:           g._id,
    id:            g.invoiceNumber || g._id,  // display label
    title:         g.title,
    subtitle:      g.subtitle || 'Invoice',
    type:          g.type || 'Invoice',
    typeIcon:      g.typeIcon || 'receipt_long',
    date:          g.date || (g.createdAt ? new Date(g.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'),
    dateRed:       false,
    amount:        toAmountFromPayload(g),
    status:        g.status?.toLowerCase() || 'pending',
    statusOptions: g.type === 'Contract' ? ['active', 'expired'] : ['paid', 'pending', 'overdue'],
    downloadKind:  g.downloadKind || ((g.type || '').toLowerCase() === 'contract' ? 'contract' : 'invoice'),
    downloadPayload: g.downloadPayload,
  }))
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const PER_PAGE = 8

  const filteredRows = allRows.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages  = Math.max(1, Math.ceil(filteredRows.length / PER_PAGE))
  const pageStart   = Math.min((currentPage - 1) * PER_PAGE + 1, filteredRows.length || 1)
  const pageEnd     = Math.min(currentPage * PER_PAGE, filteredRows.length)
  const pagedRows   = filteredRows.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  // F-4: update status via API using MongoDB _id
  async function handleStatusChange(row, newStatus) {
    if (row._id) {
      await updateGenerationStatus(row._id, newStatus)
    }
  }

  async function handleDownload(row, format) {
    const endpointMap = {
      invoice: {
        pdf: '/api/invoices/download',
        word: '/api/invoices/word',
      },
      contract: {
        pdf: '/api/contracts/download',
        word: '/api/contracts/word',
      },
    }
    const kind = row.downloadKind || 'invoice'
    const endpoint = endpointMap[kind]?.[format]
    if (!endpoint || !row.downloadPayload) {
      setDownloadError('This draft was saved before download data was available. Please open and save it again.')
      return
    }
    setDownloadError('')
    setBusyDownloadId(`${row.id}:${format}`)
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row.downloadPayload),
      })
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const ext = format === 'pdf' ? 'pdf' : 'docx'
      const safeName = (row.title || row.id || 'document').replace(/[^\w.-]+/g, '_')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${safeName}.${ext}`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setDownloadError('Download failed. Ensure backend is running on port 4000 and try again.')
    } finally {
      setBusyDownloadId('')
    }
  }

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] font-display antialiased overflow-hidden flex h-screen w-full flex-row">

      {/* ── Sidebar ── */}
      <Sidebar active="my-generations" />

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col h-full relative bg-[#0a0a0a]" style={{ marginLeft: sidebarCollapsed ? '60px' : '260px', transition: 'margin-left 300ms ease-in-out' }}>

        {/* ── Header — exact match to ClientScreen ── */}
        <header className="px-8 pt-10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">My Generations</h2>
            <p className="text-slate-400">Manage your past invoices and contracts.</p>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#a3a3a3]">
              <span className="material-symbols-outlined text-sm">info</span>
              <span>
                Auto-update: Status flips to{' '}
                <span className="text-[#ef4444] font-semibold">Overdue</span>{' '}
                if date passes due.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#a3a3a3] group-focus-within:text-[#22c55e] transition-colors">search</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2.5 border border-[#2a2a2a] rounded-lg leading-5 bg-[#1a1a1a] text-white placeholder-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] sm:text-sm transition-all"
                placeholder="Search generations..."
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </header>
        {downloadError && (
          <div className="mx-8 mt-0 mb-2 flex items-center gap-2 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg px-4 py-2.5">
            <span className="material-symbols-outlined text-[14px] text-[#ef4444]">error</span>
            <p className="text-xs text-[#ef4444] font-medium">{downloadError}</p>
          </div>
        )}

        {/* ── Table area — exact match to ClientScreen ── */}
        <div className="flex-1 overflow-y-auto p-4 md:px-8 md:pt-5 md:pb-8">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">

                {/* ── Table header — green text + green/10 bg, exact ClientScreen style ── */}
                <thead>
                  <tr className="bg-[#22c55e]/10 border-b border-[#2a2a2a] text-[#a3a3a3] text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">#ID</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Client / Title</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Type</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Date</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Amount</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Status</th>
                    <th className="px-6 py-4 font-semibold text-right text-[#22c55e]">Download</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#2a2a2a] text-sm">
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-[#888888] text-sm">No generations found.</td>
                    </tr>
                  )}
                  {pagedRows.map((row, i) => (
                    <tr key={row.id} className="group hover:bg-[#22c55e]/5 transition-colors cursor-pointer">

                      {/* ID */}
                      <td className="px-6 py-4 font-mono text-[#a3a3a3]">{row.id}</td>

                      {/* Client / Title */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{row.title}</div>
                        <div className="text-xs text-[#a3a3a3] mt-0.5">{row.subtitle}</div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#a3a3a3] text-[20px]">
                            {row.typeIcon}
                          </span>
                          <span className="text-white font-medium">{row.type}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td
                        className={`px-6 py-4 ${
                          row.dateRed ? 'text-[#ef4444] font-semibold' : 'text-[#a3a3a3]'
                        }`}
                      >
                        {row.date}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 font-mono text-white font-medium">{row.amount}</td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={row.status}
                          options={row.statusOptions}
                          onChange={newStatus => handleStatusChange(row, newStatus)}
                        />
                      </td>

                      {/* Download */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="px-3 py-1.5 rounded-md bg-transparent border border-[#2a2a2a] text-[#a3a3a3] hover:text-[#ef4444] hover:border-[#ef4444] text-xs font-medium transition-colors flex items-center gap-1"
                            title="Download PDF"
                            onClick={() => handleDownload(row, 'pdf')}
                            disabled={busyDownloadId === `${row.id}:pdf`}
                          >
                            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                            {busyDownloadId === `${row.id}:pdf` ? '...' : 'PDF'}
                          </button>
                          <button
                            className="px-3 py-1.5 rounded-md bg-transparent border border-[#2a2a2a] text-[#a3a3a3] hover:text-[#22c55e] hover:border-[#22c55e] text-xs font-medium transition-colors flex items-center gap-1"
                            title="Download Word"
                            onClick={() => handleDownload(row, 'word')}
                            disabled={busyDownloadId === `${row.id}:word`}
                          >
                            <span className="material-symbols-outlined text-sm">description</span>
                            {busyDownloadId === `${row.id}:word` ? '...' : 'Word'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <div className="border-t border-[#2a2a2a] px-6 py-4 flex items-center justify-between bg-[#1a1a1a]">
              <div className="text-xs text-[#a3a3a3]">
                Showing <span className="text-white font-semibold">{filteredRows.length === 0 ? 0 : pageStart}</span> to{' '}
                <span className="text-white font-semibold">{pageEnd}</span> of{' '}
                <span className="text-white font-semibold">{filteredRows.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#2a2a2a] text-[#a3a3a3] hover:bg-[#2a2a2a] hover:text-white transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg text-sm font-bold ${
                      p === currentPage
                        ? 'bg-[#22c55e] text-white border border-[#22c55e]'
                        : 'border border-[#2a2a2a] text-[#a3a3a3] hover:bg-[#2a2a2a] hover:text-white transition-colors'
                    }`}
                  >{p}</button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#2a2a2a] text-[#a3a3a3] hover:bg-[#2a2a2a] hover:text-white transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

