"use client"

import { Play, ShieldCheck, Search } from "lucide-react"
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
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [searchProfiles, setSearchProfiles] = useState<any[]>([]);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [saveChanges, setSaveChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [view, setView] = useState('list');
  const [profilesAutoRun, setProfilesAutoRun] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("profilesAutoRun");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const router = useRouter();

  const handleSearch = async () => {
    const res = await axios.get(`http://localhost:9200/profiles/_search?q=${searchQuery}`)
    const data = res.data.hits.hits
    const mapData = data.map((item: any, index: number) => {
      return (
        <article
          key={index}
          className={`flex items-center justify-between rounded-xl border w-full px-4 py-4 transition-all group cursor-pointer`}
        >
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">{item._source.profileName}</p>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase font-bold tracking-tighter ${badgeClass(item.severity)}`}>
                  {item._source.severity}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">{item._source.description}</p>
            </div>
          </div>
        </article>
      );
    })

    if (data.length === 0) {
      setView('none-profile-found')
    }
    setSearchProfiles(mapData)
    setView('search-results')
  }

  const handleLaunchSuite = async () => {
    if (!selectedTarget) {
      alert("Please select a target first.");
      return
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8080/startScan', {
        target: selectedTarget,
        email: user?.emailAddresses[0].emailAddress,
        profiles: JSON.parse(localStorage.getItem("profilesAutoRun") || "[]")
      });

      router.push(`/home/scans/${encodeURIComponent(selectedTarget)}`);
    } catch (error) {
      console.error("Batch scan error:", error);
      alert("Scan failed to start.");
    } finally {
      setLoading(false);
    }
  };

  const mapProfiles = profiles.map((item: any, index: number) => {
    const isSelected = selectedProfiles.includes(item.profileName);
    const isAutoRun = profilesAutoRun.includes(item.profileName);
    return (
      <article
        key={index}
        className={`flex items-center justify-between rounded-xl border w-full px-4 py-4 transition-all group cursor-pointer ${isSelected
          ? "border-cyan-500/40 bg-cyan-500/5 shadow-[inset_0_0_20px_rgba(34,211,238,0.02)]"
          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
          }`}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-white/5 group-hover:bg-cyan-500/10 transition-colors">
            <ShieldCheck size={20} className={isSelected ? "text-cyan-400" : "text-zinc-400"} />
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
          <div className="hidden sm:flex items-center gap-2 mr-2" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] text-zinc-500 uppercase">Auto-run</span>
            <input type="checkbox" className="w-4 h-4" checked={isAutoRun} onChange={(e) => {
              if (e.target.checked) {

                setProfilesAutoRun([...profilesAutoRun, item.profileName]);
                setSaveChanges(true)
              } else {
                setProfilesAutoRun(profilesAutoRun.filter((profile) => profile !== item.profileName));
                setSaveChanges(true)
              }
            }} />
          </div>
        </div>
      </article>
    );
  })

  return (
    <div className="space-y-6 w-full">
      <div className="p-4 rounded-xl w-full border border-cyan-500/20 bg-cyan-500/5 mb-8 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
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


        <button
          onClick={handleLaunchSuite}
          className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 bg-cyan-500 text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Initializing...
            </span>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              Launch Security Suite
            </>
          )}
        </button>
      </div>

      <div className="p-4 rounded-xl w-full border border-cyan-500/20 bg-cyan-500/5 mb-8 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-cyan-200 uppercase tracking-wider mb-2">
            Search Profiles
          </label>
          <input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Enter Profile Name ..." className="w-full bg-[#0a0f1b] border border-white/10 rounded-lg p-1.5 text-sm text-white outline-none focus:border-cyan-500/50 transition-colors" />
        </div>


        <button
          onClick={handleSearch}
          className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center bg-cyan-500 text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95`}
        >
          Search
          <Search className="ml-2" size={16} />
        </button>
      </div>


      <div className="grid gap-3">
        {view === 'list' && mapProfiles}
        {view === 'none-profile-found' && <div>No profile found</div>}
        {view === 'search-results' && searchProfiles}
        {saveChanges && <button onClick={() => { window.localStorage.setItem("profilesAutoRun", JSON.stringify(profilesAutoRun)); setSaveChanges(false) }} className="bg-cyan-300 w-full hover:bg-cyan-600 text-black rounded-sm font-bold text-sm h-10 px-6 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)]">Save Changes</button>}
      </div>
    </div>
  );
}
