"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function HomePage() {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [router, session]);
  const currentYear = new Date().getFullYear();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                href="/about"
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
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-6 py-4 space-y-3 animate-[slideDown_0.2s_ease]">
            <Link
              href="/about"
              className="block py-2.5 text-slate-700 font-medium hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/login"
              className="block py-2.5 text-slate-700 font-medium hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="block w-full text-center py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
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

          <div className="relative max-w-5xl mx-auto mt-16 px-4 sm:px-6 lg:px-0 animate-fade-in-up animation-delay-500">
            {/* Browser chrome */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:-translate-y-1">
              {/* Title bar */}
              <div className="px-4 sm:px-5 py-3 bg-slate-100 border-b border-slate-200 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-2 flex-1 bg-white border border-slate-200 rounded-md px-3 py-1 text-[0.6rem] text-slate-400 font-mono max-w-[180px] sm:max-w-xs truncate">
                  devscope.app/dashboard
                </div>
              </div>

              <div className="flex min-h-[420px] sm:min-h-[480px]">
                {/* ── Sidebar ── */}
                <aside className="hidden sm:flex w-44 bg-white border-r border-slate-200 flex-col shrink-0">
                  {/* Logo */}
                  <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      DevScope
                    </span>
                  </div>

                  {/* Nav items */}
                  <nav className="px-2 py-3 flex flex-col gap-0.5">
                    {[
                      {
                        label: "Dashboard",
                        active: true,
                        icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                      },
                      {
                        label: "Teams",
                        active: false,
                        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
                      },
                      {
                        label: "Projects",
                        active: false,
                        icon: "M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z",
                      },
                      {
                        label: "Profile",
                        active: false,
                        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                      },
                    ].map(({ label, active, icon }) => (
                      <div
                        key={label}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[0.7rem] font-medium transition-colors ${
                          active ? "bg-blue-50 text-blue-700" : "text-slate-500"
                        }`}
                      >
                        <svg
                          className={`w-3.5 h-3.5 shrink-0 ${active ? "text-blue-600" : "text-slate-400"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={icon}
                          />
                        </svg>
                        {label}
                        {active && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}
                      </div>
                    ))}
                  </nav>

                  {/* Bottom user */}
                  <div className="mt-auto px-2 py-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 px-2 py-2 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[0.5rem] font-bold flex items-center justify-center shrink-0">
                        L
                      </div>
                      <div className="min-w-0">
                        <p className="text-[0.65rem] font-semibold text-slate-700 truncate">
                          John
                        </p>
                        <p className="text-[0.5rem] text-slate-400 truncate">
                          [johndoe@gmail.com]
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* ── Main content ── */}
                <div className="flex-1 flex flex-col bg-[#f8f9fc] overflow-hidden">
                  {/* Topbar */}
                  <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1 text-[0.65rem]">
                      <span className="text-slate-400">Dashboard</span>
                      <svg
                        className="w-3 h-3 text-slate-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span className="font-semibold text-slate-700">
                        Overview
                      </span>
                    </div>
                    <div className="flex-1 sm:ml-3">
                      <div className="relative max-w-xs">
                        <svg
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <div className="w-full pl-7 pr-8 py-1.5 text-[0.6rem] bg-slate-50 border border-slate-200 rounded-lg text-slate-400 font-mono">
                          Search projects, tasks... (Cmd+K)
                        </div>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[0.45rem] text-slate-400 bg-white border border-slate-200 rounded px-1">
                          ⌘K
                        </span>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[0.5rem] font-bold flex items-center justify-center ml-auto shrink-0">
                      J
                    </div>
                  </div>

                  <div className="flex-1 p-3 sm:p-4 space-y-3 overflow-hidden">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-800">
                          Good morning,{" "}
                          <span className="text-blue-600">john</span> 👋
                        </h2>
                        <p className="text-[0.6rem] text-slate-400 mt-0.5">
                          Here's what's happening with your projects today.
                        </p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <div className="flex items-center gap-1 px-2.5 py-1.5 text-[0.6rem] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="hidden sm:inline">New Team</span>
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-1.5 text-[0.6rem] font-semibold text-white bg-blue-600 rounded-lg shadow-sm">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <span className="hidden sm:inline">New Project</span>
                        </div>
                      </div>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          label: "YOUR TEAMS",
                          value: "1",
                          sub: "Across your workspace",
                          iconBg: "bg-blue-50",
                          iconColor: "text-blue-600",
                          icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
                        },
                        {
                          label: "PROJECTS",
                          value: "2",
                          sub: "In progress",
                          iconBg: "bg-emerald-50",
                          iconColor: "text-emerald-600",
                          icon: "M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z",
                        },
                        {
                          label: "UPCOMING TASKS",
                          value: "0",
                          sub: "Pending tasks",
                          iconBg: "bg-amber-50",
                          iconColor: "text-amber-500",
                          icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
                        },
                      ].map(
                        ({ label, value, sub, iconBg, iconColor, icon }) => (
                          <div
                            key={label}
                            className="bg-white border border-slate-200 rounded-xl p-2.5 sm:p-3 flex flex-col gap-2"
                          >
                            <div
                              className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}
                            >
                              <svg
                                className={`w-3.5 h-3.5 ${iconColor}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.8}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d={icon}
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-[0.5rem] font-semibold tracking-widest uppercase text-slate-400">
                                {label}
                              </p>
                              <p className="text-xl font-bold text-slate-800 leading-tight">
                                {value}
                              </p>
                              <p className="text-[0.55rem] text-slate-400">
                                {sub}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    {/* Bottom 3-column grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* Recent Projects */}
                      <div className="bg-white border border-slate-200 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2.5">
                          <p className="text-[0.7rem] font-bold text-slate-800">
                            Recent Projects
                          </p>
                          <span className="text-[0.6rem] font-semibold text-blue-600">
                            View all →
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {[
                            {
                              initials: "SA",
                              color: "bg-orange-500",
                              name: "startup alpha",
                              meta: "1 task · Apr 29",
                              progress: 0,
                            },
                            {
                              initials: "FY",
                              color: "bg-violet-600",
                              name: "final year project",
                              meta: "1 task · 3d ago",
                              progress: 0,
                            },
                          ].map((p) => (
                            <div
                              key={p.name}
                              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors group"
                            >
                              <div
                                className={`w-7 h-7 rounded-lg ${p.color} text-white text-[0.55rem] font-bold flex items-center justify-center shrink-0`}
                              >
                                {p.initials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[0.65rem] font-semibold text-slate-700 capitalize truncate">
                                  {p.name}
                                </p>
                                <p className="text-[0.55rem] text-slate-400">
                                  {p.meta}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <div className="w-10 h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${p.progress}%` }}
                                  />
                                </div>
                                <span className="text-[0.5rem] text-slate-400">
                                  {p.progress}%
                                </span>
                                <svg
                                  className="w-3 h-3 text-slate-300"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Upcoming Tasks */}
                      <div className="bg-white border border-slate-200 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2.5">
                          <p className="text-[0.7rem] font-bold text-slate-800">
                            Upcoming Tasks
                          </p>
                          <span className="text-[0.5rem] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                            0 total
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center h-28 gap-2">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-slate-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                          </div>
                          <p className="text-[0.65rem] font-semibold text-slate-400">
                            No pending tasks
                          </p>
                        </div>
                      </div>

                      {/* Teams + Activity */}
                      <div className="flex flex-col gap-2">
                        {/* Teams */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[0.7rem] font-bold text-slate-800">
                              Your Teams
                            </p>
                            <span className="text-[0.6rem] font-semibold text-blue-600">
                              View all →
                            </span>
                          </div>
                          <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors group cursor-default">
                            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white text-[0.55rem] font-bold flex items-center justify-center shrink-0">
                              ST
                            </div>
                            <p className="text-[0.65rem] font-semibold text-slate-700 flex-1">
                              startup alpha
                            </p>
                            <svg
                              className="w-3 h-3 text-slate-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3 flex-1">
                          <div className="flex items-center justify-between mb-2.5">
                            <p className="text-[0.7rem] font-bold text-slate-800">
                              Recent Activity
                            </p>
                            <span className="text-[0.5rem] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-md">
                              3
                            </span>
                          </div>
                          <div className="space-y-2.5">
                            {[
                              {
                                icon: "plus",
                                action: "Added member",
                                target: '"steve"',
                                time: "2h ago · 12:23 AM",
                              },
                              {
                                icon: "clock",
                                action: "Task marked as",
                                target: '"pending"',
                                time: "20h ago · 5:58 AM",
                              },
                              {
                                icon: "clock",
                                action: "Task marked as",
                                target: '"in progress"',
                                time: "20h ago · 5:58 AM",
                              },
                            ].map((a, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${a.icon === "plus" ? "bg-emerald-100" : "bg-blue-100"}`}
                                >
                                  {a.icon === "plus" ? (
                                    <svg
                                      className="w-2.5 h-2.5 text-emerald-600"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-2.5 h-2.5 text-blue-600"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2.5}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <p className="text-[0.6rem] text-slate-600 leading-snug">
                                    <span className="font-semibold text-slate-800">
                                      john doe{" "}
                                    </span>{" "}
                                    {a.action}{" "}
                                    <span className="font-medium text-blue-600">
                                      {a.target}
                                    </span>
                                  </p>
                                  <p className="text-[0.5rem] text-slate-400 mt-0.5">
                                    {a.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end body */}
                </div>
                {/* end main */}
              </div>
              {/* end flex */}
            </div>
            {/* end browser chrome */}

            {/* ── Floating badge: Task completed ── */}
            <div className="hidden lg:flex absolute top-1/4 -right-8 xl:-right-16 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 items-center gap-3 animate-float">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                >
                  <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 leading-tight">
                  Task completed
                </p>
                <p className="text-[0.6rem] text-slate-400 leading-tight">
                  Design system setup
                </p>
              </div>
            </div>

            {/* ── Floating badge: New member ── */}
            <div className="hidden lg:flex absolute bottom-1/4 -left-8 xl:-left-16 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 items-center gap-3 animate-float animation-delay-1500">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                >
                  <path d="M12 8C12 9.10457 11.1046 10 10 10C8.89543 10 8 9.10457 8 8C8 6.89543 8.89543 6 10 6C11.1046 6 12 6.89543 12 8Z" />
                  <path d="M6 16C6 13.7909 7.79086 12 10 12C12.2091 12 14 13.7909 14 16" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 leading-tight">
                  New member joined
                </p>
                <p className="text-[0.6rem] text-slate-400 leading-tight">
                  Ali joined Dev Team
                </p>
              </div>
            </div>

            {/* ── Mobile inline notification strip ── */}
            <div className="flex lg:hidden mt-3 gap-2">
              <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm px-3 py-2.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2.5"
                  >
                    <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold text-slate-700 truncate">
                    Task completed
                  </p>
                  <p className="text-[0.55rem] text-slate-400 truncate">
                    Design system setup
                  </p>
                </div>
              </div>
              <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm px-3 py-2.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                  >
                    <path d="M12 8C12 9.10457 11.1046 10 10 10C8.89543 10 8 9.10457 8 8C8 6.89543 8.89543 6 10 6C11.1046 6 12 6.89543 12 8Z" />
                    <path d="M6 16C6 13.7909 7.79086 12 10 12C12.2091 12 14 13.7909 14 16" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold text-slate-700 truncate">
                    New member joined
                  </p>
                  <p className="text-[0.55rem] text-slate-400 truncate">
                    Ali joined Dev Team
                  </p>
                </div>
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
                A Full Stack Task Management system using Next.js 16, Tailwind
                CSS & MongoDB
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
              © {currentYear} DevScope Project. For educational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
