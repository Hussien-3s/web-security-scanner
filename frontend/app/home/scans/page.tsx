import { Activity, BookText, Radar, Settings, Zap } from "lucide-react";
import { Show, UserButton } from '@clerk/nextjs'
import userData from "@/app/actions/get-user-data";
import axios from "axios";
import ScansCard from "@/components/scansCard";

export default async function ScansPage() {
  const user = await userData()
  let scans = []
  
  try {
    const scansRequest = await axios.post('http://localhost:8080/getScans', {
      email: user?.primaryEmailAddress?.emailAddress
    })
    scans = scansRequest.data.scans || []
  } catch (error) {
    console.error("Failed to fetch scans:", error)
  }

  return (
    <div className="h-[100vh] bg-[#03050a] text-zinc-200">
      <div className="mx-auto h-full flex justify-between max-w-[1720px] gap-4">
        <aside className="hidden w-[70px] shrink-0 rounded-xl border border-cyan-500/20 bg-[#080c16] py-3 lg:flex lg:flex-col lg:items-center lg:justify-between">
          <div className="w-full h-[90%] px-2 space-y-2">
            <a href="/home" className="flex w-full flex-col items-center gap-1 rounded-lg py-2 text-zinc-500 hover:bg-white/[0.03] hover:text-cyan-200">
              <Activity size={16} />
              <span className="text-[9px] uppercase tracking-wide">Scope</span>
            </a>
            <a href="/home/scans" className="flex w-full flex-col items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/12 py-2 text-cyan-300">
              <Zap size={16} />
              <span className="text-[9px] uppercase tracking-wide">Scans</span>
            </a>
            <a href="/home/targets" className="flex w-full flex-col items-center gap-1 rounded-lg py-2 text-zinc-500 hover:bg-white/[0.03] hover:text-cyan-200">
              <Radar size={16} />
              <span className="text-[9px] uppercase tracking-wide">Targets</span>
            </a>
            <a href="/home/profiles" className="flex w-full flex-col items-center gap-1 rounded-lg py-2 text-zinc-500 hover:bg-white/[0.03] hover:text-cyan-200">
              <BookText size={16} />
              <span className="text-[9px] uppercase tracking-wide">Profiles</span>
            </a>
          </div>
          <div className="w-full h-[10%] px-2">
            <button className="flex w-full flex-col items-center gap-1 rounded-lg py-2 text-zinc-500 hover:bg-white/[0.03] hover:text-cyan-200">
              <Settings size={16} />
              <span className="text-[9px] uppercase tracking-wide">Prefs</span>
            </button>
            <button className="flex w-full flex-col items-center gap-1 rounded-lg py-2 text-zinc-500 hover:bg-white/[0.03] hover:text-cyan-200">
              <Show when="signed-in">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }} />
              </Show>
            </button>
          </div>
        </aside>

        <section className="grid w-full h-full">
          <main className="rounded-xl w-full h-full border border-white/8 bg-[#070b12] p-6 overflow-y-auto">
             <div className="mb-6 flex items-center justify-between">
                <div>
                   <h1 className="text-xl font-bold text-white">Security Scan History</h1>
                   <p className="text-sm text-zinc-500 mt-1">Review and manage your previous infrastructure audits</p>
                </div>
                <div className="flex gap-2">
                   <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300 hover:bg-white/10 transition-colors">
                      Export All
                   </button>
                </div>
             </div>
             
             <div className="max-w-4xl">
                <ScansCard scans={scans} />
             </div>
          </main>
        </section>
      </div>
    </div>
  );
}
