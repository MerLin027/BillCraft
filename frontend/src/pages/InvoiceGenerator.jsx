import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'

const SAMPLE_CLIENTS = [
  { name: 'Sarah Jenkins', email: 'sarah.j@techflow.io', company: 'TechFlow Solutions',   phone: '+1 (555) 123-4567', type: 'Software Development', address: '452 Innovation Drive, Suite 200', city: 'San Francisco, CA', zip: '94107' },
  { name: 'Sarah Connor',  email: 'sarah.c@skynet.com',  company: 'Skynet Systems',        phone: '+1 (555) 000-0000', type: 'Technology',            address: '1997 Judgment Day Ave',        city: 'Los Angeles, CA',  zip: '90001' },
]

const inputUnderline =
  'w-full bg-transparent border-0 border-b border-[#2a2a2a] focus:border-[#22c55e] px-0 py-2 text-[#f5f5f5] placeholder-[#888888] focus:ring-0 outline-none transition-colors text-sm'

export default function InvoiceGenerator() {
  const navigate = useNavigate()
  const { user } = useApp()

  // Invoice meta
  const [dateIssued, setDateIssued] = useState('2023-10-27')
  const [dateDue,    setDateDue]    = useState('')

  // Bill From
  const [fromName,   setFromName]   = useState('')
  const [fromEmail,  setFromEmail]  = useState('')
  const [fromStreet, setFromStreet] = useState('')
  const [fromCity,   setFromCity]   = useState('')
  const [fromZip,    setFromZip]    = useState('')

  // Bill To
  const [clientSearch, setClientSearch] = useState('sarah')
  const [showDropdown, setShowDropdown] = useState(true)
  const [toCompany,    setToCompany]    = useState('TechFlow Solutions')
  const [toPhone,      setToPhone]      = useState('+1 (555) 123-4567')
  const [toType,       setToType]       = useState('Software Development')
  const [toStreet,     setToStreet]     = useState('452 Innovation Drive, Suite 200')
  const [toCity,       setToCity]       = useState('San Francisco, CA')
  const [toZip,        setToZip]        = useState('94107')
  const searchRef = useRef(null)

  // Line items
  const [items, setItems] = useState([
    { desc: 'Web Design Services - Homepage', rate: 150.00, qty: 8 },
    { desc: 'Mobile Optimization',            rate: 120.00, qty: 4 },
    { desc: '',                               rate: '',     qty: '' },
  ])

  // Notes & tax
  const [notes,   setNotes]   = useState('')
  const [taxRate, setTaxRate] = useState(10)

  // Computed totals
  const subtotal = items.reduce((s, it) => s + (parseFloat(it.rate) || 0) * (parseInt(it.qty) || 0), 0)
  const taxAmt   = (subtotal * (parseFloat(taxRate) || 0)) / 100
  const totalDue = subtotal + taxAmt
  const fmt = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 })

  function updateItem(i, field, val) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: val } : it))
  }
  function removeItem(i) { setItems(prev => prev.filter((_, idx) => idx !== i)) }
  function addItem()     { setItems(prev => [...prev, { desc: '', rate: '', qty: '' }]) }

  function selectClient(c) {
    setClientSearch(c.email)
    setToCompany(c.company)
    setToPhone(c.phone)
    setToType(c.type)
    setToStreet(c.address)
    setToCity(c.city)
    setToZip(c.zip)
    setShowDropdown(false)
  }

  useEffect(() => {
    function handler(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredClients = SAMPLE_CLIENTS.filter(c =>
    clientSearch === '' ? false :
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase())
  )

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] font-display antialiased min-h-screen flex overflow-hidden">
      <Sidebar active="invoice-generator" />

      <div className="flex-1 flex flex-col h-screen overflow-hidden ml-[260px]">

        {/* ── Header ── */}
        <header className="px-8 pt-10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10 shrink-0">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">Invoice Generator</h2>
            <p className="text-slate-400">Generate and send professional invoices.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center gap-1.5 rounded-lg h-9 px-3 border border-[#2a2a2a] text-[#a3a3a3] hover:text-white hover:border-[#3a3a3a] text-sm font-medium transition-colors bg-transparent">
              <span className="material-symbols-outlined text-lg">save</span>
              <span>Save Draft</span>
            </button>
            <button className="flex items-center gap-1.5 rounded-lg h-9 px-3 border border-[#2a2a2a] text-[#a3a3a3] hover:text-white hover:border-[#3a3a3a] text-sm font-medium transition-colors bg-transparent">
              <span className="material-symbols-outlined text-lg">description</span>
              <span>Word</span>
            </button>
            <button className="flex items-center justify-center gap-1.5 rounded-lg h-9 px-5 bg-[#22c55e] text-[#0a0a0a] text-sm font-bold hover:bg-green-400 transition-colors shadow-lg shadow-[#22c55e]/20">
              <span className="material-symbols-outlined text-lg">download</span>
              <span>Download PDF</span>
            </button>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-8 pb-10 bg-[#0a0a0a]">
          <div className="max-w-[1000px] mx-auto pb-20">

            {/* ── Main card ── */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 md:p-10 mb-8 shadow-2xl">

              {/* ── Logo upload + Invoice meta ── */}
              <div className="flex flex-col lg:flex-row justify-between gap-10 mb-12 border-b border-[#2a2a2a] pb-10">

                {/* Logo uploader */}
                <div className="w-full lg:w-1/3">
                  <label className="block text-sm font-semibold text-[#888888] mb-2">Company Logo</label>
                  <div className="border-2 border-dashed border-[#2a2a2a] hover:border-[#22c55e]/50 transition-colors rounded-lg bg-[#0a0a0a]/50 h-32 flex flex-col items-center justify-center cursor-pointer group">
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] group-hover:bg-[#22c55e]/10 group-hover:border-[#22c55e]/20 p-2 rounded-full mb-2 transition-colors">
                      <span className="material-symbols-outlined text-[#22c55e] text-[24px]">cloud_upload</span>
                    </div>
                    <p className="text-sm text-[#888888] font-medium group-hover:text-[#f5f5f5] transition-colors">Click to upload logo</p>
                    <p className="text-xs text-[#888888]/60">SVG, PNG, JPG (max 2MB)</p>
                  </div>
                </div>

                {/* Invoice # / Status / Dates */}
                <div className="w-full lg:w-auto flex flex-col gap-4 min-w-[300px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#888888] uppercase tracking-wider">Invoice #</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] material-symbols-outlined text-[18px]">tag</span>
                        <input
                          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg h-10 pl-9 pr-3 text-[#f5f5f5] font-mono text-sm focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] outline-none cursor-default"
                          readOnly
                          type="text"
                          defaultValue="INV-0024"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#888888] uppercase tracking-wider">Status</label>
                      <div className="h-10 flex items-center px-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-bold">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 shrink-0" />
                        Pending
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#888888] uppercase tracking-wider">Date Issued</label>
                      <input
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg h-10 px-3 text-[#f5f5f5] text-sm focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] outline-none appearance-none [color-scheme:dark]"
                        type="date"
                        value={dateIssued}
                        onChange={e => setDateIssued(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#888888] uppercase tracking-wider">Due Date</label>
                      <input
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg h-10 px-3 text-[#f5f5f5] text-sm focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] outline-none appearance-none [color-scheme:dark]"
                        type="date"
                        value={dateDue}
                        onChange={e => setDateDue(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Bill From / Bill To ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">

                {/* Bill From */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#22c55e] text-[20px]">person</span>
                    <h3 className="text-lg font-bold text-[#f5f5f5]">Bill From</h3>
                  </div>
                  <div className="space-y-3">
                    <input className={inputUnderline} placeholder="Your Business Name" type="text"  value={fromName}   onChange={e => setFromName(e.target.value)} />
                    <input className={inputUnderline} placeholder="Email Address"      type="email" value={fromEmail}  onChange={e => setFromEmail(e.target.value)} />
                    <input className={inputUnderline} placeholder="Street Address"     type="text"  value={fromStreet} onChange={e => setFromStreet(e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <input className={inputUnderline} placeholder="City"     type="text" value={fromCity} onChange={e => setFromCity(e.target.value)} />
                      <input className={inputUnderline} placeholder="Zip Code" type="text" value={fromZip}  onChange={e => setFromZip(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#22c55e] text-[20px]">business</span>
                    <h3 className="text-lg font-bold text-[#f5f5f5]">Bill To</h3>
                  </div>
                  <div className="space-y-3">

                    {/* Client email search */}
                    <div className="relative" ref={searchRef}>
                      <input
                        className={inputUnderline}
                        placeholder="Client Email (Type to search)"
                        type="email"
                        value={clientSearch}
                        onChange={e => { setClientSearch(e.target.value); setShowDropdown(true) }}
                        onFocus={() => setShowDropdown(true)}
                      />
                      {showDropdown && filteredClients.length > 0 && (
                        <div className="absolute z-30 w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl mt-1">
                          <ul className="py-1 text-sm text-[#f5f5f5]">
                            {filteredClients.map((c, i) => (
                              <li
                                key={i}
                                className="px-4 py-2 hover:bg-[#2a2a2a]/50 cursor-pointer flex items-center justify-between group/item transition-colors"
                                onMouseDown={() => selectClient(c)}
                              >
                                <div className="flex flex-col">
                                  <span className="font-bold text-[#f5f5f5]">{c.name}</span>
                                  <span className="text-xs text-[#888888]">{c.email}</span>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded bg-blue-900/30 text-blue-300 border border-blue-900/50">Select</span>
                              </li>
                            ))}
                          </ul>
                          <div className="border-t border-[#2a2a2a] px-4 py-2 bg-[#2a2a2a]/20 text-xs text-[#888888] rounded-b-lg flex items-center gap-1 cursor-pointer hover:text-[#22c55e] transition-colors">
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            Create new client
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <input className={inputUnderline} placeholder="Client Company Name" type="text" value={toCompany} onChange={e => setToCompany(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input className={inputUnderline} placeholder="Client Phone"  type="tel"  value={toPhone} onChange={e => setToPhone(e.target.value)} />
                      <input className={inputUnderline} placeholder="Business Type" type="text" value={toType}  onChange={e => setToType(e.target.value)} />
                    </div>
                    <input className={inputUnderline} placeholder="Street Address" type="text" value={toStreet} onChange={e => setToStreet(e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <input className={inputUnderline} placeholder="City"     type="text" value={toCity} onChange={e => setToCity(e.target.value)} />
                      <input className={inputUnderline} placeholder="Zip Code" type="text" value={toZip}  onChange={e => setToZip(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Line Items Table ── */}
              <div className="mb-12 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[#888888] border-b border-[#2a2a2a] text-xs font-bold uppercase tracking-wider">
                      <th className="py-3 pl-4 rounded-tl-lg w-[45%]">Item Description</th>
                      <th className="py-3 text-right w-[15%]">Rate</th>
                      <th className="py-3 text-right w-[10%]">Qty</th>
                      <th className="py-3 text-right w-[20%]">Amount</th>
                      <th className="py-3 pr-4 rounded-tr-lg text-center w-[10%]"></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {items.map((it, i) => (
                      <tr key={i} className="group border-b border-[#2a2a2a]/50 hover:bg-[#2a2a2a]/20 transition-colors">
                        <td className="py-3 pl-4">
                          <input
                            className="w-full bg-transparent border-0 p-0 text-[#f5f5f5] placeholder-[#888888] focus:ring-0 outline-none font-medium text-sm"
                            placeholder="Description of service..."
                            type="text"
                            value={it.desc}
                            onChange={e => updateItem(i, 'desc', e.target.value)}
                          />
                        </td>
                        <td className="py-3 text-right">
                          <input
                            className="w-full bg-transparent border-0 p-0 text-right text-[#888888] focus:ring-0 outline-none font-mono text-sm"
                            type="number"
                            placeholder="0.00"
                            value={it.rate}
                            onChange={e => updateItem(i, 'rate', e.target.value)}
                          />
                        </td>
                        <td className="py-3 text-right">
                          <input
                            className="w-full bg-transparent border-0 p-0 text-right text-[#888888] focus:ring-0 outline-none font-mono text-sm"
                            type="number"
                            placeholder="1"
                            value={it.qty}
                            onChange={e => updateItem(i, 'qty', e.target.value)}
                          />
                        </td>
                        <td className="py-3 text-right font-mono text-[#f5f5f5] text-sm">
                          {fmt((parseFloat(it.rate) || 0) * (parseInt(it.qty) || 0))}
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <button
                            onClick={() => removeItem(i)}
                            className="text-[#888888] hover:text-[#ef4444] opacity-0 group-hover:opacity-100 transition-all p-1 rounded"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 pl-4">
                  <button
                    onClick={addItem}
                    className="flex items-center gap-2 text-[#22c55e] font-bold text-sm hover:text-green-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    Add Line Item
                  </button>
                </div>
              </div>

              {/* ── Notes + Totals ── */}
              <div className="flex flex-col lg:flex-row gap-10">

                {/* Notes & Terms */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-[#888888] mb-2">Notes &amp; Terms</label>
                  <textarea
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 text-sm text-[#f5f5f5] placeholder-[#888888] focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] outline-none resize-none h-32"
                    placeholder="Thank you for your business! Payment is due within 14 days. Please include the invoice number on your check."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>

                {/* Summary */}
                <div className="w-full lg:w-[400px] flex flex-col gap-3">
                  <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
                    <div className="flex justify-between items-center py-2 text-[#888888]">
                      <span className="text-sm font-medium">Subtotal</span>
                      <span className="font-mono text-[#f5f5f5]">{fmt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 text-[#888888] border-b border-[#2a2a2a] pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Tax</span>
                        <div className="flex items-center bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-0.5">
                          <input
                            className="w-8 bg-transparent border-0 p-0 text-right text-xs text-[#f5f5f5] focus:ring-0 outline-none"
                            type="number"
                            value={taxRate}
                            onChange={e => setTaxRate(e.target.value)}
                          />
                          <span className="text-xs text-[#888888] ml-0.5">%</span>
                        </div>
                      </div>
                      <span className="font-mono text-[#f5f5f5]">{fmt(taxAmt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#f5f5f5]">Total Due</span>
                      <span className="text-3xl font-extrabold text-[#22c55e] font-mono tracking-tight">{fmt(totalDue)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <footer className="w-full py-6 text-center text-[#888888] text-xs">
              <p>© 2023 BillCraft Inc. All rights reserved.</p>
            </footer>

          </div>
        </main>
      </div>
    </div>
  )
}
