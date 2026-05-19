import Link from "next/link";

const purposes = [
  "Simplify team collaboration",
  "Provide clear visibility into project progress",
  "Enable efficient task management",
  "Maintain a structured workflow for teams",
];

const capabilities = [
  "Create and manage teams",
  "Organize projects within teams",
  "Create, assign, and track tasks",
  "Update task statuses via drag-and-drop board",
  "Monitor activity history across projects",
  "View upcoming tasks and recent updates on a dashboard",
];

const principles = [
  {
    label: "Clarity over complexity",
    desc: "Keep the interface clean and minimal",
  },
  {
    label: "Collaboration first",
    desc: "Make teamwork seamless and frictionless",
  },
  {
    label: "Data integrity",
    desc: "Ensure consistent and reliable system behavior",
  },
  {
    label: "Scalability",
    desc: "Design features that can grow into real-world use cases",
  },
];

const techStack = [
  "Next.js",
  "TypeScript",
  "MongoDB",
  "Mongoose",
  "RESTful APIs",
  "Role-based Access Control",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-xs font-bold tracking-widest uppercase text-blue-600">
        {children}
      </span>
      <span className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* ── NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-8 h-8 shrink-0"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="8" fill="#2563eb" />
              <path
                d="M8 12L16 8L24 12V20L16 24L8 20V12Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 8V16M16 16L8 20M16 16L24 20"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-2xl font-bold text-slate-900">DevScope</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-[15px] hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="relative max-w-5xl mx-auto px-6 lg:px-8 pt-40 pb-20 overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-blue-100/60 blur-[100px] pointer-events-none" />
        <div className="absolute top-40 -left-16 w-56 h-56 rounded-full bg-blue-200/40 blur-[80px] pointer-events-none" />

        <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-5 flex items-center gap-3">
          <span className="block w-8 h-px bg-blue-600" />
          About DevScope
        </p>

        <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-8 text-slate-900">
          Modern tools
          <br />
          for{" "}
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            teams
          </span>
          <br />
          that ship.
        </h1>

        <p className="text-lg text-slate-500 max-w-md leading-relaxed">
          A project management platform built around simplicity and efficiency —
          clean interface, zero noise, full focus on getting work done.
        </p>
      </section>

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 pb-28 space-y-24">
        {/* PURPOSE */}
        <section>
          <SectionLabel>🎯 Purpose</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200">
            {purposes.map((item, i) => (
              <div
                key={i}
                className="bg-white hover:bg-slate-50 transition-colors duration-200 p-6 flex items-start gap-4 group"
              >
                <span className="text-xs font-bold text-blue-400 pt-0.5 shrink-0 group-hover:text-blue-600 transition-colors duration-200">
                  0{i + 1}
                </span>
                <span className="text-sm text-slate-600 leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CAPABILITIES */}
        <section>
          <SectionLabel>⚙️ What You Can Do</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((item, i) => (
              <div
                key={i}
                className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-2 h-2 rounded-full bg-blue-500 mb-4" />
                <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DESIGN PHILOSOPHY */}
        <section>
          <SectionLabel>🧠 Design Philosophy</SectionLabel>
          <div className="divide-y divide-slate-100 border-y border-slate-200">
            {principles.map((p, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8 py-6 group hover:bg-slate-50 px-4 -mx-4 rounded-lg transition-colors duration-150"
              >
                <p className="text-sm font-bold text-slate-900 md:col-span-1">
                  {p.label}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed md:col-span-2">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TECH STACK */}
        <section>
          <SectionLabel>🚀 Technical Overview</SectionLabel>
          <div className="flex flex-wrap gap-2.5">
            {techStack.map((t, i) => (
              <span
                key={i}
                className="text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* BOTTOM CARDS */}
        <section>
          <SectionLabel>More</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Developer */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                👨‍💻
              </div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
                About the Developer
              </p>
              <p className="text-sm text-slate-500 leading-[1.85]">
                Built as a full-stack project to demonstrate real-world
                application architecture — authentication, permissions, data
                relationships, and scalable system design.
              </p>
            </div>

            {/* Note */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                📌
              </div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
                Note
              </p>
              <p className="text-sm text-slate-500 leading-[1.85]">
                Built for learning and portfolio purposes, inspired by modern
                tools like Trello and Jira. Designed to reflect real-world
                product thinking.
              </p>
            </div>

            {/* Vision — accented card */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                🌟
              </div>
              <p className="text-xs font-bold tracking-widest uppercase text-blue-500 mb-3">
                Vision
              </p>
              <p className="text-sm text-slate-600 leading-[1.85]">
                DevScope aims to evolve into a more advanced collaboration tool
                with real-time updates, notifications, and deeper team insights.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <span className="text-xl font-bold text-blue-600">DevScope</span>
          </Link>
          <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
            Built for learning · Inspired by the best
          </span>
        </div>
      </footer>
    </div>
  );
}
