"use client";

import CreateProject from "@/components/CreateProject";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  team: {
    _id:string,
    name:string
  }
  _id: string;
  name: string;
  description?: string;
  status?: "Active" | "In Progress" | "Done";
  progress?: number;
  taskCount: number;
  updatedAt: string;
  members: string[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createProject, setcreateProject] = useState<boolean>(false);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [totaltasks, settotaltasks] = useState<Record<string, number>>({});

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Done":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 text-slate-700 dark:text-slate-300 dark:text-slate-300";
    }
  };
  const dateformat = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  useEffect(() => {
    const fetchProjects = async () => {
      const [projectsRes, tasksRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/tasks"),
      ]);
      const data = await projectsRes.json();
      // console.log(data)
      const allTasks: Task[] = await tasksRes.json();
// console.log("data", data);
      const progressByProject: Record<string, number> = {};
      const ttaskbyproject: Record<string, number> = {};
      for (const project of data) {
        const projectTasks = allTasks.filter(
          (task: any) => task.project === project.name,
        );
        ttaskbyproject[project.name] = projectTasks.length;
        if (projectTasks.length > 0) {
          const completed = projectTasks.filter(
            (task: any) => task.status === "completed",
          ).length;
          progressByProject[project.name] = Math.round(
            (completed / projectTasks.length) * 100,
          );
        } else {
          progressByProject[project.name] = 0;
        }
      }
      settotaltasks(ttaskbyproject);
      setProgressMap(progressByProject);
      setProjects(data);
      setIsLoading(false);
    };
    fetchProjects();
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 p-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-4">
              <div className="h-8 w-48 skeleton"></div>
              <div className="h-4 w-64 skeleton"></div>
            </div>
            <div className="h-10 w-32 skeleton"></div>
          </div>
          <div className="space-y-4">
            <div className="h-32 w-full skeleton"></div>
            <div className="h-32 w-full skeleton"></div>
            <div className="h-32 w-full skeleton"></div>
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950 dark:bg-slate-950">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
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
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 dark:text-slate-50 mb-2">
              No projects yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 dark:text-slate-400 mb-6">
              Create your first project to get started
            </p>
            <button
              onClick={() => {
                setcreateProject(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              New Project
            </button>
          </div>
          <CreateProject isOpen={createProject} setIsOpen={setcreateProject} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:bg-slate-950">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 dark:text-slate-50 mb-2">Projects</h1>
            <p className="text-slate-600 dark:text-slate-400 dark:text-slate-400">Track and manage all your projects</p>
          </div>
          <button
            onClick={() => {
              setcreateProject(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + New Project
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm">
              All Projects
            </button>
            <button className="px-4 py-2 bg-white dark:bg-slate-900 dark:bg-slate-900 text-slate-600 dark:text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-700 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 transition-colors font-medium text-sm">
              By Team ▾
            </button>
          </div>
          <div className="flex gap-2 ml-auto">
            <span className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-400 self-center mr-2">
              Status:
            </span>
            <button className="px-3 py-1.5 bg-white dark:bg-slate-900 dark:bg-slate-900 text-slate-600 dark:text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-700 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 transition-colors text-sm">
              All
            </button>
            <button className="px-3 py-1.5 bg-white dark:bg-slate-900 dark:bg-slate-900 text-slate-600 dark:text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-700 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 transition-colors text-sm">
              Active
            </button>
            <button className="px-3 py-1.5 bg-white dark:bg-slate-900 dark:bg-slate-900 text-slate-600 dark:text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-700 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 transition-colors text-sm">
              Completed
            </button>
          </div>
          <CreateProject isOpen={createProject} setIsOpen={setcreateProject} />
        </div>
        {/* Projects List */}
        <div className="space-y-4">
          {projects.map((project) => (
            <Link
              key={project.name}
              href={`/dashboard/projects/${project._id}`}
              className="block"
            >
              <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 dark:text-slate-50">
                        {project.name}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          project.status,
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-400">
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
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm">
                    Open →
                  </button>
                </div>

                <div className="flex items-center gap-6 mb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-400">
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
                    <span>{totaltasks[project.name]} tasks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-400">
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
                    <span>Updated {dateformat(project.updatedAt)}</span>
                  </div>
                  {/* <div className="flex -space-x-2 ml-auto">
                                        {project.members.map((member, idx) => (
                                            <div
                                                key={idx}
                                                className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                                            >
                                                {member}
                                            </div>
                                        ))}
                                    </div> */}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400 dark:text-slate-400">Progress</span>
                    <span className="font-medium text-slate-900 dark:text-slate-50 dark:text-slate-50">
                      {progressMap[project.name] ?? 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${progressMap[project.name] ?? 0}%`,
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
