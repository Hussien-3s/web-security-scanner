import { Activity, ArrowLeft, BookText, Radar, Settings, Zap, Target, ShieldCheck, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { Show, UserButton } from '@clerk/nextjs'
import userData from "@/app/actions/get-user-data";
import axios from "axios";
import ScansCard from "@/components/scansCard";

export default async function TargetScansPage({ params }: { params: { target: string } }) {
  const { target } = await params
  const user = await userData()
  let scans = []

  try {
    const scansRequest = await axios.post('http://localhost:8080/getTargetScans', {
      email: user?.primaryEmailAddress?.emailAddress,
      target: target
    })
    scans = scansRequest.data.scans || []
  } catch (error) {
    console.error("Failed to fetch target scans:", error)
  }

  const totalFindings = scans.reduce((acc: any, scan: any) => acc + (scan.scanResult?.findings?.length || 0), 0)
  const completedScans = scans.filter((s: any) => s.status === 'completed').length

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
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <a href="/home/scans" className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                  <ArrowLeft size={18} />
                </a>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-white">{target}</h1>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Target Report</span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">Comprehensive security audit results for this endpoint</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Issues</p>
                  <p className={`text-xl font-bold ${totalFindings > 0 ? "text-rose-400" : "text-emerald-400"}`}>{totalFindings}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-4">
                <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-zinc-500 font-bold">Completed Scans</p>
                  <p className="text-lg font-bold text-white">{completedScans} / {scans.length}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-4">
                <div className="p-3 rounded-lg bg-rose-500/10 text-rose-400">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-zinc-500 font-bold">Security Breaches</p>
                  <p className="text-lg font-bold text-white">{totalFindings}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-zinc-500 font-bold">Health Status</p>
                  <p className={`text-lg font-bold ${totalFindings > 5 ? "text-rose-400" : totalFindings > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                    {totalFindings > 5 ? "Critical" : totalFindings > 0 ? "Warning" : "Secure"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest px-1">Scan Profiles Detail</h2>
              <ScansCard scans={scans} />
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}
