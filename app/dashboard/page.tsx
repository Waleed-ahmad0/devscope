'use client'

import { signOut } from "next-auth/react";

export default function DashboardPage() {
  // Dummy data
  const teams = [
    { id: "1", name: "Startup Alpha" },
    { id: "2", name: "College Group" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Good morning, John
          </h1>
          <p className="text-slate-600">
            Here's what's happening with your projects today.
          </p>
        </div>
        <button onClick={() => signOut()}>logout</button>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Teams Card */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-slate-600">
                Active Teams
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">2</div>
            <div className="text-sm text-slate-500">Across your workspace</div>
          </div>

          {/* Projects Card */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-slate-600">Projects</div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">3</div>
            <div className="text-sm text-slate-500">In progress</div>
          </div>

          {/* Tasks Card */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-slate-600">
                Your Tasks
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">12</div>
            <div className="text-sm text-slate-500">4 due this week</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Projects - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Projects
              </h2>
              <a
                href="/dashboard/projects"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all
              </a>
            </div>
            <div className="divide-y divide-slate-100">
              {/* Project Item 1 */}
              <a
                href="/dashboard/projects/1"
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    Website Redesign
                  </div>
                  <div className="text-sm text-slate-500">
                    8 tasks • Updated 2h ago
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-700">
                        SM
                      </span>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-700">
                        JC
                      </span>
                    </div>
                    <div className="w-8 h-8 bg-slate-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-semibold text-slate-600">
                        +3
                      </span>
                    </div>
                  </div>
                  <div className="w-24">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div className="w-3/4 bg-blue-600 rounded-full h-2"></div>
                      </div>
                      <span className="text-xs font-medium text-slate-600 w-10 text-right">
                        75%
                      </span>
                    </div>
                  </div>
                </div>
              </a>

              {/* Project Item 2 */}
              <a
                href="/dashboard/projects/2"
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    Marketing Campaign
                  </div>
                  <div className="text-sm text-slate-500">
                    5 tasks • Updated 5h ago
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-semibold text-purple-700">
                        ER
                      </span>
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-semibold text-purple-700">
                        MJ
                      </span>
                    </div>
                  </div>
                  <div className="w-24">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div className="w-1/2 bg-purple-600 rounded-full h-2"></div>
                      </div>
                      <span className="text-xs font-medium text-slate-600 w-10 text-right">
                        50%
                      </span>
                    </div>
                  </div>
                </div>
              </a>

              {/* Project Item 3 */}
              <a
                href="/dashboard/projects/3"
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    Mobile App Development
                  </div>
                  <div className="text-sm text-slate-500">
                    12 tasks • Updated 1d ago
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-semibold text-indigo-700">
                        AL
                      </span>
                    </div>
                    <div className="w-8 h-8 bg-indigo-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-semibold text-indigo-700">
                        KL
                      </span>
                    </div>
                    <div className="w-8 h-8 bg-slate-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-semibold text-slate-600">
                        +2
                      </span>
                    </div>
                  </div>
                  <div className="w-24">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div className="w-1/3 bg-indigo-600 rounded-full h-2"></div>
                      </div>
                      <span className="text-xs font-medium text-slate-600 w-10 text-right">
                        33%
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  Quick Actions
                </h2>
              </div>
              <div className="p-4 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-200">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">
                      New Project
                    </div>
                    <div className="text-xs text-slate-500">
                      Create a new project
                    </div>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-200">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">
                      New Team
                    </div>
                    <div className="text-xs text-slate-500">Invite members</div>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-200">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">
                      New Task
                    </div>
                    <div className="text-xs text-slate-500">
                      Add to any project
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Your Teams */}
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  Your Teams
                </h2>
              </div>
              <div className="p-4 space-y-2">
                {teams.map((team) => (
                  <a
                    key={team.id}
                    href={`/dashboard/teams/${team.id}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors group border border-transparent hover:border-blue-200"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {team.name}
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                ))}
                <a
                  href="/dashboard/teams"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>→ View all teams</span>
                </a>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Activity
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-blue-700">
                      SM
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">
                      <span className="font-medium">Sarah</span> completed{" "}
                      <span className="text-blue-600 font-medium">
                        Homepage Design
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-purple-700">
                      JC
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">
                      <span className="font-medium">James</span> created{" "}
                      <span className="text-blue-600 font-medium">
                        Q1 Planning
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-indigo-700">
                      ER
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">
                      <span className="font-medium">Emily</span> commented on{" "}
                      <span className="text-blue-600 font-medium">
                        API Integration
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">1 day ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-slate-700">
                      MJ
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">
                      <span className="font-medium">Mike</span> assigned you to{" "}
                      <span className="text-blue-600 font-medium">
                        Code Review
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
