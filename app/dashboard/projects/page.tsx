"use client";

import Link from "next/link";

interface Project {
    id: string;
    name: string;
    slug: string;
    team: string;
    status: "Active" | "In Progress" | "Done";
    progress: number;
    taskCount: number;
    updatedAt: string;
    members: string[];
}

export default function ProjectsPage() {
    // Dummy data - replace with actual data fetching later
    const projects: Project[] = [
        {
            id: "1",
            name: "Website Redesign",
            slug: "website-redesign",
            team: "Startup Alpha",
            status: "In Progress",
            progress: 75,
            taskCount: 8,
            updatedAt: "2 hours ago",
            members: ["JD", "SM", "AK"],
        },
        {
            id: "2",
            name: "Mobile App Development",
            slug: "mobile-app-development",
            team: "Tech Innovators",
            status: "Active",
            progress: 45,
            taskCount: 12,
            updatedAt: "5 hours ago",
            members: ["RK", "LP", "MN", "TW"],
        },
        {
            id: "3",
            name: "Marketing Campaign",
            slug: "marketing-campaign",
            team: "Startup Alpha",
            status: "Done",
            progress: 100,
            taskCount: 6,
            updatedAt: "1 day ago",
            members: ["JD", "SM"],
        },
        {
            id: "4",
            name: "API Integration",
            slug: "api-integration",
            team: "Dev Squad",
            status: "In Progress",
            progress: 60,
            taskCount: 10,
            updatedAt: "3 hours ago",
            members: ["AK", "RK", "LP"],
        },
    ];

    const getStatusColor = (status: Project["status"]) => {
        switch (status) {
            case "Active":
                return "bg-blue-100 text-blue-700";
            case "In Progress":
                return "bg-yellow-100 text-yellow-700";
            case "Done":
                return "bg-green-100 text-green-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    // Empty state component
    if (projects.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="p-8 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Projects
                            </h1>
                            <p className="text-slate-600">
                                Track and manage all your projects
                            </p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            + New Project
                        </button>
                    </div>

                    {/* Empty State */}
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
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
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            No projects yet
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Create your first project to get started
                        </p>
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            New Project
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Projects
                        </h1>
                        <p className="text-slate-600">
                            Track and manage all your projects
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        + New Project
                    </button>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm">
                            All Projects
                        </button>
                        <button className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm">
                            By Team ▾
                        </button>
                    </div>
                    <div className="flex gap-2 ml-auto">
                        <span className="text-sm text-slate-600 self-center mr-2">
                            Status:
                        </span>
                        <button className="px-3 py-1.5 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                            All
                        </button>
                        <button className="px-3 py-1.5 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                            Active
                        </button>
                        <button className="px-3 py-1.5 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                            Completed
                        </button>
                    </div>
                </div>

                {/* Projects List */}
                <div className="space-y-4">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/dashboard/projects/${project.slug}`}
                            className="block"
                        >
                            <div className="bg-white p-6 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {project.name}
                                            </h3>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                    project.status
                                                )}`}
                                            >
                                                {project.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
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
                                            <span>Team: {project.team}</span>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm">
                                        Open →
                                    </button>
                                </div>

                                <div className="flex items-center gap-6 mb-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
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
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                        <span>{project.taskCount} tasks</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
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
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>Updated {project.updatedAt}</span>
                                    </div>
                                    <div className="flex -space-x-2 ml-auto">
                                        {project.members.map((member, idx) => (
                                            <div
                                                key={idx}
                                                className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                                            >
                                                {member}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">
                                            Progress
                                        </span>
                                        <span className="font-medium text-slate-900">
                                            {project.progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{
                                                width: `${project.progress}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}