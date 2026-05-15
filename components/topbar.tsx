"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  type: "project" | "team" | "task";
  id: string;
  title: string;
  subtitle?: string;
  url: string;
}

export default function Topbar() {
  const router = useRouter();
    const { data: session } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<{ projects: any[], teams: any[], tasks: any[] } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setIsFocused(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data on focus
  const handleFocus = async () => {
    setIsFocused(true);
    if (!allData && session?.user && (session.user as any).id) {
      setLoading(true);
      try {
        const userId = (session.user as any).id;
        const res = await fetch(`/api/activity?userId=${userId}`);
        const data = await res.json();
        setAllData({
          projects: data.totalProjects || [],
          teams: data.allTeams || data.teamNames || [],
          tasks: data.totaltaskforproject || data.totaltasks || []
        });
      } catch (error) {
        console.error("Failed to fetch search data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Perform search
  useEffect(() => {
    if (!allData || !searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const newResults: SearchResult[] = [];

    allData.projects.forEach(p => {
      if (p.name?.toLowerCase()?.includes(query) || p.description?.toLowerCase()?.includes(query)) {
        newResults.push({
          type: "project",
          id: p._id,
          title: p.name || "Untitled Project",
          subtitle: p.description?.substring(0, 50),
          url: `/dashboard/projects/${p._id}`
        });
      }
    });

    allData.teams.forEach(t => {
      if (t.name?.toLowerCase()?.includes(query)) {
        newResults.push({
          type: "team",
          id: t._id,
          title: t.name || "Untitled Team",
          subtitle: "Team",
          url: `/dashboard/teams/${t._id}`
        });
      }
    });

    allData.tasks.forEach(t => {
      if (t.title?.toLowerCase()?.includes(query) || t.description?.toLowerCase()?.includes(query)) {
        newResults.push({
          type: "task",
          id: t._id,
          title: t.title || "Untitled Task",
          subtitle: t.status,
          url: `/dashboard/projects/${t.projectId}`
        });
      }
    });

    setResults(newResults.slice(0, 10));
  }, [searchQuery, allData]);

  const userName = session?.user?.name || (session?.user as any)?.firstName || "John Doe";
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "JD";

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-30">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Left Section - Breadcrumb & Search */}
        <div className="flex items-center gap-4 flex-1">
          {/* Breadcrumb */}
          <nav className="hidden lg:flex items-center text-sm">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
              Dashboard
            </Link>
            <svg className="w-4 h-4 mx-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 font-medium">Overview</span>
          </nav>

          <div className="hidden lg:block w-px h-6 bg-slate-200"></div>

          <div className="flex-1 max-w-xl">
            <div className="relative" ref={dropdownRef}>
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleFocus}
                placeholder="Search projects, tasks, or teams... (Cmd+K)"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              />
              {!isFocused && (
                <kbd className="hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-500">
                  <span className="text-xs">⌘</span>K
                </kbd>
              )}

              {isFocused && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50">
                  {loading ? (
                    <div className="p-4 text-center text-sm text-slate-500">Loading...</div>
                  ) : results.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {results.map((result, idx) => (
                        <Link 
                          key={`${result.type}-${result.id}-${idx}`}
                          href={result.url}
                          onClick={() => {
                            setIsFocused(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            result.type === 'project' ? 'bg-blue-100 text-blue-600' :
                            result.type === 'team' ? 'bg-purple-100 text-purple-600' :
                            'bg-amber-100 text-amber-600'
                          }`}>
                            {result.type === 'project' && (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                            )}
                            {result.type === 'team' && (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            )}
                            {result.type === 'task' && (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-slate-500 truncate capitalize">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 capitalize bg-slate-100 px-2 py-1 rounded">
                            {result.type}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No results found for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          
          <button className="flex items-center gap-3 pl-2 pr-3 py-1.5 hover:bg-slate-100 rounded-lg transition-all group">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {userInitials}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-sm font-semibold text-slate-900 leading-none mb-0.5">{userName}</div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}