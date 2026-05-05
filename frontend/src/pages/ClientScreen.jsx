import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'

export default function ClientScreen() {
  const { clients, addClient, updateClient, deleteClient, sidebarCollapsed } = useApp()

  const [addOpen,        setAddOpen]        = useState(false)
  const [editOpen,       setEditOpen]       = useState(false)
  const [deleteOpen,     setDeleteOpen]     = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [editForm,       setEditForm]       = useState({})
  const [search,         setSearch]         = useState('')
  const [currentPage,    setCurrentPage]    = useState(1)
  const [addErrors,      setAddErrors]      = useState({})
  const [newClient, setNewClient] = useState({
    name: '', email: '', phone: '', business: '', industry: '',
  })
  const PER_PAGE = 8

  // F-6+F-7: Map MongoDB clients — use _id throughout; no static demo data merge
  const mappedClients = clients.map(c => ({
    _id:          c._id,
    name:         c.name         || '',
    email:        c.email        || '',
    phone:        c.phone        || '',
    business:     c.business     || '',
    industry:     c.industry     || 'General',
    date:         c.dateAdded || (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'),
    initials:     (c.name || 'NA').split(' ').filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('') || 'NA',
    avatarBg:     'bg-[#22c55e]/15',
    avatarText:   'text-[#22c55e]',
    avatarBorder: 'border-[#22c55e]/20',
    industryBg:   'bg-blue-500/10',
    industryText: 'text-blue-400',
    industryBorder:'border-blue-500/20',
  }))

  const filteredClients = mappedClients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages   = Math.max(1, Math.ceil(filteredClients.length / PER_PAGE))
  const pageStart    = Math.min((currentPage - 1) * PER_PAGE + 1, filteredClients.length || 1)
  const pageEnd      = Math.min(currentPage * PER_PAGE, filteredClients.length)
  const pagedClients = filteredClients.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  function resetAddForm() {
    setNewClient({ name: '', email: '', phone: '', business: '', industry: '' })
    setAddErrors({})
  }

  // F-6: async add — calls real API via AppContext
  async function handleAddClient() {
    const errs = {}
    if (!newClient.name.trim())  errs.name  = 'Client name is required.'
    if (!newClient.email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClient.email)) errs.email = 'Enter a valid email address.'
    if (Object.keys(errs).length) { setAddErrors(errs); return }
    const result = await addClient({
      name:     newClient.name.trim(),
      email:    newClient.email.trim(),
      phone:    newClient.phone.trim(),
      business: newClient.business.trim(),
      industry: newClient.industry.trim(),
    })
    if (!result.ok) { setAddErrors({ name: result.error }); return }
    setAddOpen(false)
    resetAddForm()
  }

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] font-display antialiased overflow-hidden flex h-screen w-full flex-row">
      <Sidebar active="clients" />
      <main className="flex-1 flex flex-col h-full relative bg-[#0a0a0a]" style={{ marginLeft: sidebarCollapsed ? '60px' : '260px', transition: 'margin-left 300ms ease-in-out' }}>

        {/* Header */}
        <header className="px-8 pt-10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">Clients</h2>
            <p className="text-slate-400">Manage your client relationships and billing history.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#a3a3a3] group-focus-within:text-[#22c55e] transition-colors">search</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2.5 border border-[#2a2a2a] rounded-lg leading-5 bg-[#1a1a1a] text-white placeholder-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] sm:text-sm transition-all"
                placeholder="Search clients..."
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
              />
            </div>
            <button
              className="h-11 px-5 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-[#0a0a0a] font-bold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              onClick={() => setAddOpen(true)}
            >
              <span className="material-symbols-outlined text-xl">add</span>
              <span className="hidden md:inline">Add Client</span>
            </button>
          </div>
        </header>

        {/* Table */}
        <div className="flex-1 overflow-y-auto p-4 md:px-8 md:pt-5 md:pb-8">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#22c55e]/10 border-b border-[#2a2a2a] text-[#a3a3a3] text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Client Name</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Email</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Phone</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Business Name</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Type of Business</th>
                    <th className="px-6 py-4 font-semibold text-[#22c55e]">Date Added</th>
                    <th className="px-6 py-4 font-semibold text-right text-[#22c55e]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a] text-sm">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-[#888888] text-sm">
                        {clients.length === 0 ? 'No clients yet. Add your first client!' : 'No clients match your search.'}
                      </td>
                    </tr>
                  ) : (
                    pagedClients.map((c) => (
                      <tr key={c._id} className="group hover:bg-[#22c55e]/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-full ${c.avatarBg} ${c.avatarText} flex items-center justify-center font-bold text-xs border ${c.avatarBorder}`}>
                              {c.initials}
                            </div>
                            <div className="font-bold text-white">{c.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#a3a3a3]">{c.email}</td>
                        <td className="px-6 py-4 text-[#a3a3a3]">{c.phone}</td>
                        <td className="px-6 py-4 text-white font-medium">{c.business}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.industryBg} ${c.industryText} border ${c.industryBorder}`}>
                            {c.industry}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#a3a3a3]">{c.date}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="px-3 py-1.5 rounded-md bg-transparent border border-[#2a2a2a] text-[#a3a3a3] hover:text-[#22c55e] hover:border-[#22c55e] text-xs font-medium transition-colors"
                              onClick={() => {
                                setSelectedClient(c)
                                setEditForm({ name: c.name, email: c.email, phone: c.phone, business: c.business, industry: c.industry })
                                setEditOpen(true)
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="px-3 py-1.5 rounded-md bg-transparent border border-[#2a2a2a] text-[#a3a3a3] hover:text-[#ef4444] hover:border-[#ef4444] text-xs font-medium transition-colors"
                              onClick={() => { setSelectedClient(c); setDeleteOpen(true) }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-[#2a2a2a] px-6 py-4 flex items-center justify-between bg-[#1a1a1a]">
              <div className="text-xs text-[#a3a3a3]">
                Showing <span className="text-white font-semibold">{filteredClients.length === 0 ? 0 : pageStart}</span> to <span className="text-white font-semibold">{pageEnd}</span> of <span className="text-white font-semibold">{filteredClients.length}</span> clients
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#2a2a2a] text-[#a3a3a3] hover:bg-[#2a2a2a] hover:text-white transition-colors disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#2a2a2a] text-[#a3a3a3] hover:bg-[#2a2a2a] hover:text-white transition-colors disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Add Modal ── */}
      {addOpen && (
        <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
          <div className="absolute w-full h-full bg-black/80 backdrop-blur-sm" onClick={() => { setAddOpen(false); resetAddForm() }} />
          <div className="relative bg-[#1a1a1a] w-full md:max-w-lg mx-auto rounded-xl shadow-2xl z-50 overflow-y-auto max-h-[90vh] border border-[#2a2a2a]">
            <div className="flex justify-between items-center py-4 px-6 border-b border-[#2a2a2a]">
              <p className="text-xl font-bold text-white">Add Client</p>
              <div className="cursor-pointer z-50" onClick={() => { setAddOpen(false); resetAddForm() }}>
                <span className="material-symbols-outlined text-[#a3a3a3] hover:text-white transition-colors">close</span>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="add-name">Client Name</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="add-name" type="text" value={newClient.name} onChange={e => { setNewClient(p => ({ ...p, name: e.target.value })); setAddErrors(p => ({ ...p, name: undefined })) }} />
                {addErrors.name && <p className="text-xs text-[#ef4444] mt-1">{addErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="add-email">Email Address</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="add-email" type="email" value={newClient.email} onChange={e => { setNewClient(p => ({ ...p, email: e.target.value })); setAddErrors(p => ({ ...p, email: undefined })) }} />
                {addErrors.email && <p className="text-xs text-[#ef4444] mt-1">{addErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="add-phone">Phone Number</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="add-phone" type="tel" value={newClient.phone} onChange={e => setNewClient(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="add-business">Business Name</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="add-business" type="text" value={newClient.business} onChange={e => setNewClient(p => ({ ...p, business: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="add-type">Business Type</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="add-type" type="text" value={newClient.industry} onChange={e => setNewClient(p => ({ ...p, industry: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 bg-[#111111] rounded-b-xl border-t border-[#2a2a2a]">
              <button className="px-4 py-2 bg-transparent border border-[#2a2a2a] text-[#a3a3a3] rounded-lg text-sm font-semibold hover:bg-[#0a0a0a] hover:text-white transition-colors" onClick={() => { setAddOpen(false); resetAddForm() }}>Cancel</button>
              <button className="px-4 py-2 bg-[#22c55e] text-[#0a0a0a] rounded-lg text-sm font-bold hover:bg-[#16a34a] transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]" onClick={handleAddClient}>Add Client</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal (F-6) ── */}
      {editOpen && (
        <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
          <div className="absolute w-full h-full bg-black/80 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <div className="relative bg-[#1a1a1a] w-full md:max-w-lg mx-auto rounded-xl shadow-2xl z-50 overflow-y-auto max-h-[90vh] border border-[#2a2a2a]">
            <div className="flex justify-between items-center py-4 px-6 border-b border-[#2a2a2a]">
              <p className="text-xl font-bold text-white">Edit Client</p>
              <div className="cursor-pointer z-50" onClick={() => setEditOpen(false)}>
                <span className="material-symbols-outlined text-[#a3a3a3] hover:text-white transition-colors">close</span>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-name">Client Name</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-name" type="text" value={editForm.name || ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-email">Email Address</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-email" type="email" value={editForm.email || ''} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-phone">Phone Number</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-phone" type="tel" value={editForm.phone || ''} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-business">Business Name</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-business" type="text" value={editForm.business || ''} onChange={e => setEditForm(p => ({ ...p, business: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-type">Business Type</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-type" type="text" value={editForm.industry || ''} onChange={e => setEditForm(p => ({ ...p, industry: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 bg-[#111111] rounded-b-xl border-t border-[#2a2a2a]">
              <button className="px-4 py-2 bg-transparent border border-[#2a2a2a] text-[#a3a3a3] rounded-lg text-sm font-semibold hover:bg-[#0a0a0a] hover:text-white transition-colors" onClick={() => setEditOpen(false)}>Cancel</button>
              <button
                className="px-4 py-2 bg-[#22c55e] text-[#0a0a0a] rounded-lg text-sm font-bold hover:bg-[#16a34a] transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                onClick={async () => {
                  if (selectedClient?._id) await updateClient(selectedClient._id, editForm)
                  setEditOpen(false)
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal (F-7) ── */}
      {deleteOpen && (
        <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
          <div className="absolute w-full h-full bg-black/80 backdrop-blur-sm" onClick={() => setDeleteOpen(false)} />
          <div className="relative bg-[#1a1a1a] w-full md:max-w-md mx-auto rounded-xl shadow-2xl z-50 border border-[#2a2a2a]">
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-900/20 flex items-center justify-center mx-auto mb-4 border border-red-900/30">
                <span className="material-symbols-outlined text-3xl text-red-500">warning</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
              <p className="text-[#a3a3a3] text-sm mb-6">
                Delete <span className="text-white font-semibold">{selectedClient?.name}</span>? This cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button className="px-4 py-2 bg-transparent border border-[#2a2a2a] text-[#a3a3a3] rounded-lg text-sm font-semibold hover:bg-[#0a0a0a] hover:text-white transition-colors w-28" onClick={() => setDeleteOpen(false)}>Cancel</button>
                <button
                  className="px-4 py-2 bg-[#ef4444] text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors shadow-md shadow-red-500/20 w-28"
                  onClick={async () => {
                    if (selectedClient?._id) await deleteClient(selectedClient._id)
                    setDeleteOpen(false)
                    setSelectedClient(null)
                  }}
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
