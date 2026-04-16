import { Activity, AlertTriangle, BookText, Circle, Download, Eye, Gauge, LifeBuoy, Plus, Radar, RefreshCw, Search, Settings, Shield, Target, Zap } from "lucide-react";
import { Show, UserButton } from '@clerk/nextjs'
import userData from "@/app/actions/get-user-data";
import axios from "axios";

type Severity = "Critical" | "High" | "Medium";

function badgeClass(level: Severity) {
  if (level === "Critical") return "bg-rose-500/15 border-rose-500/40 text-rose-300";
  if (level === "High") return "bg-orange-500/15 border-orange-500/40 text-orange-300";
  return "bg-violet-500/15 border-violet-500/40 text-violet-300";
}

function healthClass(value: string) {
  if (value === "Breached") return "bg-rose-500/15 border-rose-500/35 text-rose-300";
  if (value === "Secure") return "bg-emerald-500/15 border-emerald-500/35 text-emerald-300";
  return "bg-amber-500/15 border-amber-500/35 text-amber-300";
}

export default async function HomePage() {
  const user = await userData();
  const email = user?.primaryEmailAddress?.emailAddress;
  
  let targets = [];
  let scans = [];
  
  try {
    if (email) {
      const targetsRes = await axios.post('http://localhost:8080/targets', { email });
      targets = targetsRes.data.data.targets || [];
      
      const scansRes = await axios.post('http://localhost:8080/getScans', { email });
      scans = scansRes.data.scans || [];
    }
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
  }

  const totalFindings = scans.reduce((acc, scan) => acc + (scan.scanResult?.findings?.length || 0), 0);
  const completedScans = scans.filter(s => s.status === 'completed').length;

  const statCards = [
    { title: "Active Targets", value: targets.length.toString(), delta: "Live", tone: "text-cyan-300" },
    { title: "Total Findings", value: totalFindings.toString(), delta: "Total", tone: "text-violet-300" },
    { title: "Completed Scans", value: completedScans.toString(), delta: "History", tone: "text-emerald-300" },
    { title: "Pending Scans", value: (scans.length - completedScans).toString(), delta: "Running", tone: "text-amber-300" },
  ];

  const detections = scans
    .filter(s => s.scanResult?.findings?.length > 0)
    .slice(0, 5)
    .map(s => ({
      severity: s.profileName === 'port-scanner' ? "High" : "Medium" as Severity,
      code: s.profileName.toUpperCase(),
      host: s.target,
      ago: new Date(s.createdAt).toLocaleDateString()
    }));

  const feed = scans.slice(0, 6).map(s => ({
    time: new Date(s.createdAt).toLocaleTimeString(),
    target: s.target,
    text: `System completed ${s.profileName} audit with ${s.scanResult?.findings?.length || 0} findings recorded.`
  }));

  return (
    <div className="h-[100vh] bg-[#03050a] w-full text-zinc-200">
      <div className="mx-auto flex justify-between max-w-[1720px] gap-4">
        <aside className="hidden w-[70px] shrink-0 rounded-xl border border-cyan-500/20 bg-[#080c16] py-3 lg:flex lg:flex-col lg:items-center lg:justify-between">
          <div className="w-full space-y-2 px-2">
            <a href="/home" className="flex w-full flex-col items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/12 py-2 text-cyan-300">
              <Activity size={16} />
              <span className="text-[9px] uppercase tracking-wide">Scope</span>
            </a>
            <a href="/home/scans" className="flex w-full flex-col items-center gap-1 rounded-lg py-2 text-zinc-500 hover:bg-white/[0.03] hover:text-cyan-200">
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
          <div className="w-full space-y-2 px-2">
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

        <section className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,1.9fr)_390px] h-[calc(100vh-20px)] overflow-hidden">
          <main className="rounded-xl border border-white/8 bg-[#070b12] p-4 overflow-y-auto">
            <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
              {statCards.map((item) => (
                <article key={item.title} className="rounded-lg border border-white/10 bg-[#0b1220] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{item.title}</p>
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-300">{item.delta}</span>
                  </div>
                  <p className={`text-[40px] leading-none font-semibold ${item.tone}`}>{item.value}</p>
                </article>
              ))}
            </div>

            <div className="mt-4 grid gap-4 2xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <section className="rounded-lg border border-white/10 bg-[#060a13] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-white">Security Posture</h2>
                  <button className="text-xs text-cyan-300">Analysis Active</button>
                </div>
                <div className="grid min-h-[250px] place-items-center">
                  <div className="relative h-[172px] w-[172px] rounded-full bg-[conic-gradient(#22d3ee_0_30%,#a78bfa_30%_74%,#fb7185_74%_84%,#111827_84%_100%)] p-[19px] shadow-[0_0_30px_rgba(34,211,238,0.08)]">
                    <div className="grid h-full w-full place-items-center rounded-full bg-[#060a13]">
                      <div className="text-center">
                        <p className="text-[44px] leading-none font-semibold text-white">{totalFindings}</p>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">Live Issues</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-white/10 bg-[#060a13] p-4">
                <h2 className="mb-3 text-sm font-medium text-white">Recent Detections</h2>
                <div className="space-y-2">
                  {detections.length > 0 ? detections.map((item, idx) => (
                    <article key={idx} className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.02] px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] ${badgeClass(item.severity)}`}>{item.severity}</span>
                        <div>
                          <p className="text-[13px] font-medium text-white">{item.code}</p>
                          <p className="text-[11px] text-zinc-500">{item.host}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-zinc-500">{item.ago}</span>
                    </article>
                  )) : (
                    <p className="text-xs text-zinc-500 py-10 text-center">No detections yet.</p>
                  )}
                </div>
              </section>
            </div>

            <section className="mt-4 rounded-lg border border-white/10 bg-[#060a13] p-4">
              <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-sm font-medium text-white">Infrastucture Nodes</h2>
                  <p className="text-[11px] text-zinc-500">Monitoring {targets.length} active nodes</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="border-b border-white/10 text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                    <tr>
                      <th className="px-2 py-2">Endpoint Target</th>
                      <th className="px-2 py-2">Description</th>
                      <th className="px-2 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {targets.length > 0 ? targets.map((item: any) => (
                      <tr key={item._id} className="border-b border-white/5 text-sm">
                        <td className="px-2 py-3 font-medium text-zinc-100">{item.target}</td>
                        <td className="px-2 py-3 text-[12px] text-zinc-400">{item.description}</td>
                        <td className="px-2 py-3">
                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">Monitoring</span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="px-2 py-10 text-center text-xs text-zinc-500 underline decoration-cyan-500/30">
                          <a href="/home/targets">Add your first target to begin monitoring</a>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </main>

          <aside className="rounded-xl border border-white/10 bg-[#070b12] p-4 overflow-y-auto">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-white">Live Activity Feed</h2>
              <button className="rounded-md border border-white/10 bg-white/[0.03] p-2 text-zinc-400">
                <Gauge size={13} />
              </button>
            </div>
            <div className="relative space-y-2.5 pl-5 before:absolute before:left-2 before:top-2 before:h-[95%] before:w-px before:bg-cyan-400/35">
              {feed.length > 0 ? feed.map((item, idx) => (
                <article key={idx} className="relative rounded-md border border-white/10 bg-[#0a0f1b] p-3">
                  <span className="absolute -left-[17px] top-4 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.85)]" />
                  <p className="text-[10px] text-zinc-500">{item.time}</p>
                  <p className="text-[11px] text-cyan-300">{item.target}</p>
                  <p className="mt-1.5 text-[12px] leading-5 text-zinc-300">{item.text}</p>
                </article>
              )) : (
                <p className="text-xs text-zinc-500 py-10">No recent activity.</p>
              )}
            </div>
            <div className="mt-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
              <p className="text-sm font-medium text-cyan-200">Aegis Intelligence Active</p>
              <p className="mt-1 text-xs text-cyan-100/75">AI is analyzing scan patterns for anomalous lateral movement detection.</p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
