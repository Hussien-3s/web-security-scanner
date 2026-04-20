import { Activity, BookText, Radar, Settings, Zap, ArrowRight, ShieldAlert, Target as TargetIcon, Clock, ChevronRight } from "lucide-react";
import { Show, UserButton } from '@clerk/nextjs'
import userData from "@/app/actions/get-user-data";
import axios from "axios";
import DeleteSessionButton from "@/components/DeleteSessionButton";

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

  // Group scans by scanGroupId for the session-based view
  const groupedScans = scans.reduce((acc: any, scan: any) => {
    const groupId = scan.scanGroupId || `legacy-${scan.target}-${scan.createdAt}`;
    if (!acc[groupId]) {
      acc[groupId] = {
        groupId,
        target: scan.target,
        scans: [],
        findings: 0,
        createdAt: scan.createdAt
      }
    }
    acc[groupId].scans.push(scan)
    acc[groupId].findings += (scan.scanResult?.findings?.length || 0)
    return acc
  }, {})

  const sortedScans = scans.sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

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
             <div className="mb-8 flex items-end justify-between">
                <div>
                   <h1 className="text-xl font-bold text-white uppercase tracking-tight">Security Timeline</h1>
                   <p className="text-sm text-zinc-500 mt-1">Review individual scanner detections and security history</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        {sortedScans.length} SCAN ENTRIES
                    </span>
                </div>
             </div>
             
             {sortedScans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500 border border-white/10 border-dashed rounded-xl bg-white/[0.01]">
                    <ShieldAlert size={48} className="mb-4 opacity-10" />
                    <p className="text-sm">No historical scans detected.</p>
                    <a href="/home/profiles" className="mt-4 text-xs text-cyan-400 hover:underline">Start your first audit &rarr;</a>
                </div>
             ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {sortedScans.map((scan: any) => {
                        const findingsCount = scan.scanResult?.findings?.length || 0;
                        const isFailing = scan.status === 'failed';

                        return (
                            <a 
                                key={scan._id} 
                                href={`/home/scans/${encodeURIComponent(scan.target)}`}
                                className="group p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-white/5 text-zinc-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors">
                                            {scan.profileName === 'fuzzing' ? <Zap size={24} /> : scan.profileName === 'port-scanner' ? <TargetIcon size={24} /> : <ShieldAlert size={24} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-black text-rose-500/90 uppercase tracking-widest">{scan.profileName}</h3>
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-colors ${isFailing ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                    {scan.status}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-bold text-white group-hover:text-cyan-100 transition-colors mt-0.5">{scan.target}</h4>
                                            <div className="flex items-center gap-3 mt-1.5 font-mono italic">
                                                <span className="text-[10px] text-zinc-600">
                                                    {new Date(scan.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-2">
                                            <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tighter ${findingsCount > 0 ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                                                {findingsCount} ISSUES
                                            </div>
                                            <DeleteSessionButton groupId={scan.scanGroupId || scan._id} />
                                        </div>
                                        <div className="mt-4 text-zinc-700 group-hover:text-cyan-400 transition-colors">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        )
                    })}
                </div>
             )}
          </main>
        </section>
      </div>
    </div>
  );
}
