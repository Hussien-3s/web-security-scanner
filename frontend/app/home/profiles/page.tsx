import { Activity, BookText, Radar, Settings, Zap } from "lucide-react";
import { Show, UserButton } from '@clerk/nextjs'
import userData from "@/app/actions/get-user-data";
import axios from "axios";
import ProfileList from "@/components/ProfileList";

export default async function ProfilesPage() {
  const user = await userData()
  const email = user?.primaryEmailAddress?.emailAddress

  let profiles = []
  let targets = []

  try {
    const profilesRes = await axios.get('http://localhost:8080/profiles')
    profiles = profilesRes.data || []

    if (email) {
      const targetsRes = await axios.post('http://localhost:8080/targets', { email })
      targets = targetsRes.data.data.targets || []
    }
  } catch (error) {
    console.error("Failed to fetch profiles/targets:", error)
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
            <a href="/home/scans" className="flex w-full flex-col items-center gap-1 rounded-lg py-2 text-zinc-500 hover:bg-white/[0.03] hover:text-cyan-200">
              <Zap size={16} />
              <span className="text-[9px] uppercase tracking-wide">Scans</span>
            </a>
            <a href="/home/targets" className="flex w-full flex-col items-center gap-1 rounded-lg py-2 text-zinc-500 hover:bg-white/[0.03] hover:text-cyan-200">
              <Radar size={16} />
              <span className="text-[9px] uppercase tracking-wide">Targets</span>
            </a>
            <a href="/home/profiles" className="flex w-full flex-col items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/12 py-2 text-cyan-300">
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
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white">Security Profiles</h1>
              <p className="text-sm text-zinc-500 mt-1">Configure and launch specialized security auditing engines</p>
            </div>

            <ProfileList profiles={profiles} targets={targets} />
          </main>
        </section>
      </div>
    </div>
  );
}
