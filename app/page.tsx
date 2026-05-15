"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function HomePage() {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [router, session]);
  const currentYear = new Date().getFullYear();

  return (
    <div className="overflow-x-hidden">
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

          <ul className="hidden md:flex items-center gap-8">
            <li>
              <Link
                href="#about"
                className="text-slate-600 hover:text-slate-900 font-medium text-[15px] transition-colors relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="text-slate-600 hover:text-slate-900 font-medium text-[15px] transition-colors"
              >
                Log in
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-[15px] hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              >
                Get Started
              </Link>
            </li>
          </ul>

          <button
            className="md:hidden p-2 text-slate-900"
            aria-label="Toggle mobile menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </header>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-radial from-blue-500 via-transparent to-transparent opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-400 mb-6 tracking-tight leading-tight animate-fade-in-up animation-delay-100">
              Project management built for{" "}
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                modern teams
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
              Plan, track, and ship with confidence. DevScope brings your teams,
              projects, and tasks together in one powerful workspace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-300">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 text-white rounded-lg font-semibold text-base hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              >
                Get Started
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M7 3L14 10L7 17"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="relative max-w-5xl mx-auto mt-16 animate-fade-in-up animation-delay-500">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:-translate-y-1">
              <div className="px-6 py-4 bg-slate-100 border-b border-slate-200">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                  <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                  <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row p-8 gap-8 min-h-96">
                <div className="w-full md:w-48 flex flex-col gap-3">
                  <div className="h-10 bg-blue-600/20 rounded-lg animate-pulse-subtle"></div>
                  <div className="h-10 bg-slate-200 rounded-lg animate-pulse-subtle animation-delay-100"></div>
                  <div className="h-10 bg-slate-200 rounded-lg animate-pulse-subtle animation-delay-200"></div>
                  <div className="h-10 bg-slate-200 rounded-lg animate-pulse-subtle animation-delay-300"></div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="h-20 bg-slate-200 rounded-lg animate-slide-in-right animation-delay-100"></div>
                  <div className="h-20 bg-slate-200 rounded-lg animate-slide-in-right animation-delay-200"></div>
                  <div className="h-20 bg-slate-200 rounded-lg animate-slide-in-right animation-delay-300"></div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block absolute top-1/4 -right-8 xl:-right-16 bg-white border border-slate-200 rounded-xl shadow-lg px-6 py-4 animate-float">
              <div className="flex items-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                >
                  <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" />
                </svg>
                <span className="text-sm font-medium text-slate-600">
                  Task completed
                </span>
              </div>
            </div>
            <div className="hidden lg:block absolute bottom-1/4 -left-8 xl:-left-16 bg-white border border-slate-200 rounded-xl shadow-lg px-6 py-4 animate-float animation-delay-1500">
              <div className="flex items-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                >
                  <path d="M12 8C12 9.10457 11.1046 10 10 10C8.89543 10 8 9.10457 8 8C8 6.89543 8.89543 6 10 6C11.1046 6 12 6.89543 12 8Z" />
                  <path d="M6 16C6 13.7909 7.79086 12 10 12C12.2091 12 14 13.7909 14 16" />
                </svg>
                <span className="text-sm font-medium text-slate-600">
                  New member joined
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Everything you need to ship faster
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Powerful features that scale with your team. From startups to
              enterprises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-600 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Kanban boards
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Visualize your workflow with intuitive drag-and-drop boards.
                Move tasks seamlessly across stages.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-600 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" />
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Team collaboration
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Work together in real-time. Assign tasks, mention teammates, and
                stay in sync across your organization.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-600 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Lightning fast
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Built for speed. Navigate projects, search tasks, and update
                statuses instantly with our optimized interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white text-gray-700 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left space-y-2">
              <Link href="/" className="inline-block">
                <h3 className="text-blue-600 text-xl font-bold hover:text-blue-700 transition-colors">
                  DevScope
                </h3>
              </Link>
              <p className="text-s text-gray-500">
                A Full Stack Task Management system using Next.js 16, Tailwind CSS
               & MongoDB
              </p>
            </div>

          
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-xs font-semibold text-gray-900">
                Project by Developer
              </p>
              <div className="flex gap-4">
                <Link
                  href="https://github.com/Waleed-ahmad0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                  aria-label="GitHub"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="https://www.linkedin.com/in/waleed-a-57417a372/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-s text-gray-500">
              © {currentYear} DevScope Project. For
              educational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
