"use client";
import { useEffect, useState } from "react";
import CreateTeam from "@/components/CreateTeam";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface members {
  user: string;
  role: string;
}
interface teamformat {
  _id: string;
  name: string;
  adminId: string;
  members: members[];
}

function teamColor(str: string) {
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
  for (const c of str) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

function teamInitials(name: string) {
  return (
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "T"
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-200 animate-pulse shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-[65%] rounded-md bg-slate-200 animate-pulse" />
          <div className="h-3 w-[40%] rounded-md bg-slate-200 animate-pulse" />
        </div>
      </div>
      <div className="h-px bg-slate-100" />
      <div className="flex gap-2">
        <div className="h-6 w-24 rounded-full bg-slate-200 animate-pulse" />
      </div>
      <div className="h-10 rounded-lg bg-slate-200 animate-pulse mt-2" />
    </div>
  );
}

export default function TeamsPage() {
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const { data, status } = useSession();
  const [refreshkey, setRefreshKey] = useState<number>(0);
  const [teams, setteams] = useState<teamformat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, seterror] = useState(false);

  useEffect(() => {
    if (!data?.user?.id) return;

    const retreivingteams = async () => {
      try {
        const req = await fetch("/api/teams");
        const res = await req.json();
        if (req.ok) {
          setteams(res);
          setLoading(false);
        } else {
          seterror(true);
          setLoading(false);
          return;
        }
      } catch (error) {
        seterror(true);
        setLoading(false);
      }
    };
    retreivingteams();
  }, [data, refreshkey]);

  const handleNewTeam = () => setShowCreateTeam(true);

  if (loading || status === "loading") {
    return (
      <div className="font-sans bg-slate-50 min-h-screen py-9 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div className="flex flex-col gap-2.5">
              <div className="h-8 w-32 rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-4 w-56 rounded-md bg-slate-200 animate-pulse" />
            </div>
            <div className="h-10 w-32 rounded-lg bg-slate-200 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} />
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
            Failed to load teams
          </h2>
          <p className="text-sm text-slate-500 mb-1 leading-relaxed">
            We couldn&apos;t fetch your teams data. This might be a temporary
            issue.
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
  return (
    <>
      <div className="font-sans bg-slate-50 min-h-screen py-9 px-6">
        <div className="max-w-[1100px] mx-auto animate-fade-in-up">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h1 className="text-[28px] font-extrabold text-slate-900 m-0 mb-1 tracking-tight">
                Teams
                {teams.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full py-0.5 px-2.5 ml-2.5 align-middle">
                    {teams.length}
                  </span>
                )}
              </h1>
              <p className="text-sm text-slate-500 m-0">
                Create and manage your teams
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-linear-to-br from-blue-600 to-blue-700 border-none rounded-lg py-2.5 px-5 cursor-pointer shadow-[0_2px_10px_rgba(37,99,235,0.3)] transition-all duration-150 hover:from-blue-700 hover:to-blue-800 hover:shadow-[0_4px_16px_rgba(37,99,235,0.38)] hover:-translate-y-px"
              onClick={handleNewTeam}
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
              New Team
            </button>
          </div>

          {teams.length === 0 ? (
            <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl py-16 px-6 text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                No teams yet
              </h2>
              <p className="text-sm text-slate-500 mb-7">
                Create your first team to start collaborating with others
              </p>
              <button
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-linear-to-br from-blue-600 to-blue-700 border-none rounded-lg py-3 px-6 cursor-pointer shadow-[0_2px_10px_rgba(37,99,235,0.3)] transition-all duration-150 hover:from-blue-700 hover:to-blue-800 hover:shadow-[0_4px_16px_rgba(37,99,235,0.38)] hover:-translate-y-px"
                onClick={handleNewTeam}
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
                Create your first team
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {teams.map((team) => {
                const isadmin = team.adminId === data?.user?.id;
                const color = teamColor(team._id);
                return (
                  <div
                    key={team._id}
                    className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-5 flex flex-col transition-all duration-200 relative overflow-hidden group hover:border-blue-200 hover:shadow-[0_8px_28px_rgba(37,99,235,0.1)] hover:-translate-y-1"
                    style={{ "--tc": color } as React.CSSProperties}
                  >
                    <div className="absolute left-0 top-0 right-0 h-[3px] bg-(--tc,#2563eb) opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                    <div className="flex items-center gap-3.5 mb-4 mt-1">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-extrabold text-white shrink-0"
                        style={{ background: color }}
                      >
                        {teamInitials(team.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-slate-900 m-0 mb-0.5 truncate">
                          {team.name}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-bold uppercase tracking-wider ${isadmin ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}`}
                        >
                          {isadmin ? "Admin" : "Member"}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 mb-3.5" />

                    <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
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
                        {team.members.length + 1}{" "}
                        {team.members.length + 1 === 1 ? "member" : "members"}
                      </span>
                    </div>

                    <Link
                      href={`/dashboard/teams/${team._id}`}
                      className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 text-[13.5px] font-semibold text-slate-600 bg-slate-50 border-[1.5px] border-slate-200 rounded-xl no-underline transition-all duration-150 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                    >
                      Open Team
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
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <CreateTeam
        isOpen={showCreateTeam}
        setIsOpen={setShowCreateTeam}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </>
  );
}
