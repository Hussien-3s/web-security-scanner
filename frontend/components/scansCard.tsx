"use client"

import { CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, Link as LinkIcon, ShieldAlert, Trash2, Target as TargetIcon, Zap, Radar, Activity, ShieldCheck, Target } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

import ExploitVisualizer from "@/components/ExploitVisualizer"

interface Scan {
  _id: string
  target: string
  profileName: string
  scanGroupId: string
  status: "pending" | "completed" | "failed"
  scanResult: any
  createdAt: string
}

export default function ScansCard({ scans }: { scans: Scan[] }) {
  const [activeMapView, setActiveMapView] = useState<string | null>(null)
  const [expandedScans, setExpandedScans] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const toggleExpand = (scanId: string) => {
    setExpandedScans(prev => ({ ...prev, [scanId]: !prev[scanId] }))
  }

  const getProfileIcon = (name: string) => {
    switch (name) {
      case 'port-scanner': return <TargetIcon size={18} className="text-orange-400" />;
      case 'headers-scanner': return <ShieldAlert size={18} className="text-violet-400" />;
      case 'fuzzing': return <Zap size={18} className="text-cyan-400" />;
      default: return <Activity size={18} className="text-zinc-400" />;
    }
  }

  const getProfileLabel = (name: string) => {
    switch (name) {
      case 'port-scanner': return "Network Port Audit";
      case 'headers-scanner': return "HTTP Security Headers";
      case 'fuzzing': return "Directory Fuzzing / Discovery";
      default: return name;
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scan result?")) return;
    try {
      await axios.delete(`http://localhost:8080/deleteScan/${id}`)
      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete scan.")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="text-emerald-400" size={16} />
      case "pending":
        return <Clock className="text-amber-400 animate-pulse" size={16} />
      default:
        return <AlertCircle className="text-rose-400" size={16} />
    }
  }

  return (
    <div className="space-y-4 w-full">
      {scans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-500 border border-white/10 rounded-xl bg-white/[0.02]">
          <ShieldAlert size={48} className="mb-4 opacity-20" />
          <p className="text-sm">No scans found. Start your first security audit from the Targets page.</p>
        </div>
      ) : (
        scans.map((scan) => {
          const isExpanded = expandedScans[scan._id]
          const findings = scan.scanResult?.findings || []
          const totalFindings = findings.length

          return (
            <article
              key={scan._id}
              className={`rounded-xl border transition-all duration-300 ${isExpanded ? "border-cyan-500/30 bg-[#0a0f1b]/80" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.03]"
                }`}
            >
              <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleExpand(scan._id)}>
                <div className="flex w-full items-center gap-6">
                  <div className={`p-4 rounded-xl bg-white/5 ${isExpanded ? 'text-cyan-400' : 'text-zinc-400'}`}>
                    {getProfileIcon(scan.profileName)}
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-white tracking-tight uppercase">{getProfileLabel(scan.profileName)}</h3>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${scan.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {scan.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                      <span className="font-semibold">{scan.target}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span className="font-mono italic">{new Date(scan.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Issues</p>
                    <p className={`text-base font-bold ${totalFindings > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                      {totalFindings}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(scan._id) }}
                      className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Scan"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="text-zinc-500">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-white/5">
                  <div className="p-3 space-y-3 mt-4">
                    {findings.length === 0 ? (
                      <p className="text-[11px] text-zinc-500 italic py-2 px-2">No security findings identifying for this profile run.</p>
                    ) : (
                      findings.map((finding: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs transition-colors hover:bg-white/[0.04]">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex gap-2 items-center">
                                {finding.url ? (
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Discovered URL</span>
                                    <a href={finding.url} target="_blank" className="text-cyan-400 hover:underline flex items-center gap-1 font-medium">
                                      <LinkIcon size={12} /> {finding.url}
                                    </a>
                                  </div>
                                ) : finding.header ? (
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">HTTP Header</span>
                                    <span className="text-violet-400 font-mono font-medium">{finding.header}</span>
                                  </div>
                                ) : finding.port ? (
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Open Port</span>
                                    <span className="text-orange-400 font-bold">Port: {finding.port}</span>
                                  </div>
                                ) : (
                                  <span className="text-zinc-300 font-medium">Finding Item</span>
                                )}
                              </div>

                              {finding.word && (
                                <div className="mt-2 text-zinc-400">
                                  <span className="text-zinc-500 mr-2">Wordlist Match:</span>
                                  <span className="text-zinc-200 font-medium font-mono">{finding.word}</span>
                                </div>
                              )}

                              {finding.exploit?.node && (
                                <div className="mt-3 p-2.5 rounded border border-cyan-500/10 bg-cyan-500/5 text-cyan-300/80">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <Zap size={10} className="text-cyan-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Exploit Instruction</span>
                                  </div>
                                  <p className="text-[11px] leading-relaxed italic">{finding.exploit.node}</p>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const key = `${scan._id}-${idx}`;
                                      setActiveMapView(activeMapView === key ? null : key);
                                    }}
                                    className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-wider text-cyan-400 hover:bg-cyan-500/20 transition-all"
                                  >
                                    <Radar size={12} />
                                    {activeMapView === `${scan._id}-${idx}` ? 'Hide Exploit Map' : 'View Exploit Map'}
                                  </button>
                                </div>
                              )}
                            </div>

                            {finding.status && (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${finding.status === 200 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-500/20 text-zinc-400 border border-white/10'}`}>
                                {finding.status}
                              </span>
                            )}
                          </div>

                          {activeMapView === `${scan._id}-${idx}` && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                              <ExploitVisualizer finding={finding} profileName={scan.profileName} />
                            </div>
                          )}

                          {finding.missing !== undefined && (
                            <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Security Status</span>
                              {finding.missing ? (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase">
                                  <ShieldAlert size={10} /> Missing
                                </span>
                              ) : (
                                <div className="flex flex-col items-end gap-1">
                                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
                                    <CheckCircle2 size={10} /> Configured
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[200px]">{finding.value}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </article>
          )
        })
      )}
    </div>
  )
}
