"use client";

export default function TeamsPage() {
    // Dummy data - set to empty array to see empty state
    const teams = [
        {
            id: "1",
            name: "Startup Alpha",
            description: "Building the next big thing in SaaS",
            memberCount: 5,
            projectCount: 3,
            role: "Admin",
            slug: "startup-alpha",
        },
        {
            id: "2",
            name: "College Group",
            description: "Final year project collaboration",
            memberCount: 4,
            projectCount: 2,
            role: "Member",
            slug: "college-group",
        },
    ];

    const handleNewTeam = () => {
        alert("Coming soon: Create a new team");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-8 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Teams</h1>
                        <p className="text-slate-600">Create and manage your teams</p>
                    </div>
                    <button
                        onClick={handleNewTeam}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                        <svg
                            className="w-5 h-5"
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
                        New Team
                    </button>
                </div>

                {/* Teams List or Empty State */}
                {teams.length === 0 ? (
                    // Empty State
                    <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-slate-400"
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
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">
                                You are not part of any team yet
                            </h2>
                            <p className="text-slate-600 mb-6">
                                Create your first team to start collaborating with others
                            </p>
                            <button
                                onClick={handleNewTeam}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                            >
                                <svg
                                    className="w-5 h-5"
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
                                Create your first team
                            </button>
                        </div>
                    </div>
                ) : (
                    // Teams Grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teams.map((team) => (
                            <div
                                key={team.id}
                                className="bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all group"
                            >
                                {/* Team Icon & Name */}
                                <div className="flex items-start gap-3 mb-4">
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
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate">
                                            {team.name}
                                        </h3>
                                        {team.description && (
                                            <p className="text-sm text-slate-600 line-clamp-2">
                                                {team.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Team Stats */}
                                <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-1.5">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                            />
                                        </svg>
                                        <span>{team.memberCount} members</span>
                                    </div>
                                    <span className="text-slate-300">•</span>
                                    <div className="flex items-center gap-1.5">
                                        <svg
                                            className="w-4 h-4"
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
                                        <span>{team.projectCount} projects</span>
                                    </div>
                                </div>

                                {/* Role Badge */}
                                <div className="mb-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${team.role === "Admin"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-slate-100 text-slate-700"
                                            }`}
                                    >
                                        Role: {team.role}
                                    </span>
                                </div>

                                {/* View Team Button */}
                                <a
                                    href={`/dashboard/teams/${team.slug}`}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-50 text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium border border-slate-200 group-hover:border-blue-300"
                                >
                                    Open Team
                                    <svg
                                        className="w-4 h-4"
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}