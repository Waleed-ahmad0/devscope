"use client";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
interface Members {
  user: string;
  role: string;
  _id: string;
  userName: string;
}
interface Team {
  _id: string;
  name: string;
  ownerId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  members: Members[];
}

interface ProjectDetail {
  id?: string;
  name: string;
  description?: string;
  team: Team;
  status: "Active" | "In Progress" | "Done";
  createdAt?: string;
}

interface Task {
  _id?: string;
  title: string;
  description: string;
  status: "pending" | "in progress" | "completed";
  projectid: string;
  createdby: string;
  Duedate: Date;
  assignedTo?: string;
  assignedUser?: string;
  createdAt?: string;
}

interface Activity {
  _id: string;
  userName: string;
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  teamId: string;
  projectId: string;
  action: string;
  createdAt: string;
  taskId?: string;
}

type TabType = "overview" | "tasks" | "activity" | "settings";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = useSession();
  const id: string = decodeURIComponent(use(params).id);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [project, setproject] = useState<ProjectDetail | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [progress, setprogress] = useState<number>(0);
  const [refresh, setrefresh] = useState<boolean>(false);
  const [tasks, settasks] = useState<Task[]>([]);
  const [projectName, setProjectName] = useState("");
  const [projectStatus, setProjectStatus] = useState<string>("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "pending" as "pending" | "in progress" | "completed",
    projectid: id,
    Duedate: "",
    assignedTo: "",
  });
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortOption, setSortOption] = useState<string>("due-date-asc");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== "activity") return;
    const fetchActivities = async () => {
      setActivitiesLoading(true);
      try {
        const res = await fetch(`/api/activity?projectId=${id}`);
        const data = await res.json();
        setActivities(data.getactivity || []);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchActivities();
  }, [activeTab, id, refresh]);

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
  const changeprojetdata = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (projectName === "") {
      }
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName, status: projectStatus }),
      });
      const updated = await res.json();
      setrefresh((prev) => !prev);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };
  const getActivityIcon = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes("created") || lower.includes("added")) {
      return {
        bg: "bg-emerald-100",
        color: "text-emerald-600",
        path: "M12 4v16m8-8H4",
      };
    }
    if (lower.includes("completed") || lower.includes("done")) {
      return {
        bg: "bg-green-100",
        color: "text-green-600",
        path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      };
    }
    if (
      lower.includes("updated") ||
      lower.includes("changed") ||
      lower.includes("moved")
    ) {
      return {
        bg: "bg-blue-100",
        color: "text-blue-600",
        path: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
      };
    }
    if (lower.includes("deleted") || lower.includes("removed")) {
      return {
        bg: "bg-red-100",
        color: "text-red-600",
        path: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
      };
    }
    if (lower.includes("assigned")) {
      return {
        bg: "bg-purple-100",
        color: "text-purple-600",
        path: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      };
    }
    // Default
    return {
      bg: "bg-slate-100",
      color: "text-slate-600",
      path: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    };
  };

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
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

  useEffect(() => {
    if (project === null && !projectLoading) {
      setIsNotFound(true);
    }
  }, [project, projectLoading]);

  const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (taskForm.assignedTo === "") {
        const { assignedTo, ...rest } = taskForm;

        setShowTaskForm(false);
      } else {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...taskForm,
            projectId: id,
          }),
        });
        const created = await res.json();
        setrefresh((prev) => !prev);
        setTaskForm({
          title: "",
          description: "",
          status: "pending",
          projectid: id,
          Duedate: "",
          assignedTo: "",
        });
        setShowTaskForm(false);
      }
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const deleteproject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      const deleted = await res.json();
      // setrefresh((prev) => !prev);

      router.replace("/dashboard/projects");
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };
  useEffect(() => {
    const getprojects = async () => {
      setProjectLoading(true);
      try {
        const request = await fetch(`/api/projects/${id}`);
        const gettasks = await fetch(`/api/tasks/${id}`);
        if (!request.ok) {
          setproject(null);
          return;
        }
        const response = await request.json();
        const tasksData = await gettasks.json();
        const comptask = tasksData.filter((item: any) => item.status === "completed");
        setprogress((comptask.length / (tasksData.length || 1)) * 100);
        settasks(tasksData);
        setproject(response.data);
        setProjectName(response.data.name);
        setProjectStatus(response.data.status);
      } catch (err) {
        setproject(null);
      } finally {
        setProjectLoading(false);
      }
    };
    getprojects();
  }, [id, refresh]);

  if (isNotFound) {
    notFound();
  }
  const deleteteam = async () => {};
  const handleStatusChange = async (
    taskId: string,
    newStatus: "pending" | "in progress" | "completed",
    title: string,
  ) => {
    // Optimistic update
    const previousTasks = [...tasks];
    settasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      const res = await fetch("/api/tasks/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          taskId,
          status: newStatus,
          projectId: id,
          teamId: project?.team._id,
        }),
      });
      const updateprojecttime = await fetch(`/api/projects`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time: new Date(), id: id }),
      });
      setrefresh((prev) => !prev);
      if (!res.ok) throw new Error("Failed to update status");
    } catch (err) {
      console.error("Failed to update task status:", err);
      settasks(previousTasks);
    }
  };

  const getDueDateInfo = (
    dueDate: Date | undefined | null,
    status: Task["status"],
  ) => {
    if (!dueDate)
      return {
        label: "",
        rawDate: "No date",
        color: "text-slate-400",
        isOverdue: false,
      };

    const now = new Date();
    const due = new Date(dueDate);
    const formattedDate = due.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    // Normalize to start of day for comparison
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const diffMs = dueStart.getTime() - todayStart.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    // Completed tasks don't get overdue styling
    if (status === "completed") {
      return {
        label: "",
        rawDate: formattedDate,
        color: "text-emerald-500",
        isOverdue: false,
      };
    }

    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return {
        label:
          overdueDays === 1
            ? "Overdue by 1 day"
            : `Overdue by ${overdueDays} days`,
        rawDate: formattedDate,
        color: "text-red-600",
        isOverdue: true,
      };
    }
    if (diffDays === 0)
      return {
        label: "Due Today",
        rawDate: formattedDate,
        color: "text-orange-600",
        isOverdue: false,
      };
    if (diffDays === 1)
      return {
        label: "Due Tomorrow",
        rawDate: formattedDate,
        color: "text-amber-600",
        isOverdue: false,
      };
    if (diffDays <= 7)
      return {
        label: `${diffDays} days left`,
        rawDate: formattedDate,
        color: "text-blue-600",
        isOverdue: false,
      };

    return {
      label: "",
      rawDate: formattedDate,
      color: "text-slate-500",
      isOverdue: false,
    };
  };

  const renderTaskCard = (task: Task) => {
    const statusColors: Record<Task["status"], string> = {
      pending: "bg-slate-100 text-slate-700",
      "in progress": "bg-amber-100 text-amber-700",
      completed: "bg-emerald-100 text-emerald-700",
    };
    const statusLabels: Record<Task["status"], string> = {
      pending: "To Do",
      "in progress": "In Progress",
      completed: "Done",
    };

    const dueDateInfo = getDueDateInfo(task.Duedate, task.status);

    return (
      <div
        key={task._id}
        draggable
        onDragStart={(e) => {
          setDraggedTaskId(task._id || null);
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", task._id || "");
        }}
        onDragEnd={() => {
          setDraggedTaskId(null);
          setDragOverColumn(null);
        }}
        className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing ${
          draggedTaskId === task._id
            ? "opacity-40 scale-[0.97] shadow-lg ring-2 ring-blue-400"
            : ""
        } ${
          dueDateInfo.isOverdue
            ? "border-red-300 border-l-4 border-l-red-500 bg-red-50/30"
            : "border-slate-200"
        }`}
      >
        {/* Status badge + Overdue badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[task.status]}`}
          >
            {statusLabels[task.status]}
          </span>
          {dueDateInfo.isOverdue && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Overdue
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="font-semibold text-slate-900 text-sm leading-snug mb-3">
          {task.title}
        </h4>

        {/* Description preview */}
        {task.description && (
          <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
          <span
            className={`flex items-center gap-1 font-medium ${dueDateInfo.color}`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {dueDateInfo.label
              ? `${dueDateInfo.label} · ${dueDateInfo.rawDate}`
              : dueDateInfo.rawDate}
          </span>
          <div>{task.assignedUser ? task.assignedUser : "open"}</div>
          <span className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {task.createdby || "Unassigned"}
          </span>
        </div>
        {/* Divider */}
        <div className="border-t border-slate-100 pt-3">
          <select
            value={task.status}
            onChange={(e) =>
              handleStatusChange(
                task._id!,
                e.target.value as "pending" | "in progress" | "completed",
                task.title,
              )
            }
            className={` w-full px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-slate-100 transition-colors`}
          >
            <option value="pending">📋 Move to To Do</option>
            <option value="in progress">🔄 Move to In Progress</option>
            <option value="completed">✅ Move to Done</option>
          </select>
        </div>
      </div>
    );
  };

  const renderEmptyColumn = () => (
    <div className="flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-xl text-center">
      <svg
        className="w-10 h-10 text-slate-300 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p className="text-sm font-medium text-slate-400">No tasks yet</p>
      <p className="text-xs text-slate-300 mt-1">Tasks will appear here</p>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview": {
        if (!project) return <div>project not found</div>;
        else {
          return (
            <div className="space-y-6 ">
              {/* Description Card */}
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium text-slate-600 mb-2">
                  Description
                </h3>
                <p className="text-slate-900">
                  {project.description || "No description provided."}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    Created on{" "}
                    {project.createdAt
                      ? new Date(project.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" },
                        )
                      : "Unknown"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Progress Card */}
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-slate-600">
                      Progress
                    </h3>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {(progress || 0).toFixed(1)}%
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Total Tasks Card */}
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-slate-600">
                      Total Tasks
                    </h3>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {tasks.length}
                  </div>
                </div>

                {/* Completed Tasks Card */}
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-slate-600">
                      Completed
                    </h3>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {completedTasks}
                  </div>
                </div>

                {/* Team Card */}
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-slate-600">Team</h3>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {project.team.name}
                  </div>
                </div>
              </div>
            </div>
          );
        }
      }
      case "tasks": {
        const sortTasks = (taskList: Task[]) => {
          const sorted = [...taskList];
          switch (sortOption) {
            case "due-date-asc":
              return sorted.sort((a, b) => {
                if (!a.Duedate && !b.Duedate) return 0;
                if (!a.Duedate) return 1;
                if (!b.Duedate) return -1;
                return (
                  new Date(a.Duedate).getTime() - new Date(b.Duedate).getTime()
                );
              });
            case "due-date-desc":
              return sorted.sort((a, b) => {
                if (!a.Duedate && !b.Duedate) return 0;
                if (!a.Duedate) return 1;
                if (!b.Duedate) return -1;
                return (
                  new Date(b.Duedate).getTime() - new Date(a.Duedate).getTime()
                );
              });
            case "newest":
              return sorted.sort((a, b) => {
                if (!a.createdAt && !b.createdAt) return 0;
                if (!a.createdAt) return 1;
                if (!b.createdAt) return -1;
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              });
            case "oldest":
              return sorted.sort((a, b) => {
                if (!a.createdAt && !b.createdAt) return 0;
                if (!a.createdAt) return 1;
                if (!b.createdAt) return -1;
                return (
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
                );
              });
            case "alphabetical":
              return sorted.sort((a, b) => a.title.localeCompare(b.title));
            default:
              return sorted;
          }
        };

        const pendingTasks = sortTasks(
          tasks.filter((t) => t.status === "pending"),
        );
        const inProgressTasks = sortTasks(
          tasks.filter((t) => t.status === "in progress"),
        );
        const completedTasks = sortTasks(
          tasks.filter((t) => t.status === "completed"),
        );

        const columnConfig = [
          {
            key: "pending",
            statusValue: "pending" as "pending" | "in progress" | "completed",
            label: "To Do",
            tasks: pendingTasks,
            dotColor: "bg-slate-400",
            headerBg: "bg-slate-50",
            dropHighlight: "bg-slate-100/80 border-slate-400",
          },
          {
            key: "in-progress",
            statusValue: "in progress" as
              | "pending"
              | "in progress"
              | "completed",
            label: "In Progress",
            tasks: inProgressTasks,
            dotColor: "bg-amber-400",
            headerBg: "bg-amber-50",
            dropHighlight: "bg-amber-50/80 border-amber-400",
          },
          {
            key: "completed",
            statusValue: "completed" as "pending" | "in progress" | "completed",
            label: "Done",
            tasks: completedTasks,
            dotColor: "bg-emerald-400",
            headerBg: "bg-emerald-50",
            dropHighlight: "bg-emerald-50/80 border-emerald-400",
          },
        ];

        return (
          <div className="space-y-6">
            {/* Filter Bar & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 hover:border-slate-300 transition-colors">
                  <svg
                    className="w-4 h-4 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                    />
                  </svg>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="text-sm font-medium text-slate-700 bg-transparent border-none focus:outline-none cursor-pointer pr-6 appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 0 center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.25rem",
                    }}
                  >
                    <option value="due-date-asc">Due Date (Earliest)</option>
                    <option value="due-date-desc">Due Date (Latest)</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="alphabetical">Alphabetical (A–Z)</option>
                  </select>
                </div>

                {/* Task Count Badges */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {tasks.length} total
                  </span>
                  <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                    {tasks.filter((t) => t.status === "in progress").length}{" "}
                    active
                  </span>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                    {tasks.filter((t) => t.status === "completed").length} done
                  </span>
                </div>
              </div>

              {/* Drag hint + New Task button */}
              <div className="flex items-center gap-3">
                <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                  Drag cards to move
                </span>
                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-sm"
                >
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
                      d={
                        showTaskForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"
                      }
                    />
                  </svg>
                  {showTaskForm ? "Cancel" : "New Task"}
                </button>
              </div>
            </div>

            {/* Task Creation Form */}
            {showTaskForm && (
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Create New Task
                </h3>
                <form onSubmit={handleTaskSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={taskForm.title}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, title: e.target.value })
                      }
                      placeholder="Enter task title"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      value={taskForm.description}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter task description"
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Assign To
                    </label>
                    <select
                      name="assign"
                      id="assign"
                      value={taskForm.assignedTo}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, assignedTo: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Open Tasks</option>
                      <option value={project?.team.ownerId._id}>
                        {project?.team.ownerId.firstName}{" "}
                        {project?.team.ownerId.lastName} (Admin)
                      </option>
                      {project?.team.members.map((member) => (
                        <option value={member.user} key={member._id}>
                          {member.userName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={taskForm.Duedate}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, Duedate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Status
                    </label>
                    <select
                      value={taskForm.status}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          status: e.target.value as
                            | "pending"
                            | "in progress"
                            | "completed",
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Creating..." : "Create Task"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {columnConfig.map((col) => (
                <div
                  key={col.key}
                  className={`bg-slate-50/80 rounded-xl border min-h-[400px] flex flex-col transition-colors duration-200 ${
                    dragOverColumn === col.statusValue
                      ? col.dropHighlight
                      : "border-slate-200"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverColumn(col.statusValue);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setDragOverColumn(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverColumn(null);
                    const taskId = e.dataTransfer.getData("text/plain");
                    if (taskId && draggedTaskId === taskId) {
                      // Check if status is actually changing to avoid unnecessary requests
                      const task = tasks.find((t) => t._id === taskId);
                      if (task && task.status !== col.statusValue) {
                        handleStatusChange(taskId, col.statusValue, task.title);
                      }
                    }
                  }}
                >
                  {/* Column Header */}
                  <div
                    className={`px-4 py-3 rounded-t-xl ${col.headerBg} border-b border-slate-200`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`}
                        ></div>
                        <h3 className="text-sm font-semibold text-slate-700">
                          {col.label}
                        </h3>
                      </div>
                      <span className="text-xs font-bold bg-white text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                        {col.tasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="p-3 flex-1 flex flex-col gap-3">
                    {col.tasks.length === 0
                      ? renderEmptyColumn()
                      : col.tasks.map((task) => renderTaskCard(task))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "activity": {
        // Sort activities newest first
        const sortedActivities = [...activities].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        // Group activities by date
        const getDateGroup = (dateStr: string) => {
          const date = new Date(dateStr);
          const now = new Date();
          const todayStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          const yesterdayStart = new Date(todayStart.getTime() - 86400000);
          const actDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
          );

          if (actDate.getTime() === todayStart.getTime()) return "Today";
          if (actDate.getTime() === yesterdayStart.getTime())
            return "Yesterday";
          return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          });
        };

        const groupedActivities: { label: string; items: Activity[] }[] = [];
        sortedActivities.forEach((act) => {
          const group = getDateGroup(act.createdAt);
          const existing = groupedActivities.find((g) => g.label === group);
          if (existing) existing.items.push(act);
          else groupedActivities.push({ label: group, items: [act] });
        });

        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-700">
                  Activity Feed
                </h3>
                {!activitiesLoading && activities.length > 0 && (
                  <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {activities.length}{" "}
                    {activities.length === 1 ? "event" : "events"}
                  </span>
                )}
              </div>
            </div>

            {activitiesLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 border-2 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    Loading activity...
                  </p>
                </div>
              </div>
            ) : activities.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <svg
                      className="w-8 h-8 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-600">
                    No activity yet
                  </p>
                  <p className="text-xs text-slate-400 mt-1.5 max-w-[240px]">
                    When you create tasks, change statuses, or update this
                    project, the history will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {groupedActivities.map((group) => (
                  <div key={group.label}>
                    {/* Date group header */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {group.label}
                      </span>
                      <div className="flex-1 h-px bg-slate-200"></div>
                      <span className="text-xs text-slate-400">
                        {group.items.length}{" "}
                        {group.items.length === 1 ? "event" : "events"}
                      </span>
                    </div>

                    {/* Activity cards */}
                    <div className="space-y-2">
                      {group.items.map((act) => {
                        const timeAgo = getRelativeTime(act.createdAt);
                        const fullTime = new Date(
                          act.createdAt,
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        });
                        const fullDate = new Date(
                          act.createdAt,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                        
                        const iconInfo = getActivityIcon(act.action);

                        return (
                          <div
                            key={act._id}
                            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all duration-200 group"
                          >
                            <div className="flex items-start gap-3">
                              {/* Icon */}
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconInfo.bg}`}
                              >
                                <svg
                                  className={`w-4 h-4 ${iconInfo.color}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d={iconInfo.path}
                                  />
                                </svg>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-sm text-slate-800 leading-snug">
                                      <span className="font-semibold text-slate-900">
                                        {act.userName}
                                      </span>{" "}
                                      <span className="text-slate-600">
                                        {act.action}
                                      </span>
                                    </p>
                                  </div>
                                  {/* Avatar */}
                                  {act?.userName && <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">
                                    {act.userName[0].toUpperCase()}
                                  </div>}
                                </div>
                                {/* Timestamp */}
                                <div className="flex items-center gap-1.5 mt-1.5">
                                  <svg
                                    className="w-3 h-3 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="text-xs text-slate-500">
                                    {timeAgo}
                                  </span>
                                  <span className="text-slate-300">·</span>
                                  <span className="text-xs text-slate-400">
                                    {fullTime} · {fullDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case "settings": {
        if (!project) return <div>Loading...</div>;
        else {
          return (
            <div className="space-y-6">
              {/* Project Settings */}
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Project Settings
                </h3>
                <div className="space-y-4">
                  <form onSubmit={changeprojetdata}>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        placeholder={project.name}
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Status
                      </label>
                      <select
                        value={projectStatus}
                        onChange={(e) => setProjectStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </form>
                  <button
                    onClick={changeprojetdata}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white p-6 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-600 mb-2">
                  Danger Zone
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Once you delete a project, there is no going back. Please be
                  certain.
                </p>
                <button
                  onClick={deleteproject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Project
                </button>
              </div>
            </div>
          );
        }
      }
    }
  };

  function SkeletonBox({ w = "100%", h = "16px", radius = "6px" }: { w?: string; h?: string; radius?: string }) {
    return (
      <div
        className="animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
        style={{ width: w, height: h, borderRadius: radius }}
      />
    );
  }

  if (projectLoading) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <SkeletonBox w="300px" h="36px" radius="8px" />
              <SkeletonBox w="80px" h="28px" radius="999px" />
            </div>
            <div className="flex items-center gap-2">
              <SkeletonBox w="150px" h="16px" radius="4px" />
            </div>
          </div>
          <div className="mb-8 border-b border-slate-200 flex gap-8">
            {[0, 1, 2, 3].map(i => <SkeletonBox key={i} w="80px" h="30px" radius="4px" />)}
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <SkeletonBox w="100px" h="20px" radius="4px" />
              <div className="mt-4 space-y-2">
                <SkeletonBox h="14px" />
                <SkeletonBox w="80%" h="14px" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <SkeletonBox w="40px" h="40px" radius="8px" />
                    <SkeletonBox w="80px" h="16px" radius="4px" />
                  </div>
                  <SkeletonBox w="60px" h="36px" radius="6px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
          <p className="text-slate-500 mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
          <button onClick={() => router.push('/dashboard/projects')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Go back to projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen animate-fade-in-up">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        {project !== null && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {project.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
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
              <span>Team: {project.team.name}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-8">
            {(
              (project?.team.ownerId._id === session?.user?.id
                ? ["overview", "tasks", "activity", "settings"]
                : ["overview", "tasks", "activity"]) as TabType[]
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 font-medium transition-colors relative capitalize ${
                  activeTab === tab
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
