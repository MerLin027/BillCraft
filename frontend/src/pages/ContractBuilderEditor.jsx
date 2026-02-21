import { useState, useRef, useEffect } from 'react'
import Sidebar from '../components/Sidebar'

const SUGGESTED_CLIENTS = [
  { name: 'Acme Corp',    email: 'contact@acmecorp.com',  businessName: 'Acme Corporation',      phone: '+1 (555) 123-4567', type: 'corporation' },
  { name: 'Globex Inc.',  email: 'billing@globex.com',    businessName: 'Globex International',   phone: '+1 (555) 987-6543', type: 'llc' },
  { name: 'Soylent Corp', email: 'people@soylent.green',  businessName: 'Soylent Corporation',    phone: '+1 (555) 000-1111', type: 'partnership' },
]

const inputClass =
  'w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-sm'

const sectionLabel = (icon, text) => (
  <div className="flex items-center gap-2 text-[#22c55e] font-bold uppercase text-xs tracking-wider">
    <span className="material-symbols-outlined text-lg">{icon}</span>
    {text}
  </div>
)

export default function ContractBuilderEditor({ onBack }) {
  // Freelancer
  const [freelancerName,  setFreelancerName]  = useState('Jane Doe Designs')
  const [freelancerEmail, setFreelancerEmail] = useState('jane@example.com')
  const [effectiveDate,   setEffectiveDate]   = useState('')

  // Client
  const [clientSearch,   setClientSearch]   = useState('')
  const [showDropdown,   setShowDropdown]   = useState(false)
  const [clientName,     setClientName]     = useState('')
  const [businessName,   setBusinessName]   = useState('')
  const [clientPhone,    setClientPhone]    = useState('')
  const [businessType,   setBusinessType]   = useState('')
  const searchRef = useRef(null)

  // Scope items
  const [items, setItems] = useState([
    { desc: 'Website Design & Development', rate: 4500, qty: 1 },
    { desc: 'SEO Optimization Setup',       rate: 150,  qty: 5 },
  ])

  function updateItem(i, field, val) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: val } : it))
  }
  function addItem()    { setItems(prev => [...prev, { desc: '', rate: 0, qty: 1 }]) }
  function removeItem(i){ setItems(prev => prev.filter((_, idx) => idx !== i)) }

  const total = items.reduce((sum, it) => sum + (parseFloat(it.rate) || 0) * (parseInt(it.qty) || 0), 0)

  // Payment
  const [deposit,     setDeposit]     = useState(50)
  const [dueDate,     setDueDate]     = useState('Net 30')
  const [milestones,  setMilestones]  = useState(false)

  // Clauses
  const [lateFee,     setLateFee]     = useState(true)
  const [ipTransfer,  setIpTransfer]  = useState(true)
  const [portfolio,   setPortfolio]   = useState(false)

  // Preview panel
  const [previewOpen, setPreviewOpen] = useState(true)

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function selectClient(c) {
    setClientName(c.name)
    setBusinessName(c.businessName)
    setClientPhone(c.phone)
    setBusinessType(c.type)
    setClientSearch(c.email)
    setShowDropdown(false)
  }

  const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className="w-11 h-6 bg-[#0a0a0a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22c55e]" />
    </label>
  )

  const fmtMoney = n => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] font-display antialiased overflow-hidden flex h-screen w-full flex-row">

      <Sidebar active="contract-builder" />

      <div className="flex-1 flex flex-col h-screen overflow-hidden ml-[260px]">

        {/* Top bar */}
        <header className="px-8 pt-10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-20 shrink-0">
          <div className="flex flex-col gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-[#a3a3a3] hover:text-[#22c55e] transition-colors w-fit text-sm"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Contracts</span>
            </button>
            <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">New Contract</h2>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Draft your agreement and preview it live.</span>
              <span className="text-xs font-medium bg-amber-900/30 text-amber-400 border border-amber-800 px-2 py-0.5 rounded">
                Draft Pending
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setPreviewOpen(p => !p)}
              title={previewOpen ? 'Hide preview' : 'Show preview'}
              className="hidden xl:flex items-center gap-1.5 rounded-lg h-9 px-3 border border-[#2a2a2a] text-[#a3a3a3] hover:text-white hover:border-[#3a3a3a] text-sm font-medium transition-colors bg-transparent"
            >
              <span className="material-symbols-outlined text-lg">{previewOpen ? 'visibility_off' : 'visibility'}</span>
              <span className="text-xs">{previewOpen ? 'Hide Preview' : 'Show Preview'}</span>
            </button>
            <button className="flex items-center justify-center rounded-lg h-9 px-5 bg-[#22c55e] text-[#0a0a0a] text-sm font-bold hover:bg-green-400 transition-colors shadow-lg shadow-[#22c55e]/20">
              Save
            </button>
          </div>
        </header>

        {/* Body */}
        <main className="flex flex-1 overflow-hidden">

          {/* ── Left: Form ── */}
          <section className="flex-1 flex flex-col overflow-hidden border-r border-[#2a2a2a] bg-[#0a0a0a]">

            {/* Scrollable form area */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="max-w-3xl mx-auto px-6 pt-6 pb-8 flex flex-col gap-5">

                {/* ── Parties Involved ── */}
                <div className="bg-[#111111] rounded-xl border border-[#2a2a2a] overflow-visible">
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#2a2a2a]">
                    {sectionLabel('badge', 'Parties Involved')}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#2a2a2a]">

                    {/* Freelancer column */}
                    <div className="flex flex-col gap-4 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Freelancer</p>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400">Name / Entity</label>
                        <input className={inputClass} placeholder="e.g. Jane Doe Designs" value={freelancerName} onChange={e => setFreelancerName(e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400">Email</label>
                        <input className={inputClass} type="email" value={freelancerEmail} onChange={e => setFreelancerEmail(e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400">Effective Date</label>
                        <input className={inputClass + ' [color-scheme:dark]'} type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} />
                      </div>
                    </div>

                    {/* Client column */}
                    <div className="flex flex-col gap-4 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Client</p>

                      {/* Search with dropdown */}
                      <div className="flex flex-col gap-1.5 relative z-20" ref={searchRef}>
                        <label className="text-xs font-medium text-slate-400">Email (Search existing)</label>
                        <div className="relative">
                          <input
                            className={inputClass}
                            placeholder="Start typing to search..."
                            type="text"
                            value={clientSearch}
                            onChange={e => { setClientSearch(e.target.value); setShowDropdown(true) }}
                            onFocus={() => setShowDropdown(true)}
                          />
                          <div className="absolute right-3 top-2.5 text-slate-500 pointer-events-none">
                            <span className="material-symbols-outlined text-lg">search</span>
                          </div>
                          {showDropdown && (
                            <div className="absolute top-full left-0 w-full mt-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                              <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-black/20 border-b border-[#2a2a2a] sticky top-0 backdrop-blur-sm">
                                Existing Clients
                              </div>
                              {SUGGESTED_CLIENTS.map((c, i) => (
                                <button
                                  key={i}
                                  className="w-full text-left px-4 py-3 hover:bg-[#252525] flex items-center justify-between group/item transition-colors border-b border-[#2a2a2a]/50 last:border-b-0"
                                  onMouseDown={() => selectClient(c)}
                                >
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium text-white group-hover/item:text-[#22c55e] transition-colors">{c.name}</span>
                                    <span className="text-xs text-slate-400">{c.email}</span>
                                  </div>
                                  <span className="material-symbols-outlined text-[#22c55e] text-sm opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200">check_circle</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400">Contact Name</label>
                        <input className={inputClass} placeholder="e.g. John Smith" value={clientName} onChange={e => setClientName(e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400">Business Name</label>
                        <input className={inputClass} placeholder="e.g. Acme Corp" value={businessName} onChange={e => setBusinessName(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-slate-400">Phone</label>
                          <input className={inputClass} type="tel" placeholder="+1 (555) 000-0000" value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-slate-400">Business Type</label>
                          <select className={inputClass} value={businessType} onChange={e => setBusinessType(e.target.value)} style={{ colorScheme: 'dark' }}>
                            <option value="">Select...</option>
                            <option value="corporation">Corporation</option>
                            <option value="llc">LLC</option>
                            <option value="sole_proprietorship">Sole Proprietorship</option>
                            <option value="non_profit">Non-Profit</option>
                            <option value="partnership">Partnership</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Scope of Work ── */}
                <div className="bg-[#111111] rounded-xl border border-[#2a2a2a] overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2a2a2a]">
                    {sectionLabel('list_alt', 'Scope of Work')}
                    <button onClick={addItem} className="text-xs font-bold text-[#22c55e] hover:text-green-400 flex items-center gap-1 transition-colors">
                      <span className="material-symbols-outlined text-sm">add</span> Add Item
                    </button>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead className="text-slate-500 border-b border-[#2a2a2a] bg-[#0d0d0d]">
                      <tr>
                        <th className="px-5 py-2.5 font-medium text-xs uppercase tracking-wider">Description</th>
                        <th className="px-5 py-2.5 font-medium text-xs uppercase tracking-wider w-24">Rate</th>
                        <th className="px-5 py-2.5 font-medium text-xs uppercase tracking-wider w-16 text-center">Qty</th>
                        <th className="px-5 py-2.5 font-medium text-xs uppercase tracking-wider text-right w-28">Total</th>
                        <th className="px-3 py-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a2a2a]">
                      {items.map((it, i) => (
                        <tr key={i} className="group hover:bg-[#0a0a0a]/60 transition-colors">
                          <td className="px-5 py-3">
                            <input
                              className="w-full bg-transparent border-none p-0 text-[#f5f5f5] focus:ring-0 outline-none placeholder:text-slate-600 text-sm"
                              placeholder="Item description"
                              type="text"
                              value={it.desc}
                              onChange={e => updateItem(i, 'desc', e.target.value)}
                            />
                          </td>
                          <td className="px-5 py-3">
                            <input
                              className="w-full bg-transparent border-none p-0 text-slate-300 focus:ring-0 outline-none text-right text-sm"
                              type="number"
                              value={it.rate}
                              onChange={e => updateItem(i, 'rate', e.target.value)}
                            />
                          </td>
                          <td className="px-5 py-3">
                            <input
                              className="w-full bg-transparent border-none p-0 text-slate-300 focus:ring-0 outline-none text-center text-sm"
                              type="number"
                              value={it.qty}
                              onChange={e => updateItem(i, 'qty', e.target.value)}
                            />
                          </td>
                          <td className="px-5 py-3 text-right text-[#f5f5f5] font-medium text-sm">
                            {fmtMoney((parseFloat(it.rate) || 0) * (parseInt(it.qty) || 0))}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <button
                              onClick={() => removeItem(i)}
                              className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-[#2a2a2a] bg-[#0d0d0d]">
                      <tr>
                        <td className="px-5 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider" colSpan={3}>Total Project Value</td>
                        <td className="px-5 py-3 text-right font-bold text-[#22c55e] text-base">{fmtMoney(total)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* ── Payment Terms ── */}
                <div className="bg-[#111111] rounded-xl border border-[#2a2a2a] overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#2a2a2a]">
                    {sectionLabel('payments', 'Payment Terms')}
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400">Deposit Required (%)</label>
                        <div className="relative">
                          <input
                            className={inputClass}
                            type="number"
                            value={deposit}
                            onChange={e => setDeposit(e.target.value)}
                          />
                          <span className="absolute right-4 top-2.5 text-slate-500 text-sm pointer-events-none">%</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400">Payment Due Date</label>
                        <select className={inputClass} value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ colorScheme: 'dark' }}>
                          <option>Net 15</option>
                          <option>Net 30</option>
                          <option>Due on Receipt</option>
                        </select>
                      </div>
                    </div>
                    <div className="h-px bg-[#2a2a2a]" />
                    <div className="flex items-center gap-3">
                      <input
                        className="rounded border-[#2a2a2a] bg-[#1a1a1a] text-[#22c55e] focus:ring-[#22c55e]/50 size-4 cursor-pointer shrink-0"
                        id="milestones"
                        type="checkbox"
                        checked={milestones}
                        onChange={e => setMilestones(e.target.checked)}
                      />
                      <label className="text-sm text-slate-300 select-none cursor-pointer" htmlFor="milestones">
                        Split remaining balance into milestones
                      </label>
                    </div>
                  </div>
                </div>

                {/* ── Optional Clauses ── */}
                <div className="bg-[#111111] rounded-xl border border-[#2a2a2a] overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#2a2a2a]">
                    {sectionLabel('gavel', 'Optional Clauses')}
                  </div>
                  <div className="divide-y divide-[#2a2a2a]">
                    {[
                      { label: 'Late Payment Fee', desc: 'Include a 5% monthly fee for overdue invoices.', checked: lateFee, set: setLateFee },
                      { label: 'Intellectual Property Transfer', desc: 'Transfer copyright ownership upon full payment.', checked: ipTransfer, set: setIpTransfer },
                      { label: 'Portfolio Rights', desc: 'Retain right to display work in portfolio.', checked: portfolio, set: setPortfolio },
                    ].map(({ label, desc, checked, set }) => (
                      <div key={label} className="flex items-center justify-between px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-[#f5f5f5]">{label}</span>
                          <span className="text-xs text-slate-500">{desc}</span>
                        </div>
                        <Toggle checked={checked} onChange={set} />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom action bar — always visible, never scrolls away */}
            <div className="shrink-0 bg-[#111111] border-t border-[#2a2a2a] px-6 py-3.5 flex items-center justify-between">
              <span className="text-xs text-slate-500">Auto-saved 2m ago</span>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-lg h-9 px-4 border border-[#2a2a2a] text-[#f5f5f5] text-sm font-semibold bg-transparent hover:bg-white/5 transition-colors">
                  <span className="material-symbols-outlined text-base">description</span>
                  Word
                </button>
                <button className="flex items-center gap-2 rounded-lg h-9 px-5 bg-[#22c55e] text-[#0a0a0a] text-sm font-bold hover:bg-green-400 shadow-lg shadow-[#22c55e]/20 transition-all active:scale-95">
                  <span className="material-symbols-outlined text-base">download</span>
                  Download PDF
                </button>
              </div>
            </div>

          </section>

          {/* ── Right: Live Preview ── */}
          <section
            className="hidden xl:flex overflow-hidden bg-[#0c1610] items-center justify-center relative transition-all duration-300 ease-in-out"
            style={{ width: previewOpen ? '50%' : '0', padding: previewOpen ? '2rem' : '0' }}
          >
            <div className="absolute top-6 right-6 z-10 bg-[#111111]/80 backdrop-blur rounded-full px-4 py-2 border border-[#2a2a2a] flex items-center gap-2 shadow-none">
              <div className="size-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Live Preview</span>
            </div>
            <div className="h-full w-full overflow-y-auto no-scrollbar flex justify-center">
              {/* A4 paper */}
              <div
                className="max-w-[595px] w-full min-h-[842px] h-min p-12 text-xs leading-relaxed flex flex-col relative shrink-0"
                style={{ background: '#1a1a1a', color: '#f5f5f5', border: '1px solid #2a2a2a', boxShadow: '0 4px 6px -1px rgba(0,0,0,.5)' }}
              >
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-zinc-700 pb-6 mb-8">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">CONTRACT AGREEMENT</h1>
                    <p className="text-zinc-500 font-mono">#CNT-2023-089</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-zinc-300">{freelancerName || 'Your Name'}</p>
                    <p className="text-zinc-500">Freelancer</p>
                  </div>
                </div>

                <div className="space-y-6 text-zinc-400 flex-1">
                  {/* Intro */}
                  <p>
                    This Independent Contractor Agreement is entered into as of{' '}
                    <span className="bg-[#22c55e]/20 px-1 rounded text-[#22c55e] font-bold">
                      {effectiveDate || 'the Effective Date'}
                    </span>
                    , between{' '}
                    <span className="bg-[#22c55e]/20 px-1 rounded text-[#22c55e] font-bold">
                      {freelancerName || 'Contractor'}
                    </span>{' '}
                    ("Contractor") and{' '}
                    <span className="bg-[#22c55e]/20 px-1 rounded text-[#22c55e] font-bold">
                      {businessName || clientName || 'Client'}
                    </span>{' '}
                    ("Client").
                  </p>

                  {/* Services */}
                  <div>
                    <h3 className="font-bold text-white uppercase text-[10px] tracking-wider mb-2 border-b border-zinc-700 pb-1">
                      1. Services Provided
                    </h3>
                    <p className="mb-3">Contractor agrees to perform the following services for Client:</p>
                    <table className="w-full text-left mb-4 border-collapse">
                      <thead className="bg-zinc-800">
                        <tr>
                          <th className="p-2 border border-zinc-700 font-semibold text-zinc-300">Description</th>
                          <th className="p-2 border border-zinc-700 font-semibold text-right text-zinc-300">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.filter(it => it.desc).map((it, i) => (
                          <tr key={i}>
                            <td className="p-2 border border-zinc-700">{it.desc}</td>
                            <td className="p-2 border border-zinc-700 text-right">{fmtMoney((parseFloat(it.rate)||0)*(parseInt(it.qty)||0))}</td>
                          </tr>
                        ))}
                        <tr className="bg-zinc-800 font-bold">
                          <td className="p-2 border border-zinc-700 text-right text-zinc-200">Total</td>
                          <td className="p-2 border border-zinc-700 text-right text-zinc-200">{fmtMoney(total)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Payment */}
                  <div>
                    <h3 className="font-bold text-white uppercase text-[10px] tracking-wider mb-2 border-b border-zinc-700 pb-1">
                      2. Payment Terms
                    </h3>
                    <p>
                      Client agrees to pay a total fee of{' '}
                      <span className="font-bold text-zinc-200">{fmtMoney(total)}</span>.
                      A deposit of{' '}
                      <span className="font-bold text-zinc-200">{deposit}%</span> is required to commence work.
                      The remaining balance is due {dueDate === 'Due on Receipt' ? 'upon receipt' : `within ${dueDate.replace('Net ', '')} days`}.
                      {lateFee && ' Late payments shall incur a fee of 5% per month.'}
                    </p>
                  </div>

                  {/* IP */}
                  {(ipTransfer || portfolio) && (
                    <div>
                      <h3 className="font-bold text-white uppercase text-[10px] tracking-wider mb-2 border-b border-zinc-700 pb-1">
                        3. Intellectual Property
                      </h3>
                      <p>
                        {ipTransfer && 'Upon full payment, Contractor grants Client exclusive license to the final work product. '}
                        {portfolio && 'Contractor retains the right to display the work in their professional portfolio.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Signatures */}
                <div className="mt-auto pt-12">
                  <div className="grid grid-cols-2 gap-12">
                    <div>
                      <div className="h-16 border-b border-zinc-600 mb-2 relative">
                        <span className="absolute bottom-1 text-zinc-600 font-mono text-[10px] italic">x__________________________</span>
                      </div>
                      <p className="font-bold text-zinc-300">{freelancerName || 'Contractor'}</p>
                      <p className="text-zinc-500 text-[10px]">Contractor</p>
                    </div>
                    <div>
                      <div className="h-16 border-b border-zinc-600 mb-2 relative">
                        <span className="absolute bottom-1 text-zinc-600 font-mono text-[10px] italic">x__________________________</span>
                      </div>
                      <p className="font-bold text-zinc-300">{businessName || clientName || 'Client'}</p>
                      <p className="text-zinc-500 text-[10px]">Client</p>
                    </div>
                  </div>
                </div>

                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                  <div className="text-6xl font-black -rotate-45 uppercase text-white">Preview</div>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
