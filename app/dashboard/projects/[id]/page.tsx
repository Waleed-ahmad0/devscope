"use client";

import { use, useState } from "react";

interface ProjectDetail {
    id: string;
    name: string;
    team: string;
    status: "Active" | "In Progress" | "Done";
    progress: number;
    totalTasks: number;
    completedTasks: number;
}

interface Task {
    id: string;
    name: string;
    status: "Todo" | "In Progress" | "Done";
    assignee: string;
    dueDate?: string;
}

interface Member {
    id: string;
    name: string;
    initials: string;
    role: "Admin" | "Member";
    email: string;
}

type TabType = "overview" | "tasks" | "members" | "settings";

export default function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id: string = decodeURIComponent(use(params).id);
    const [activeTab, setActiveTab] = useState<TabType>("overview");

    // Dummy project data
    const project: ProjectDetail = {
        id: id,
        name: "Website Redesign",
        team: "Startup Alpha",
        status: "In Progress",
        progress: 75,
        totalTasks: 8,
        completedTasks: 6,
    };

    // Dummy tasks data
    const tasks: Task[] = [
        { id: "1", name: "Design homepage mockup", status: "Done", assignee: "JD", dueDate: "Jan 15" },
        { id: "2", name: "Build navigation component", status: "Done", assignee: "SM", dueDate: "Jan 18" },
        { id: "3", name: "Implement responsive layout", status: "Done", assignee: "AK", dueDate: "Jan 20" },
        { id: "4", name: "Create footer section", status: "Done", assignee: "JD", dueDate: "Jan 22" },
        { id: "5", name: "Add contact form", status: "Done", assignee: "SM", dueDate: "Jan 25" },
        { id: "6", name: "Integrate analytics", status: "Done", assignee: "AK", dueDate: "Jan 28" },
        { id: "7", name: "Performance optimization", status: "In Progress", assignee: "JD", dueDate: "Feb 1" },
        { id: "8", name: "Final QA testing", status: "Todo", assignee: "SM", dueDate: "Feb 5" },
    ];

    // Dummy members data
    const members: Member[] = [
        { id: "1", name: "John Doe", initials: "JD", role: "Admin", email: "john@example.com" },
        { id: "2", name: "Sarah Miller", initials: "SM", role: "Member", email: "sarah@example.com" },
        { id: "3", name: "Alex Kim", initials: "AK", role: "Member", email: "alex@example.com" },
    ];

    const getStatusColor = (status: ProjectDetail["status"]) => {
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

    const getTaskStatusColor = (status: Task["status"]) => {
        switch (status) {
            case "Todo":
                return "bg-slate-100 text-slate-700";
            case "In Progress":
                return "bg-yellow-100 text-yellow-700";
            case "Done":
                return "bg-green-100 text-green-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Progress Card */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-medium text-slate-600">Progress</h3>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{project.progress}%</div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
                            </div>
                        </div>

                        {/* Total Tasks Card */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-medium text-slate-600">Total Tasks</h3>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">{project.totalTasks}</div>
                        </div>

                        {/* Completed Tasks Card */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-medium text-slate-600">Completed</h3>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">{project.completedTasks}</div>
                        </div>

                        {/* Team Card */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-medium text-slate-600">Team</h3>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">{project.team}</div>
                        </div>
                    </div>
                );

            case "tasks":
                return (
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Task</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Assignee</th>
                                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Due Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-900">{task.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                                                {task.assignee}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {task.dueDate || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case "members":
                return (
                    <div className="space-y-4">
                        {members.map((member) => (
                            <div key={member.id} className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                                    {member.initials}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-slate-900">{member.name}</div>
                                    <div className="text-sm text-slate-600">{member.email}</div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.role === "Admin"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-slate-100 text-slate-700"
                                    }`}>
                                    {member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                );

            case "settings":
                return (
                    <div className="space-y-6">
                        {/* Project Settings */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Project Name</label>
                                    <input
                                        type="text"
                                        defaultValue={project.name}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                                    <select
                                        defaultValue={project.status === "Done" ? "Completed" : "Active"}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-white p-6 rounded-lg border border-red-200">
                            <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Once you delete a project, there is no going back. Please be certain.
                            </p>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                                Delete Project
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>Team: {project.team}</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8 border-b border-slate-200">
                    <div className="flex gap-8">
                        {(["overview", "tasks", "members", "settings"] as TabType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 px-1 font-medium transition-colors relative capitalize ${activeTab === tab
                                        ? "text-blue-600"
                                        : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                {renderTabContent()}
            </div>
        </div>
    );
}
