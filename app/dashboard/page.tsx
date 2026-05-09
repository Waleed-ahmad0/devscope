"use client";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CreateProject from "@/components/CreateProject";
import CreateTeam from "@/components/CreateTeam";
interface activities {
  _id: string;
  userId: { _id: string; firstName: string; lastName: string };
  teamId: { _id: string; name: string };
  projectId: { _id: string; name: string };
  action: string;
  createdAt: string;
  taskId?: { _id: string; title: string; createdAt: string };
}
interface teams {
  _id: string;
  name: string;
}

interface projectsshow {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  tasks: number;
}
interface Task {
  _id?: string;
  title: string;
  description: string;
  status: "pending" | "in progress" | "completed";
  projectId: string;
  createdby: string;
  Duedate: Date;
  assignedTo?: string;
  assignedUser?: string;
}

export default function DashboardPage() {
  const [createProject, setcreateProject] = useState<boolean>(false);
  const [createTeam, setcreateTeam] = useState<boolean>(false);
  const [activities, setActivities] = useState<activities[]>([]);
  const [teamnames, setteamnames] = useState<teams[]>([]);
  const [projects, setprojects] = useState<projectsshow[]>([]);
  const [totalteams, settotalteams] = useState<number>(0);
  const [totaltask, settotaltask] = useState<Task[]>([]);
  const [totalprojects, settotalprojects] = useState<number>(0);
  const [projecttasks, setprojecttasks] = useState<Task[]>([]);
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  // Dummy data
  useEffect(() => {
    if (session) {
      const getactivityfunc = async () => {
        const requestact = await fetch(
          `/api/activity?userId=${session?.user?.id}`,
        );
        const data = await requestact.json();
        // console.log(data.getactivitys)
        setActivities(data.getactivitys);
        setteamnames(data.teamNames);
        settotalteams(data.totalTeams);
        settotalprojects(data.totalProjects.length);
        // console.log("totalprojects", data.totalProjects);
        setprojects(data.totalProjects);
        settotaltask(data.totaltasks);
        setprojecttasks(data.totaltaskforproject);
        setIsLoading(false);
        // console.log(projecttasks)
        // console.log(data.totaltaskforproject);
      };
      getactivityfunc();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [session]);
  const taskfilter = (id: string) => {
    // console.log(id);
    const tasklength = projecttasks.filter((t) => t.projectId === id).length;
    // console.log(check);
    return tasklength;
  };
  const taskprogress = (id: string) => {
    const task = projecttasks.filter((t) => t.projectId === id);

    const comptask = task.filter((item: any) => item.status === "completed");
    
  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 p-8 max-w-7xl mx-auto space-y-8">
        <div className="mb-8 space-y-4">
          <div className="h-10 w-64 skeleton"></div>
          <div className="h-5 w-96 skeleton"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="h-32 skeleton"></div>
          <div className="h-32 skeleton"></div>
          <div className="h-32 skeleton"></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 skeleton"></div>
          <div className="space-y-6">
            <div className="h-48 skeleton"></div>
            <div className="h-64 skeleton"></div>
          </div>
        </div>
      </div>
    );
  }

  return (task.length > 0 ? (comptask.length / task.length) * 100 : 0).toFixed(1);
  };
  // const teams = [
  //   { _id: "1", name: "Startup Alpha" },
  //   { _id: "2", name: "College Group" },
  // ];
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:bg-slate-950">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 dark:text-slate-50 mb-2">
            Good morning, {session?.user?.name || session?.user?.firstName}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 dark:text-slate-400">
            Here's what's happening with your projects today.
          </p>
        </div>
        <button onClick={() => signOut()}>logout</button>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Teams Card */}
          <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-400">
                Your Teams
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
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-50 dark:text-slate-50 mb-1">
              {totalteams}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400">Across your workspace</div>
          </div>

          {/* Projects Card */}
          <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-400">Projects</div>
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
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-50 dark:text-slate-50 mb-1">
              {totalprojects}
            </div>
            {/* <div className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400">In progress</div> */}
          </div>

          {/* Upcoming Tasks Card */}
          <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-400">
                Upcoming Tasks
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  {totaltask.length} total
                </span>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {(() => {
                const pendingTasks = [...totaltask]
                  .filter((t) => t.status !== "completed")
                  .sort((a, b) => {
                    if (!a.Duedate && !b.Duedate) return 0;
                    if (!a.Duedate) return 1;
                    if (!b.Duedate) return -1;
                    return new Date(a.Duedate).getTime() - new Date(b.Duedate).getTime();
                  });
                const displayTasks = pendingTasks.slice(0, 4);
                const remaining = pendingTasks.length - 4;

                return (
                  <>
                    {displayTasks.length > 0 ? (
                      displayTasks.map((task) => {
                        const now = new Date();
                        const due = task.Duedate ? new Date(task.Duedate) : null;
                        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                        let dateLabel = "No date";
                        let dateColor = "text-slate-400";
                        let isOverdue = false;

                        if (due) {
                          const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
                          const diffDays = Math.round((dueStart.getTime() - todayStart.getTime()) / 86400000);
                          const formatted = due.toLocaleDateString("en-US", { month: "short", day: "numeric" });

                          if (diffDays < 0) {
                            dateLabel = `Overdue · ${formatted}`;
                            dateColor = "text-red-600";
                            isOverdue = true;
                          } else if (diffDays === 0) {
                            dateLabel = `Due Today · ${formatted}`;
                            dateColor = "text-orange-600";
                          } else if (diffDays === 1) {
                            dateLabel = `Tomorrow · ${formatted}`;
                            dateColor = "text-amber-600";
                          } else if (diffDays <= 7) {
                            dateLabel = `${diffDays}d left · ${formatted}`;
                            dateColor = "text-blue-600";
                          } else {
                            dateLabel = formatted;
                            dateColor = "text-slate-500 dark:text-slate-400 dark:text-slate-400";
                          }
                        }

                        const dotColor = isOverdue
                          ? "bg-red-500"
                          : task.status === "in progress"
                            ? "bg-amber-400"
                            : "bg-slate-400";

                        return (
                          <Link
                            href={`/dashboard/projects/${task.projectId}`}
                            key={task._id}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 hover:shadow-sm group ${
                              isOverdue
                                ? "bg-red-50/60 border border-red-200 hover:bg-red-50"
                                : "bg-slate-50 dark:bg-slate-950 dark:bg-slate-950/80 border border-transparent hover:bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 hover:border-slate-200 dark:border-slate-700 dark:border-slate-700"
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors">
                                {task.title}
                              </p>
                            </div>
                            <div className="shrink-0 flex items-center gap-1">
                              {isOverdue && (
                                <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                              <span className={`text-xs font-medium ${dateColor}`}>{dateLabel}</span>
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-slate-400">No pending tasks 🎉</p>
                      </div>
                    )}

                    {remaining > 0 && (
                      <div className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 dark:border-slate-800 text-center">
                        <span className="text-xs font-medium text-blue-600">+{remaining} more tasks</span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Projects - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 dark:text-slate-50">
                Recent Projects
              </h2>
              <a
                href="/dashboard/projects"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all
              </a>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 dark:divide-slate-800">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  href={`/dashboard/projects/${project._id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 transition-colors group"
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
                    <div className="font-semibold text-slate-900 dark:text-slate-50 dark:text-slate-50 mb-1 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400">
                      {taskfilter(project._id)} tasks •{" "}
                      {getRelativeTime(project.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex -space-x-2"></div>
                    <div className="w-24">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-300 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${taskprogress(project._id)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 dark:text-slate-400 w-10 text-right">
                          {taskprogress(project._id)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 dark:text-slate-50">
                  Quick Actions
                </h2>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    setcreateProject(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-200"
                >
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
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 dark:text-slate-50">
                      New Project
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400">
                      Create a new project
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setcreateTeam(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-200"
                >
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
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 dark:text-slate-50">
                      New Team
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400">Invite members</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Your Teams */}
            <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 dark:text-slate-50">
                  Your Teams
                </h2>
              </div>
              <div className="p-4 space-y-2">
                {teamnames.map((team) => (
                  <a
                    key={team._id}
                    href={`/dashboard/teams/${team._id}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 transition-colors group border border-transparent hover:border-blue-200"
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
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 dark:text-slate-50 group-hover:text-blue-600 transition-colors">
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
            <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 dark:border-slate-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 dark:text-slate-50">
                  Recent Activity
                </h2>
                {activities && activities.length > 0 && (
                  <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 text-slate-500 dark:text-slate-400 dark:text-slate-400 px-2 py-0.5 rounded-full">
                    {activities.length}
                  </span>
                )}
              </div>
              <div className="p-3 space-y-1">
                {activities && activities.length > 0 ? (
                  [...activities]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((activity) => {
                      const actionLower = activity.action.toLowerCase();
                      let iconBg = "bg-slate-100 dark:bg-slate-800 dark:bg-slate-800";
                      let iconColor = "text-slate-500 dark:text-slate-400 dark:text-slate-400";
                      let iconPath = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";

                      if (actionLower.includes("created") || actionLower.includes("added")) {
                        iconBg = "bg-emerald-100"; iconColor = "text-emerald-600";
                        iconPath = "M12 4v16m8-8H4";
                      } else if (actionLower.includes("completed") || actionLower.includes("done")) {
                        iconBg = "bg-green-100"; iconColor = "text-green-600";
                        iconPath = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
                      } else if (actionLower.includes("updated") || actionLower.includes("changed") || actionLower.includes("moved")) {
                        iconBg = "bg-blue-100"; iconColor = "text-blue-600";
                        iconPath = "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z";
                      } else if (actionLower.includes("deleted") || actionLower.includes("removed")) {
                        iconBg = "bg-red-100"; iconColor = "text-red-600";
                        iconPath = "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16";
                      }

                      const initials = `${activity.userId?.firstName?.[0] || ""}${activity.userId?.lastName?.[0] || ""}`.toUpperCase() || "??";

                      return (
                        <Link
                          href={`/dashboard/projects/${activity.projectId?._id}`}
                          key={activity._id}
                          className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 transition-colors group"
                        >
                          {/* Action icon */}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                            <svg className={`w-3.5 h-3.5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                            </svg>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700 dark:text-slate-300 dark:text-slate-300 leading-snug">
                              <span className="font-semibold text-slate-900 dark:text-slate-50 dark:text-slate-50">{activity.userId.firstName}</span>
                              {" "}
                              <span className="text-slate-500 dark:text-slate-400 dark:text-slate-400">{activity.action}</span>
                              {activity.taskId?.title && (
                                <>
                                  {" "}
                                  <span className="font-medium text-blue-600 group-hover:text-blue-700">&quot;{activity.taskId.title}&quot;</span>
                                </>
                              )}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                                <span className="text-[7px] font-bold text-white">{initials}</span>
                              </div>
                              <span className="text-xs text-slate-400">
                                {getRelativeTime(activity.createdAt)}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="text-xs text-slate-400">
                                {new Date(activity.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                ) : (
                  <div className="text-center py-6">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-400">No activity yet</p>
                  </div>
                )}

                {activities && activities.length > 5 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 dark:border-slate-800 text-center">
                    <span className="text-xs font-medium text-blue-600">
                      View all activity →
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <CreateTeam isOpen={createTeam} setIsOpen={setcreateTeam} />
        <CreateProject isOpen={createProject} setIsOpen={setcreateProject} />
      </div>
    </div>
  );
}
