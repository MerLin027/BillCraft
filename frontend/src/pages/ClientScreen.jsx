import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'

const STATIC_CLIENTS = [
  {
    initials: 'JD',
    avatarBg: 'bg-purple-500/20',
    avatarText: 'text-purple-400',
    avatarBorder: 'border-purple-500/30',
    name: 'John Doe',
    email: 'john.doe@acmecorp.com',
    phone: '+1 (555) 123-4567',
    business: 'Acme Corp',
    industry: 'Technology',
    industryBg: 'bg-blue-900/30',
    industryText: 'text-blue-300',
    industryBorder: 'border-blue-800/50',
    date: 'Oct 24, 2023',
    img: null,
  },
  {
    initials: 'JS',
    avatarBg: 'bg-blue-500/20',
    avatarText: 'text-blue-400',
    avatarBorder: 'border-blue-500/30',
    name: 'Jane Smith',
    email: 'jane.smith@globex.inc',
    phone: '+1 (555) 987-6543',
    business: 'Globex Inc.',
    industry: 'Finance',
    industryBg: 'bg-green-900/30',
    industryText: 'text-green-300',
    industryBorder: 'border-green-800/50',
    date: 'Oct 22, 2023',
    img: null,
  },
  {
    initials: null,
    avatarBg: null,
    avatarText: null,
    avatarBorder: null,
    name: 'Robert Paulson',
    email: 'bob@soylent.com',
    phone: '+1 (555) 555-0199',
    business: 'Soylent Corp',
    industry: 'Food & Bev',
    industryBg: 'bg-orange-900/30',
    industryText: 'text-orange-300',
    industryBorder: 'border-orange-800/50',
    date: 'Oct 20, 2023',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ8vTaluEKc9WUPDaBjltZze5cmeIGUHz7yGEuTnqaivMe8CoKTJqCVyX795Pul76IRp7B901q7sfNAtav9qm6zVdJxftPUGR60okgXpypAt8ZXeVB8n4uvL1Ku7QjTMBk9SP-dfDgdNnCxnU2q61pcsb8nr83LyxrhEWgtlUWm6nN4Ra4Tj5uxVIMcerc-0AbDWA-SHT71pWu_I3c7sLsA6Baw3hwwGCYeGfReO-C-mMH8tXQxKUgOowQdu0M-yDDPp8GsMeKAUQ',
  },
  {
    initials: 'PL',
    avatarBg: 'bg-orange-500/20',
    avatarText: 'text-orange-400',
    avatarBorder: 'border-orange-500/30',
    name: 'Peter Lumburgh',
    email: 'peter@initech.com',
    phone: '+1 (555) 321-7654',
    business: 'Initech',
    industry: 'Software',
    industryBg: 'bg-purple-900/30',
    industryText: 'text-purple-300',
    industryBorder: 'border-purple-800/50',
    date: 'Oct 18, 2023',
    img: null,
  },
  {
    initials: 'AW',
    avatarBg: 'bg-teal-500/20',
    avatarText: 'text-teal-400',
    avatarBorder: 'border-teal-500/30',
    name: 'Albert Wesker',
    email: 'a.wesker@umbrella.corp',
    phone: '+1 (666) 123-6666',
    business: 'Umbrella Corp',
    industry: 'Pharmaceuticals',
    industryBg: 'bg-red-900/30',
    industryText: 'text-red-300',
    industryBorder: 'border-red-800/50',
    date: 'Oct 15, 2023',
    img: null,
  },
]

export default function ClientScreen() {
  const { user, clients, generations } = useApp()

  const [editOpen,   setEditOpen]   = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [search,     setSearch]     = useState('')

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] font-display antialiased overflow-hidden flex h-screen w-full flex-row">

      {/* Sidebar */}
      <Sidebar active="clients" />

      {/* Main */}
      <main className="flex-1 flex flex-col h-full relative bg-[#0a0a0a] ml-[260px]">

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
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 bg-[#22c55e] hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#22c55e]/20 whitespace-nowrap">
              <span className="material-symbols-outlined text-xl">add</span>
              <span className="hidden md:inline">Add Client</span>
            </button>
          </div>
        </header>

        {/* Table area */}
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
                  {STATIC_CLIENTS.map((c, i) => (
                    <tr key={i} className="group hover:bg-[#22c55e]/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {c.img ? (
                            <img
                              className="h-9 w-9 rounded-full object-cover border border-[#2a2a2a]"
                              alt={c.name}
                              src={c.img}
                            />
                          ) : (
                            <div className={`h-9 w-9 rounded-full ${c.avatarBg} ${c.avatarText} flex items-center justify-center font-bold text-xs border ${c.avatarBorder}`}>
                              {c.initials}
                            </div>
                          )}
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-[#2a2a2a] px-6 py-4 flex items-center justify-between bg-[#1a1a1a]">
              <div className="text-xs text-[#a3a3a3]">
                Showing <span className="text-white font-semibold">1</span> to <span className="text-white font-semibold">5</span> of <span className="text-white font-semibold">24</span> clients
              </div>
              <div className="flex items-center gap-2">
                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#2a2a2a] text-[#a3a3a3] hover:bg-[#2a2a2a] hover:text-white transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#22c55e] text-white border border-[#22c55e] text-sm font-bold">1</button>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#2a2a2a] text-[#a3a3a3] hover:bg-[#2a2a2a] hover:text-white transition-colors text-sm">2</button>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#2a2a2a] text-[#a3a3a3] hover:bg-[#2a2a2a] hover:text-white transition-colors text-sm">3</button>
                <span className="text-[#a3a3a3] px-1">...</span>
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
              <p className="text-xl font-bold text-white">Edit Client</p>
              <div className="cursor-pointer z-50" onClick={() => setEditOpen(false)}>
                <span className="material-symbols-outlined text-[#a3a3a3] hover:text-white transition-colors">close</span>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-name">Client Name</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-name" type="text" defaultValue="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-email">Email Address</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-email" type="email" defaultValue="john.doe@acmecorp.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-phone">Phone Number</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-business">Business Name</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-business" type="text" defaultValue="Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#a3a3a3] mb-1.5" htmlFor="edit-type">Business Type</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all text-sm" id="edit-type" type="text" defaultValue="Technology" />
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
              <p className="text-[#a3a3a3] text-sm mb-6">This will remove the client record but not their associated documents.</p>
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
