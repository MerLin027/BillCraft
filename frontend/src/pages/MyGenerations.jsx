import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'

export default function MyGenerations() {
  const navigate = useNavigate()
  const { user, generations } = useApp()

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] h-screen overflow-hidden flex font-display antialiased">
      <Sidebar active="my-generations" />
      <main className="flex-1 ml-[260px] h-full flex flex-col bg-[#0a0a0a]">
        <header className="px-8 pt-10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">My Generations</h2>
            <p className="text-slate-400">View all your generated invoices and contracts.</p>
          </div>
        </header>
      </main>
    </div>
  )
}
