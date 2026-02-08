"use client";

import { use } from "react";

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Dummy data - in real app, fetch based on params.id
    const id: string = decodeURIComponent(use(params).id);
    const team = {  
        id: id,
        name: "Startup Alpha",
        description: "Building the next big thing in SaaS",
        memberCount: 5,
        projectCount: 3,
        role: "Admin",
    };

    // Active tab state (for now, always "overview")
    const activeTab = "overview";

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {team.name}
                    </h1>
                    <p className="text-slate-600">{team.description}</p>
                </div>

                {/* Tabs */}
                <div className="mb-8 border-b border-slate-200">
                    <div className="flex gap-8">
                        <button
                            className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === "overview"
                                ? "text-blue-600"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            Overview
                            {activeTab === "overview" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                            )}
                        </button>
                        <button className="pb-3 px-1 font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Projects
                        </button>
                        <button className="pb-3 px-1 font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Members
                        </button>
                        <button className="pb-3 px-1 font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Settings
                        </button>
                    </div>
                </div>

                {/* Overview Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Members Card */}
                    <div className="bg-white p-6 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
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
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-slate-600">Members</h3>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">
                            {team.memberCount}
                        </div>
                    </div>

                    {/* Projects Card */}
                    <div className="bg-white p-6 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-purple-600"
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
                            <h3 className="text-sm font-medium text-slate-600">Projects</h3>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">
                            {team.projectCount}
                        </div>
                    </div>

                    {/* Role Card */}
                    <div className="bg-white p-6 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-indigo-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-slate-600">Your Role</h3>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">{team.role}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
