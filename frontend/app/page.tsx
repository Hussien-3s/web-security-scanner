import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export default function Home() {
  const metrics = [
    { label: "Risk score reduction", value: "96.5%" },
    { label: "Assets monitored", value: "1.2M+" },
    { label: "Mean response time", value: "6m" },
  ];

  const pillars = [
    {
      title: "AI-Driven Detection",
      description:
        "Correlate scans, cloud telemetry, and exploit feeds to surface what is actively dangerous first.",
    },
    {
      title: "Context Scoring",
      description:
        "Each issue is ranked by business impact, exploitability, and exposure across your stack.",
    },
    {
      title: "Attack Surface",
      description:
        "Inventory internet-facing assets in real-time and detect drift before attackers do.",
    },
    {
      title: "Native Cloud Integrations",
      description:
        "Connect AWS, Azure, and GCP accounts in minutes for continuous posture coverage.",
    },
  ];

  const threats = [
    {
      title: "Public S3 bucket with PII",
      severity: "Critical",
      source: "Cloud",
      eta: "9m ago",
    },
    {
      title: "RCE vulnerability in exposed package",
      severity: "High",
      source: "Dependency",
      eta: "18m ago",
    },
    {
      title: "Outdated TLS policy on API gateway",
      severity: "Medium",
      source: "Network",
      eta: "32m ago",
    },
    {
      title: "Open admin panel without MFA",
      severity: "Critical",
      source: "Identity",
      eta: "47m ago",
    },
  ];

  const compliance = [
    {
      title: "98%",
      subtitle: "Compliance score",
      detail: "Continuous policy checks across services and repos.",
    },
    {
      title: "120+",
      subtitle: "Policy checks",
      detail: "Automated controls mapped to standards and regulations.",
    },
    {
      title: "24/7",
      subtitle: "Audit ready",
      detail: "Evidence snapshots and reports generated on every change.",
    },
  ];

  const severityClass = (level: string) => {
    if (level === "Critical") return "bg-rose-500/15 text-rose-300 border-rose-500/30";
    if (level === "High") return "bg-orange-500/15 text-orange-300 border-orange-500/30";
    return "bg-amber-500/15 text-amber-300 border-amber-500/30";
  };

  return (
    <div className="relative overflow-hidden bg-[#05060b]">
                <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-black/60 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <span className="text-xl font-bold tracking-tight">CyberScan</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <a href="/home" className="hover:text-white transition-colors">Home</a>
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
            </nav>

            <div className="flex items-center gap-4">
              <button className="text-zinc-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              
              <Show when="signed-out">
                <div className="text-sm font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer hidden sm:block">
                  <SignInButton />
                </div>
                <SignUpButton>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-sm h-10 px-6 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    Get Started
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }} />
              </Show>
            </div>
          </header>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.14),_transparent_52%),radial-gradient(ellipse_at_70%_10%,_rgba(168,85,247,0.12),_transparent_46%)]" />
      <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs tracking-wider text-blue-200">
              CYBERSCAN PLATFORM
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Discover.
              <br />
              Prioritize.
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-violet-300 to-purple-300 bg-clip-text text-transparent">
                Remediate Faster.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-300 md:text-base">
              Enterprise vulnerability intelligence that helps security teams cut through noise, focus on exploitable
              risk, and automate response workflows from one command center.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500">
                Get Demo
              </button>
              <button className="rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08]">
                Start Free Trial
              </button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
              {metrics.map((item) => (
                <div key={item.label}>
                  <p className="text-xl font-semibold text-white md:text-2xl">{item.value}</p>
                  <p className="mt-1 text-xs text-zinc-400 md:text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
            <div className="rounded-xl border border-white/10 bg-[#0a0f1f] p-4">
              <div className="mb-4 flex items-center justify-between text-xs text-zinc-400">
                <span>Threat telemetry</span>
                <span className="rounded-full bg-blue-500/20 px-2 py-1 text-blue-200">Live</span>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[11px] text-zinc-400">Critical</p>
                  <p className="mt-1 text-2xl font-semibold text-rose-300">12</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[11px] text-zinc-400">Low</p>
                  <p className="mt-1 text-2xl font-semibold text-blue-200">420</p>
                </div>
              </div>
              <div className="space-y-2">
                {[72, 38, 84, 61, 49, 93, 58].map((bar, index) => (
                  <div key={`${bar}-${index}`} className="flex items-center gap-2">
                    <div className="h-2 w-full rounded bg-white/10">
                      <div
                        className="h-full rounded bg-gradient-to-r from-blue-500 to-violet-500"
                        style={{ width: `${bar}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[10px] text-zinc-400">{bar}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-16 md:px-10">
        <h2 className="text-center text-3xl font-semibold text-white">Full-Spectrum Defense</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-zinc-400">
          Cover every attack path with automated detection, contextual prioritization, and response playbooks.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {pillars.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6"
            >
              <h3 className="text-lg font-medium text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="rounded-2xl border border-white/10 bg-[#070b16] p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Real-Time Intelligence</h2>
            <span className="text-xs text-zinc-400">Last sync: 2m ago</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-zinc-400">
                  <th className="px-3 py-2">Issue</th>
                  <th className="px-3 py-2">Severity</th>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Detected</th>
                </tr>
              </thead>
              <tbody>
                {threats.map((item) => (
                  <tr key={item.title} className="rounded-lg bg-white/[0.02] text-sm text-zinc-200">
                    <td className="rounded-l-lg border border-white/5 px-3 py-3">{item.title}</td>
                    <td className="border-y border-white/5 px-3 py-3">
                      <span className={`rounded-full border px-2 py-1 text-xs ${severityClass(item.severity)}`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="border-y border-white/5 px-3 py-3 text-zinc-300">{item.source}</td>
                    <td className="rounded-r-lg border border-white/5 px-3 py-3 text-zinc-400">{item.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-16 md:px-10">
        <h2 className="text-center text-3xl font-semibold text-white">Automated Compliance</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-zinc-400">
          Map every finding to controls and generate evidence continuously for security and audit teams.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {compliance.map((item) => (
            <article key={item.subtitle} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-2xl font-semibold text-blue-200">{item.title}</p>
              <h3 className="mt-2 text-base font-medium text-white">{item.subtitle}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pt-4 pb-20 md:px-10">
        <div className="rounded-2xl border border-violet-300/20 bg-gradient-to-r from-[#142041] via-[#222148] to-[#3b1e5f] p-8 text-center shadow-[0_30px_90px_rgba(23,30,80,0.45)]">
          <h2 className="text-3xl font-semibold text-white">Ready to secure your stack?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-200/90">
            Start a 14-day trial and gain complete visibility across your cloud, code, and attack surface in minutes.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500">
              Start Free Trial
            </button>
            <button className="rounded-full border border-white/20 bg-black/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-black/35">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/35">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 text-sm md:grid-cols-4 md:px-10">
          <div>
            <p className="text-base font-semibold text-white">CyberScan</p>
            <p className="mt-3 text-zinc-400">Security posture management for modern engineering teams.</p>
          </div>
          <div>
            <p className="font-medium text-white">Product</p>
            <ul className="mt-3 space-y-2 text-zinc-400">
              <li>Platform</li>
              <li>Integrations</li>
              <li>Roadmap</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-white">Resources</p>
            <ul className="mt-3 space-y-2 text-zinc-400">
              <li>Documentation</li>
              <li>API</li>
              <li>Status</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-white">Company</p>
            <ul className="mt-3 space-y-2 text-zinc-400">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
