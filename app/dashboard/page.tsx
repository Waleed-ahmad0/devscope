"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CreateProject from "@/components/CreateProject";
import CreateTeam from "@/components/CreateTeam";

interface activities {
  _id: string;
  userName: string;
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [createProject, setcreateProject] = useState<boolean>(false);
  const [createTeam, setcreateTeam] = useState<boolean>(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const quickMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (quickMenuRef.current && !quickMenuRef.current.contains(e.target as Node)) {
        setQuickMenuOpen(false);
      }
    };
    if (quickMenuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [quickMenuOpen]);
  const [activities, setActivities] = useState<activities[]>([]);
  const [teamnames, setteamnames] = useState<teams[]>([]);
  const [projects, setprojects] = useState<projectsshow[]>([]);
  const [totalteams, settotalteams] = useState<number>(0);
  const [totaltask, settotaltask] = useState<Task[]>([]);
  const [totalprojects, settotalprojects] = useState<number>(0);
  const [projecttasks, setprojecttasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      const getactivityfunc = async () => {
        try {
          const requestact = await fetch(
            `/api/activity?userId=${session.user.id}`,
          );
          if (!requestact.ok) {
            throw new Error(
              `Server error: ${requestact.status} ${requestact.statusText}`,
            );
          }
          const data = await requestact.json();
          if (data.error) {
            throw new Error(data.error);
          }
          setActivities(data.getactivitys);
          setteamnames(data.teamNames);
          settotalteams(data.totalTeams);
          settotalprojects(data?.activeProjects);
          setprojects(data.totalProjects);
          const ptasks = data.totaltasks.filter((t: Task) => t.status != "completed")
          settotaltask(ptasks);
          setprojecttasks(data.totaltaskforproject);
        } catch (error: any) {
          console.error("Error fetching dashboard data:", error);
          setError(
            error?.message ||
            "Something went wrong while loading your dashboard.",
          );
        } finally {
          setLoading(false);
        }
      };
      getactivityfunc();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status, refreshKey]);

  const taskfilter = (id: string) => {
    const tasklength = projecttasks.filter((t) => t.projectId === id).length;
    return tasklength;
  };

  const taskprogress = (id: string) => {
    const task = projecttasks.filter((t) => t.projectId === id);
    const comptask = task.filter((item: any) => item.status === "completed");
    return (
      task.length > 0 ? (comptask.length / task.length) * 100 : 0
    ).toFixed(1);
  };

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

  function SkeletonBox({
    w = "100%",
    h = "16px",
    radius = "6px",
  }: {
    w?: string;
    h?: string;
    radius?: string;
  }) {
    return (
      <div
        className="animate-pulse bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[200%_100%]"
        style={{ width: w, height: h, borderRadius: radius }}
      />
    );
  }

  if (loading || status === "loading") {
    return (
      <div
        className="h-auto bg-slate-50 grid gap-[18px] p-4 sm:p-6 sm:px-7"
        style={{ gridTemplateRows: "auto auto 1fr" }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <SkeletonBox w="300px" h="30px" radius="8px" />
            <div className="mt-2">
              <SkeletonBox w="250px" h="14px" radius="4px" />
            </div>
          </div>
          <div className="flex gap-2.5">
            <SkeletonBox w="120px" h="38px" radius="10px" />
            <SkeletonBox w="120px" h="38px" radius="10px" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-[14px] p-[18px_20px] flex items-center gap-4"
            >
              <SkeletonBox w="46px" h="46px" radius="12px" />
              <div className="flex-1">
                <SkeletonBox w="60%" h="12px" radius="4px" />
                <div className="mt-2">
                  <SkeletonBox w="40%" h="30px" radius="6px" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_290px] gap-3.5 mt-4"
        >
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-[14px] p-4 flex flex-col gap-4"
            >
              <SkeletonBox w="150px" h="20px" radius="6px" />
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <SkeletonBox w="40px" h="40px" radius="10px" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBox w="80%" h="14px" />
                    <SkeletonBox w="50%" h="12px" />
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="flex flex-col gap-3.5">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-[14px] p-4 flex flex-col gap-4 min-h-[200px]"
              >
                <SkeletonBox w="120px" h="20px" radius="6px" />
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <SkeletonBox w="36px" h="36px" radius="8px" />
                    <SkeletonBox w="70%" h="14px" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-red-100 rounded-2xl p-10 max-w-md w-full text-center shadow-[0_4px_24px_rgba(220,38,38,0.07)]">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>

          <h2 className="text-[20px] font-extrabold text-slate-900 mb-2 tracking-tight">
            Failed to load dashboard
          </h2>
          <p className="text-sm text-slate-500 mb-1 leading-relaxed">
            We couldn&apos;t fetch your dashboard data. This might be a
            temporary issue.
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                window.location.reload();
              }}
              className="inline-flex items-center justify-center gap-2 w-full font-bold text-sm rounded-[10px] px-5 py-[10px] cursor-pointer transition-all duration-150 text-white border-none shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
              style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15" />
              </svg>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-auto bg-slate-50 grid gap-[18px] p-4 sm:p-6 sm:px-7 animate-fade-in-up"
      style={{ gridTemplateRows: "auto auto 1fr" }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[26px] font-extrabold text-slate-900 tracking-tight mb-[3px]">
            Good morning,{" "}
            <span className="text-blue-600">
              {session?.user?.name || session?.user?.firstName}
            </span>{" "}
            👋
          </h1>
          {/* <div onClick={() => { signOut() }}>hello</div> */}
          <p className="hidden sm:block text-sm text-slate-500 m-0">
            Here's what's happening with your projects today.
          </p>
        </div>
        {/* Desktop: full buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={() => setcreateTeam(true)}
            className="inline-flex items-center gap-[7px] font-bold text-sm rounded-[10px] px-[18px] py-[9px] cursor-pointer transition-all duration-150 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            New Team
          </button>
          <button
            onClick={() => setcreateProject(true)}
            className="inline-flex items-center gap-[7px] font-bold text-sm rounded-[10px] px-[18px] py-[9px] cursor-pointer transition-all duration-150 text-white border-none shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
            style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Project
          </button>
        </div>

        {/* Mobile: single "+" button with dropdown */}
        <div className="sm:hidden relative" ref={quickMenuRef}>
          <button
            onClick={() => setQuickMenuOpen((v) => !v)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-[0_2px_8px_rgba(37,99,235,0.35)] transition-all duration-200 hover:shadow-[0_4px_14px_rgba(37,99,235,0.45)] active:scale-95"
            style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
            aria-label="Quick actions"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${quickMenuOpen ? "rotate-45" : ""}`}
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>

          {quickMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50 overflow-hidden animate-[pp-in_0.15s_ease]">
              <button
                onClick={() => { setcreateTeam(true); setQuickMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                New Team
              </button>
              <button
                onClick={() => { setcreateProject(true); setQuickMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                New Project
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-[14px] p-[18px_20px] flex items-center gap-4 transition-all duration-180 hover:shadow-[0_4px_18px_rgba(37,99,235,0.1)] hover:-translate-y-0.5">
          <div className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center shrink-0 bg-blue-50">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-[.06em] mb-1">
              Your Teams
            </div>
            <div className="text-[30px] font-extrabold text-slate-900 leading-none">
              {totalteams}
            </div>
            <div className="text-[12px] text-slate-400 mt-[3px]">
              Across your workspace
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[14px] p-[18px_20px] flex items-center gap-4 transition-all duration-180 hover:shadow-[0_4px_18px_rgba(37,99,235,0.1)] hover:-translate-y-0.5">
          <div className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center shrink-0 bg-green-50">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-[.06em] mb-1">
              Projects
            </div>
            <div className="text-[30px] font-extrabold text-slate-900 leading-none">
              {totalprojects}
            </div>
            <div className="text-[12px] text-slate-400 mt-[3px]">
              In progress
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[14px] p-[18px_20px] flex items-center gap-4 transition-all duration-180 hover:shadow-[0_4px_18px_rgba(37,99,235,0.1)] hover:-translate-y-0.5">
          <div className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center shrink-0 bg-yellow-50">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ca8a04"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-[.06em] mb-1 flex items-center justify-between">
              <span>Upcoming Tasks</span>
              <span className="text-[11px] font-bold bg-blue-50 text-blue-600 px-[7px] py-px rounded-full">
                {totaltask.length} total
              </span>
            </div>
            <div className="text-[30px] font-extrabold text-slate-900 leading-none">
              {totaltask.filter((t) => t.status !== "completed").length}
            </div>
            <div className="text-[12px] text-slate-400 mt-[3px]">
              Pending tasks
            </div>
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_290px] gap-3.5 min-h-0"
      >
        <div className="bg-white border border-slate-200 rounded-[14px] flex flex-col overflow-hidden min-h-0">
          <div className="px-[18px] py-3.5 border-b border-slate-50 flex items-center justify-between shrink-0">
            <span className="text-[15px] font-bold text-slate-900">
              Recent Projects
            </span>
            <Link
              href="/dashboard/projects"
              className="text-[13px] font-semibold text-blue-600 no-underline hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {projects.length === 0 ? (
              <div className="text-center p-6 text-sm text-slate-400">
                No projects yet
              </div>
            ) : (
              projects.map((project) => {
                const palette = [
                  "#2563eb",
                  "#7c3aed",
                  "#0891b2",
                  "#059669",
                  "#d97706",
                  "#db2777",
                ];
                let h = 0;
                for (const c of project._id)
                  h = c.charCodeAt(0) + ((h << 5) - h);
                const color = palette[Math.abs(h) % palette.length];
                const prog = taskprogress(project._id);
                return (
                  <Link
                    key={project._id}
                    href={`/dashboard/projects/${project._id}`}
                    className="flex items-center gap-3 px-[18px] py-3 border-b border-slate-50 last:border-b-0 no-underline transition-colors duration-120 hover:bg-slate-50 group"
                  >
                    <div
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[13px] font-extrabold text-white shrink-0"
                      style={{ background: color }}
                    >
                      {project.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {taskfilter(project._id)} tasks ·{" "}
                        {getRelativeTime(project.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${prog}%`, background: color }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-500 w-9 text-right shrink-0">
                        {prog}%
                      </span>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })
            )}
          </div>
        </div>
        

        <div className="bg-white border border-slate-200 rounded-[14px] flex flex-col overflow-hidden min-h-0">
          <div className="px-[18px] py-3.5 border-b border-slate-50 flex items-center justify-between shrink-0">
            <span className="text-[15px] font-bold text-slate-900">
              Upcoming Tasks
            </span>
            <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
              {totaltask.length} total
            </span>
          </div>
          <div className="overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {(() => {
              const pendingTasks = [...totaltask]
                .filter((t) => t.status !== "completed")
                .sort((a, b) => {
                  if (!a.Duedate && !b.Duedate) return 0;
                  if (!a.Duedate) return 1;
                  if (!b.Duedate) return -1;
                  return (
                    new Date(a.Duedate).getTime() -
                    new Date(b.Duedate).getTime()
                  );
                });
              const displayTasks = pendingTasks.slice(0, 4);
              const remaining = pendingTasks.length - 4;

              return (
                <>
                  {displayTasks.length > 0 ? (
                    displayTasks.map((task) => {
                      const now = new Date();
                      const due = task.Duedate ? new Date(task.Duedate) : null;
                      const todayStart = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                      );

                      let dateLabel = "No date";
                      let dateColor = "#94a3b8";
                      let isOverdue = false;

                      if (due) {
                        const dueStart = new Date(
                          due.getFullYear(),
                          due.getMonth(),
                          due.getDate(),
                        );
                        const diffDays = Math.round(
                          (dueStart.getTime() - todayStart.getTime()) /
                          86400000,
                        );
                        const formatted = due.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });

                        if (diffDays < 0) {
                          dateLabel = `Overdue · ${formatted}`;
                          dateColor = "#dc2626";
                          isOverdue = true;
                        } else if (diffDays === 0) {
                          dateLabel = `Due Today · ${formatted}`;
                          dateColor = "#ea580c";
                        } else if (diffDays === 1) {
                          dateLabel = `Tomorrow · ${formatted}`;
                          dateColor = "#d97706";
                        } else if (diffDays <= 7) {
                          dateLabel = `${diffDays}d left · ${formatted}`;
                          dateColor = "#2563eb";
                        } else {
                          dateLabel = formatted;
                          dateColor = "#64748b";
                        }
                      }

                      const dotColor = isOverdue
                        ? "#ef4444"
                        : task.status === "in progress"
                          ? "#f59e0b"
                          : "#94a3b8";

                      return (
                        <Link
                          href={`/dashboard/projects/${task.projectId}`}
                          key={task._id}
                          className={`flex items-center gap-2.5 px-[18px] py-2.5 border-b border-slate-50 last:border-b-0 no-underline transition-all duration-120 hover:bg-slate-50 hover:shadow-[0_1px_4px_rgba(0,0,0,0.04)] group ${isOverdue ? "bg-red-50/70 border-l-[3px] border-l-red-300 hover:bg-red-50" : ""}`}
                        >
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: dotColor }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors m-0">
                              {task.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {isOverdue && (
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#dc2626"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            <span
                              className="text-xs font-semibold"
                              style={{ color: dateColor }}
                            >
                              {dateLabel}
                            </span>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="text-center p-6 text-sm text-slate-400">
                      🎉 No pending tasks
                    </div>
                  )}
                  {remaining > 0 && (
                    <div className="px-[18px] py-2.5 text-[13px] font-semibold text-blue-600 border-t border-slate-100 text-center">
                      +{remaining} more tasks
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        <div className="flex flex-col gap-3.5 min-h-0">
          <div className="bg-white border border-slate-200 rounded-[14px] flex flex-col overflow-hidden shrink-0 max-h-[200px]">
            <div className="px-[18px] py-3.5 border-b border-slate-50 flex items-center justify-between shrink-0">
              <span className="text-[15px] font-bold text-slate-900">
                Your Teams
              </span>
              <Link
                href="/dashboard/teams"
                className="text-[13px] font-semibold text-blue-600 no-underline hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {teamnames.length === 0 ? (
                <div className="text-center p-6 text-sm text-slate-400">
                  No teams yet
                </div>
              ) : (
                teamnames.map((team) => {
                  const palette = [
                    "#2563eb",
                    "#7c3aed",
                    "#0891b2",
                    "#059669",
                    "#d97706",
                    "#db2777",
                  ];
                  let h = 0;
                  for (const c of team._id)
                    h = c.charCodeAt(0) + ((h << 5) - h);
                  const color = palette[Math.abs(h) % palette.length];
                  return (
                    <Link
                      key={team._id}
                      href={`/dashboard/teams/${team._id}`}
                      className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-50 last:border-b-0 no-underline transition-colors duration-120 hover:bg-slate-50 group"
                    >
                      <div
                        className="w-9 h-9 rounded-[9px] flex items-center justify-center text-xs font-extrabold text-white shrink-0"
                        style={{ background: color }}
                      >
                        {team.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-slate-900 flex-1 truncate group-hover:text-blue-600 transition-colors">
                        {team.name}
                      </span>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0"
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[14px] flex flex-col overflow-hidden flex-1 min-h-0">
            <div className="px-[18px] py-3.5 border-b border-slate-50 flex items-center justify-between shrink-0">
              <span className="text-[15px] font-bold text-slate-900">
                Recent Activity
              </span>
              {activities && activities.length > 0 && (
                <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {activities.length}
                </span>
              )}
            </div>
            <div className="overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {activities && activities.length > 0 ? (
                [...activities]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .slice(0, 5)
                  .map((activity) => {
                    const actionLower = activity.action.toLowerCase();
                    let iconBg = "#f1f5f9",
                      iconColor = "#64748b";
                    let iconPath =
                      "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";

                    if (
                      actionLower.includes("created") ||
                      actionLower.includes("added")
                    ) {
                      iconBg = "#dcfce7";
                      iconColor = "#16a34a";
                      iconPath = "M12 4v16m8-8H4";
                    } else if (
                      actionLower.includes("completed") ||
                      actionLower.includes("done")
                    ) {
                      iconBg = "#dbeafe";
                      iconColor = "#2563eb";
                      iconPath =
                        "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
                    } else if (
                      actionLower.includes("updated") ||
                      actionLower.includes("changed") ||
                      actionLower.includes("moved")
                    ) {
                      iconBg = "#fef9c3";
                      iconColor = "#ca8a04";
                      iconPath =
                        "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z";
                    } else if (
                      actionLower.includes("deleted") ||
                      actionLower.includes("removed")
                    ) {
                      iconBg = "#fee2e2";
                      iconColor = "#dc2626";
                      iconPath =
                        "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16";
                    }

                    const initials =
                      `${activity.userId?.firstName?.[0] || ""}${activity.userId?.lastName?.[0] || ""}`.toUpperCase() ||
                      "??";

                    return (
                      <Link
                        href={`/dashboard/projects/${activity.projectId?._id}`}
                        key={activity._id}
                        className="flex items-start gap-2.5 px-4 py-2.5 border-b border-slate-50 last:border-b-0 no-underline transition-colors duration-120 hover:bg-slate-50"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-px"
                          style={{ background: iconBg }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={iconColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d={iconPath} />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-slate-500 leading-[1.45] m-0">
                            <strong className="text-slate-900 font-bold">
                              {activity.userName}
                            </strong>{" "}
                            <span>{activity.action}</span>
                          </p>
                          <div className="flex items-center gap-1.5 mt-[3px]">
                            <div
                              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                              style={{
                                background:
                                  "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                              }}
                            >
                              <span className="text-[7px] font-extrabold text-white">
                                {initials}
                              </span>
                            </div>
                            <span className="text-[11.5px] text-slate-400">
                              {getRelativeTime(activity.createdAt)}
                            </span>
                            <span className="text-slate-200 text-[11px]">
                              ·
                            </span>
                            <span className="text-[11.5px] text-slate-400">
                              {new Date(activity.createdAt).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })
              ) : (
                <div className="text-center p-6 text-sm text-slate-400">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-1.5"
                  >
                    <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No activity yet
                </div>
              )}
              {activities && activities.length > 5 && (
                <div className="px-[18px] py-2.5 text-[13px] font-semibold text-blue-600 border-t border-slate-100 text-center">
                  View all activity →
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateTeam isOpen={createTeam} setIsOpen={setcreateTeam} onSuccess={() => setRefreshKey(k => k + 1)} />
      <CreateProject isOpen={createProject} setIsOpen={setcreateProject} onSuccess={() => setRefreshKey(k => k + 1)} />
    </div>
  );
}
