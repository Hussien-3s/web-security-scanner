"use client"

import { Switch } from "@/components/ui/switch"
import { Play, ShieldCheck } from "lucide-react"
import axios from "axios"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Severity = "Critical" | "High" | "Medium" | "Low" | "Info" | "None" | "critical" | "high" | "medium" | "low" | "info" | "none";

function badgeClass(level: Severity) {
  if (level === "Critical" || level === "critical") return "bg-rose-500/15 border-rose-500/40 text-rose-300";
  if (level === "High" || level === "high") return "bg-violet-500/15 border-violet-500/40 text-violet-300";
  if (level === "Medium" || level === "medium") return "bg-orange-500/15 border-orange-500/40 text-orange-300";
  if (level === "Low" || level === "low") return "bg-yellow-500/15 border-yellow-500/40 text-yellow-300";
  if (level === "Info" || level === "info") return "bg-blue-500/15 border-blue-500/40 text-blue-300";
  return "bg-zinc-500/15 border-zinc-500/40 text-zinc-300";
}

export default function ProfileList({ profiles, targets }: { profiles: any[], targets: any[] }) {
  const { user } = useUser();
  const router = useRouter();
  const [selectedTarget, setSelectedTarget] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const handleStartScan = async (profileName: string) => {
    if (!selectedTarget) {
      alert("Please select a target first.");
      return;
    }
    
    setLoading(profileName);
    try {
      await axios.post('http://localhost:8080/startScan', {
        target: selectedTarget,
        email: user?.emailAddresses[0].emailAddress,
        profileName
      });
      router.push('/home/scans');
    } catch (error) {
      console.error("Scan error:", error);
      alert("Failed to start scan.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 mb-8">
        <label className="block text-xs font-semibold text-cyan-200 uppercase tracking-wider mb-2">
          Global Target Selection
        </label>
        <select 
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value)}
          className="w-full bg-[#0a0f1b] border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-cyan-500/50 transition-colors"
        >
          <option value="">Select a target to audit...</option>
          {targets.map((t: any) => (
            <option key={t._id} value={t.target}>{t.target} ({t.description})</option>
          ))}
        </select>
      </div>

      <div className="grid gap-3">
        {profiles.map((item: any, index: number) => (
          <article key={index} className="flex items-center justify-between rounded-xl border w-full border-white/10 bg-white/[0.02] px-4 py-4 hover:bg-white/[0.04] transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-white/5 group-hover:bg-cyan-500/10 transition-colors">
                <ShieldCheck size={20} className="text-zinc-400 group-hover:text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{item.profileName}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase font-bold tracking-tighter ${badgeClass(item.severity)}`}>
                    {item.severity}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{item.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 mr-2">
                 <span className="text-[10px] text-zinc-500 uppercase">Auto-run</span>
                 <Switch disabled />
              </div>
              <button 
                onClick={() => handleStartScan(item.profileName)}
                disabled={loading !== null}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                  loading === item.profileName 
                    ? "bg-amber-500/20 text-amber-400" 
                    : "bg-cyan-500 text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                }`}
              >
                {loading === item.profileName ? "Starting..." : <><Play size={14} fill="currentColor" /> Run Audit</>}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
