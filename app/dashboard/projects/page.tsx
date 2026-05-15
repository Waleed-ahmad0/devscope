"use client";

import CreateProject from "@/components/CreateProject";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

interface Task {
  _id?: string;
  title: string;
  description: string;
  status: "pending" | "in progress" | "completed";
  projectid: string;
  createdby: string;
  Duedate: Date;
}

interface Project {
  team: { _id: string; name: string };
  _id: string;
  name: string;
  description?: string;
  status?: "Active" | "Done";
  progress?: number;
  taskCount: number;
  updatedAt: string;
  members: string[];
}

/* ── helpers ── */
function projectColor(id: string) {
  const palette = [
    "#2563eb",
    "#7c3aed",
    "#0891b2",
    "#059669",
    "#d97706",
    "#dc2626",
    "#db2777",
  ];
  let hash = 0;
  for (const c of id) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

function projectInitials(name: string) {
  return (
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "P"
  );
}

function dateformat(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusMeta(status?: Project["status"]) {
  switch (status) {
    case "Active":
      return {
        label: "Active",
        bg: "#dbeafe",
        color: "#1d4ed8",
        dot: "#3b82f6",
      };
    case "Done":
      return { label: "Done", bg: "#dcfce7", color: "#166534", dot: "#22c55e" };
    default:
      return {
        label: "No Status",
        bg: "#f1f5f9",
        color: "#475569",
        dot: "#94a3b8",
      };
  }
}

/* ── Skeleton ── */
function SkeletonRow() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: 14,
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={shimmer(44, 44, "12px")} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={shimmer(180, 16, "6px")} />
            <div style={shimmer(110, 12, "6px")} />
          </div>
        </div>
        <div style={shimmer(70, 32, "8px")} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={shimmer(80, 13, "6px")} />
        <div style={shimmer(140, 13, "6px")} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={shimmer(60, 12, "6px")} />
          <div style={shimmer(32, 12, "6px")} />
        </div>
        <div
          style={{
            height: 7,
            borderRadius: 999,
            background: "#e2e8f0",
            overflow: "hidden",
          }}
        >
          <div style={{ ...shimmer("45%", 7, "999px"), height: 7 }} />
        </div>
      </div>
    </div>
  );
}

function shimmer(
  w: number | string,
  h: number,
  radius: string = "6px",
): React.CSSProperties {
  return {
    width: typeof w === "number" ? w : w,
    height: h,
    borderRadius: radius,
    background: "linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)",
    backgroundSize: "200% 100%",
    animation: "pp-shimmer 1.4s ease infinite",
    flexShrink: 0,
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [createProject, setcreateProject] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [totaltasks, settotaltasks] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, seterror] = useState(false);

  /* filter state */
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Done">(
    "All",
  );
  const [teamFilter, setTeamFilter] = useState<string>("All");
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/tasks"),
        ]);
        const data: Project[] = await projectsRes.json();
        const allTasks: Task[] = await tasksRes.json();

        const progressByProject: Record<string, number> = {};
        const ttaskbyproject: Record<string, number> = {};
        for (const project of data) {
          const projectTasks = allTasks.filter(
            (task: any) => task.project === project.name,
          );
          ttaskbyproject[project.name] = projectTasks.length;
          progressByProject[project.name] =
            projectTasks.length > 0
              ? Math.round(
                  (projectTasks.filter((t: any) => t.status === "completed")
                    .length /
                    projectTasks.length) *
                    100,
                )
              : 0;
        }
        settotaltasks(ttaskbyproject);
        setProgressMap(progressByProject);
        setProjects(data);
        setLoading(false);
      } catch (error) {
        seterror(true);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  /* unique teams for dropdown */
  const uniqueTeams = useMemo(() => {
    const names = Array.from(
      new Set(projects.map((p) => p.team?.name).filter(Boolean)),
    );
    return names;
  }, [projects]);

  /* filtered projects */
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      const matchTeam = teamFilter === "All" || p.team?.name === teamFilter;
      return matchStatus && matchTeam;
    });
  }, [projects, statusFilter, teamFilter]);

  if (loading) {
    return (
      <div className="font-['Plus_Jakarta_Sans',sans-serif] bg-slate-50 min-h-screen py-9 px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div className="flex flex-col gap-2.5">
              <div style={shimmer(160, 32, "8px")} />
              <div style={shimmer(220, 16, "6px")} />
            </div>
            <div style={shimmer(130, 42, "10px")} />
          </div>
          {/* filter bar skeleton */}
          <div className="flex gap-2.5 mb-6">
            {[120, 100, 80, 80, 80].map((w, i) => (
              <div key={i} style={shimmer(w, 38, "9px")} />
            ))}
          </div>
          <div className="flex flex-col gap-3.5">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonRow key={i} />
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
            Failed to load projects
          </h2>
          <p className="text-sm text-slate-500 mb-1 leading-relaxed">
            We couldn&apos;t fetch your project data. This might be a
            temporary issue.
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                seterror(false);
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
  /* ── EMPTY STATE ── */
  if (projects.length === 0 && !error) {
    return (
      <>
        <div className="font-['Plus_Jakarta_Sans',sans-serif] bg-slate-50 min-h-screen py-9 px-6">
          <div className="max-w-[1000px] mx-auto animate-[pp-in_0.3s_ease]">
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-white border border-slate-200 rounded-2xl text-center">
              <div className="w-[72px] h-[72px] bg-blue-50 rounded-full flex items-center justify-center mb-5">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                No projects yet
              </h2>
              <p className="text-sm text-slate-500 mb-7">
                Create your first project to get started
              </p>
              <button
                className="inline-flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-white bg-gradient-to-br from-blue-600 to-blue-700 border-none rounded-lg py-2.5 px-5 cursor-pointer shadow-[0_2px_10px_rgba(37,99,235,0.3)] transition-all duration-150 hover:from-blue-700 hover:to-blue-800 hover:shadow-[0_4px_16px_rgba(37,99,235,0.38)] hover:-translate-y-px"
                onClick={() => setcreateProject(true)}
              >
                <svg
                  width="16"
                  height="16"
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
          </div>
          <CreateProject isOpen={createProject} setIsOpen={setcreateProject} />
        </div>
      </>
    );
  }

  /* ── MAIN ── */
  return (
    <>
      <div
        className="font-['Plus_Jakarta_Sans',sans-serif] bg-slate-50 min-h-screen py-9 px-6"
        onClick={() => setTeamDropdownOpen(false)}
      >
        <div className="max-w-[1000px] mx-auto animate-[pp-in_0.3s_ease]">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4 mb-7 flex-wrap">
            <div>
              <h1 className="text-[28px] font-extrabold text-slate-900 m-0 mb-1 tracking-tight">
                Projects
                {projects.length > 0 && (
                  <span className="inline-flex items-center text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full py-0.5 px-2.5 ml-2.5 align-middle">
                    {projects.length}
                  </span>
                )}
              </h1>
              <p className="text-sm text-slate-500 m-0">
                Track and manage all your projects
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-white bg-gradient-to-br from-blue-600 to-blue-700 border-none rounded-lg py-2.5 px-5 cursor-pointer shadow-[0_2px_10px_rgba(37,99,235,0.3)] transition-all duration-150 hover:from-blue-700 hover:to-blue-800 hover:shadow-[0_4px_16px_rgba(37,99,235,0.38)] hover:-translate-y-px"
              onClick={() => setcreateProject(true)}
            >
              <svg
                width="16"
                height="16"
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

          {/* FILTER BAR */}
          <div className="flex items-center gap-2.5 mb-5 flex-wrap">
            {/* status pills */}
            <div className="flex gap-1.5 flex-wrap">
              {(["All", "Active", "Done"] as const).map((s) => (
                <button
                  key={s}
                  className={`inline-flex items-center gap-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-semibold text-slate-600 bg-white border-[1.5px] border-slate-200 rounded-lg py-1.5 px-3.5 cursor-pointer transition-all duration-150 whitespace-nowrap hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 ${statusFilter === s ? "bg-blue-50 border-blue-500 text-blue-700" : ""}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s !== "All" && (
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: statusMeta(s as Project["status"]).dot,
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {s}
                </button>
              ))}
            </div>

            {/* team dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className={`inline-flex items-center gap-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-semibold text-slate-600 bg-white border-[1.5px] border-slate-200 rounded-lg py-1.5 px-3.5 cursor-pointer transition-all duration-150 whitespace-nowrap hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 ${teamFilter !== "All" ? "bg-blue-50 border-blue-500 text-blue-700" : ""}`}
                onClick={() => setTeamDropdownOpen((o) => !o)}
              >
                <svg
                  width="13"
                  height="13"
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
                {teamFilter === "All" ? "By Team" : teamFilter}
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-0.5 transition-transform duration-150"
                  style={{
                    transform: teamDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {teamDropdownOpen && (
                <div className="absolute top-full left-0 min-w-[180px] bg-white border-[1.5px] border-slate-200 rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.1)] z-[100] overflow-hidden animate-[pp-in_0.15s_ease]">
                  {["All", ...uniqueTeams].map((t) => (
                    <button
                      key={t}
                      className={`flex items-center justify-between w-full font-['Plus_Jakarta_Sans',sans-serif] text-[13.5px] font-medium text-slate-700 bg-transparent border-none py-2.5 px-3.5 cursor-pointer transition-colors duration-150 text-left hover:bg-slate-50 ${teamFilter === t ? "text-blue-600 font-bold bg-blue-50" : ""}`}
                      onClick={() => {
                        setTeamFilter(t);
                        setTeamDropdownOpen(false);
                      }}
                    >
                      {t === "All" ? "All Teams" : t}
                      {teamFilter === t && (
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* result count */}
            {(statusFilter !== "All" || teamFilter !== "All") && (
              <span className="text-[12.5px] text-slate-500 flex items-center gap-2 ml-1">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                <button
                  className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-red-600 bg-transparent border-none cursor-pointer p-0 hover:underline"
                  onClick={() => {
                    setStatusFilter("All");
                    setTeamFilter("All");
                  }}
                >
                  Clear ×
                </button>
              </span>
            )}
          </div>

          {/* NO RESULTS */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2.5 py-16 text-slate-400">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <p className="text-sm m-0">No projects match your filters.</p>
              <button
                className="font-['Plus_Jakarta_Sans',sans-serif] text-[13.5px] font-semibold text-blue-600 bg-transparent border-none cursor-pointer underline p-0"
                onClick={() => {
                  setStatusFilter("All");
                  setTeamFilter("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* PROJECT LIST */}
          <div className="flex flex-col gap-3.5">
            {filtered.map((project) => {
              const color = projectColor(project._id);
              const sm = statusMeta(project.status);
              const prog = progressMap[project.name] ?? 0;
              const tasks = totaltasks[project.name] ?? 0;

              return (
                <Link
                  key={project._id}
                  href={`/dashboard/projects/${project._id}`}
                  className="block no-underline"
                >
                  <div
                    className="bg-white border-[1.5px] border-slate-200 rounded-xl p-5 cursor-pointer transition-all duration-200 ease relative overflow-hidden hover:border-blue-200 hover:shadow-[0_6px_24px_rgba(37,99,235,0.1)] hover:-translate-y-px"
                    style={{ "--pc": color } as React.CSSProperties}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--pc,#2563eb)] opacity-0 transition-opacity duration-200 hover:opacity-100" />

                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0 tracking-tight"
                          style={{ background: color }}
                        >
                          {projectInitials(project.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                            <h3 className="text-[15.5px] font-bold text-slate-900 m-0 whitespace-nowrap overflow-hidden text-ellipsis">
                              {project.name}
                            </h3>
                            <span
                              className="inline-flex items-center gap-1.5 text-[11.5px] font-bold rounded-full py-0.5 px-2.5 whitespace-nowrap"
                              style={{ background: sm.bg, color: sm.color }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: sm.dot,
                                  display: "inline-block",
                                  flexShrink: 0,
                                }}
                              />
                              {sm.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                              </svg>
                              {project.team?.name ?? "No team"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              {tasks} {tasks === 1 ? "task" : "tasks"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              Updated {dateformat(project.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* right: open arrow */}
                      <div className="flex items-center justify-center w-[34px] h-[34px] rounded-lg border-[1.5px] border-slate-200 text-slate-400 flex-shrink-0 transition-all duration-[0.15s] group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* progress */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-400">
                          Progress
                        </span>
                        <span className="text-xs font-bold" style={{ color }}>
                          {prog}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${prog}%`, background: color }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <CreateProject isOpen={createProject} setIsOpen={setcreateProject} />
    </>
  );
}
