"use client"

import { CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, Link as LinkIcon, ShieldAlert } from "lucide-react"
import { useState } from "react"

interface Scan {
  _id: string
  target: string
  profileName: string
  status: "pending" | "completed" | "failed"
  scanResult: any
  createdAt: string
}

export default function ScansCard({ scans }: { scans: Scan[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="text-emerald-400" size={18} />
      case "pending":
        return <Clock className="text-amber-400 animate-pulse" size={18} />
      default:
        return <AlertCircle className="text-rose-400" size={18} />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      case "pending":
        return "bg-amber-500/10 border-amber-500/20 text-amber-400"
      default:
        return "bg-rose-500/10 border-rose-500/20 text-rose-400"
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
          const findings = scan.scanResult?.findings || []
          const isExpanded = expandedId === scan._id

          return (
            <article
              key={scan._id}
              className={`rounded-xl border transition-all duration-300 ${isExpanded ? "border-cyan-500/30 bg-white/[0.04]" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.03]"
                }`}
            >
              <div className="flex items-cente justify-between p-4 cursor-pointer" onClick={() => toggleExpand(scan._id)}>
                <div className="flex w-full items-center gap-4">
                  <div className={`p-2 rounded-lg ${getStatusClass(scan.status)}`}>
                    {getStatusIcon(scan.status)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      {scan.target}
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
                        {scan.profileName}
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {new Date(scan.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">Findings</p>
                    <p className={`text-sm font-bold ${findings.length > 0 ? "text-cyan-400" : "text-zinc-300"}`}>
                      {findings.length}
                    </p>
                  </div>
                  <div className="text-zinc-500">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-white/5">
                  <div className="mt-3 space-y-2">
                    {findings.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-4 text-center">No vulnerabilities or findings identified in this scan.</p>
                    ) : (
                      findings.map((finding: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-2 items-center">
                              {finding.url ? (
                                <a href={finding.url} target="_blank" className="text-cyan-400 hover:underline flex items-center gap-1">
                                  <LinkIcon size={12} /> {finding.url}
                                </a>
                              ) : finding.header ? (
                                <span className="text-violet-400 font-mono">{finding.header}</span>
                              ) : finding.port ? (
                                <span className="text-orange-400 font-bold">Port: {finding.port}</span>
                              ) : (
                                <span className="text-zinc-300">Finding Item</span>
                              )}
                            </div>
                            {finding.status && (
                              <span className={`px-2 py-0.5 rounded text-[10px] ${finding.status === 200 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                                {finding.status}
                              </span>
                            )}
                          </div>
                          {finding.missing !== undefined && (
                            <p className="mt-2 text-zinc-400">
                              Status: {finding.missing ? <span className="text-rose-400">Missing</span> : <span className="text-emerald-400">Found: {finding.value}</span>}
                            </p>
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
