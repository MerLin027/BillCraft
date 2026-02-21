import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'

export default function Clients() {
  const navigate = useNavigate()
  const { user, clients } = useApp()

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen overflow-hidden flex font-display antialiased">
      <Sidebar active="clients" />
      <main className="flex-1 ml-[260px] h-screen overflow-y-auto no-scrollbar bg-[#0a0a0a] relative">
        <div className="max-w-7xl mx-auto p-8 flex flex-col gap-8">
          <header className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">Clients</h2>
            <p className="text-slate-400">Manage your client list.</p>
          </header>
        </div>
      </main>
    </div>
  )
}
