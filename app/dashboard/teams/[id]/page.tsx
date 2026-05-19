"use client";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Addmember from "@/components/Addmember";
import DeleteMemberModal from "@/components/Deletemember";
import { useRouter } from "next/navigation";

interface Userdata {
  firstName: string;
  lastName?: string;
  _id: string;
  email: string;
}
interface Member {
  user: Userdata;
  role: "admin" | "member";
  _id?: string;
}
interface TeamData {
  _id: string;
  name: string;
  adminId: {
    firstName: string;
    lastName?: string;
    email: string;
  };
  members: Member[];
  createdAt?: string;
  updatedAt?: string;
}

function initials(first: string, last?: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "?";
}

function avatarColor(str: string) {
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

function SkeletonPage() {
  return (
    <div className="p-8 max-w-[900px] mx-auto">
      {/* header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col gap-2.5">
          <SkeletonBox w="260px" h="34px" radius="8px" />
          <SkeletonBox w="200px" h="18px" radius="6px" />
        </div>
        <div className="flex gap-2.5">
          <SkeletonBox w="130px" h="40px" radius="10px" />
          <SkeletonBox w="150px" h="40px" radius="10px" />
        </div>
      </div>
      {/* stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3.5">
              <SkeletonBox w="40px" h="40px" radius="10px" />
              <SkeletonBox w="80px" h="14px" />
            </div>
            <SkeletonBox w="60px" h="32px" radius="6px" />
          </div>
        ))}
      </div>
      {/* members table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between">
          <SkeletonBox w="140px" h="20px" radius="6px" />
          <SkeletonBox w="140px" h="36px" radius="10px" />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between px-6 py-4 border-b border-slate-50"
          >
            <div className="flex items-center gap-3">
              <SkeletonBox w="40px" h="40px" radius="50%" />
              <div className="flex flex-col gap-1.5">
                <SkeletonBox w="140px" h="14px" />
                <SkeletonBox w="100px" h="12px" />
              </div>
            </div>
            <SkeletonBox w="64px" h="24px" radius="999px" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [RefreshKey, setRefreshKey] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();
  const id = decodeURIComponent(use(params).id);
  const [showMenu, setShowMenu] = useState(false);
  const [memberDeleteShow, setmemberDeleteShow] = useState(false);
  const [membershow, setmembershow] = useState(false);
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTarget, setTransferTarget] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [exitconfirm, setexitconfirm] = useState(false);
  const [MembersEmail, setMembersEmail] = useState<string[]>([]);
  const fetchTeam = async () => {
    try {
      const res = await fetch(`/api/teams/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setTeam(null);
        return;
      }
      const emails = data.members.map((member: Member) => member.user.email);
      setMembersEmail(emails);
      console.log(emails);
      setTeam(data);
    } catch (err) {
      console.error("Failed to fetch team:", err);
    } finally {
      setLoading(false);
    }
  };

  const exitTeam = async () => {
    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "exit", userId: session?.user?.id }),
      });
      const data = await res.json();
      if (res.ok) {
        router.replace("/dashboard/teams");
      }
    } catch (error) {
      console.error("Failed to exit team:", error);
    }
  };
  const deleteteam = async () => {
    try {
      const res = await fetch(`/api/teams`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        setTeam(null);
        router.replace("/dashboard/teams");
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to delete team:", err);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [RefreshKey, id]);

  const handleTransferAdmin = async () => {
    if (!transferTarget) return;
    setTransferring(true);
    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newadmin: transferTarget }),
      });
      const data = await res.json();
      if (res.ok) {
        setRefreshKey((k) => k + 1);
        setShowTransferModal(false);
        setTransferTarget("");
      } else console.error("Transfer failed:", data.error);
    } catch (err) {
      console.error("Transfer failed:", err);
    } finally {
      setTransferring(false);
    }
  };

  /* ── states ── */
  if (loading) return <SkeletonPage />;

  if (!team)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <p className="text-base font-semibold">Team not found</p>
      </div>
    );

  const isadmin = team.adminId.email === session?.user?.email;

  return (
    <>
      <div className="bg-slate-50 min-h-screen px-6 py-9">
        <div className="max-w-[940px] mx-auto animate-[fadeIn_.3s_ease]">
          <div className="flex items-start justify-between gap-4 mb-7 flex-wrap">
            <div>
              <h1 className="text-[28px] font-extrabold text-slate-900 mb-1 tracking-tight leading-none">
                {team.name}
              </h1>
              <p className="text-[13.5px] text-slate-500">
                admin :
                <strong className="text-blue-800 font-semibold">
                  {team.adminId.firstName} {team.adminId.lastName}
                </strong>
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 bg-[#4756fc] text-white hover:from-slate-700 hover:to-slate-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
                Team Actions
              </button>

              {/* Popup Menu */}
              {showMenu && (
                <div className="absolute right-0 top-full mt-3 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      Team Management
                    </h3>
                    <button
                      onClick={() => setShowMenu(false)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  {/* Menu Content */}
                  <div className="p-4 space-y-3">
                    {/* Exit Team */}
                    <button
                      onClick={() => {
                        setexitconfirm(true);
                        // exitTeam();
                        // setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors border border-transparent hover:border-slate-200 group"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-slate-500 group-hover:text-slate-700"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <div className="text-left">
                        <p>Exit Team</p>
                        <p className="text-xs text-slate-500 font-normal">
                          Leave this team
                        </p>
                      </div>
                    </button>
                    {exitconfirm &&
                      team.adminId.email !== session?.user?.email && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3 animate-in fade-in duration-150">
                          <p className="text-sm font-semibold text-red-900">
                            exit team ?
                          </p>
                          <p className="text-xs text-red-700">
                            This action cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={exitTeam}
                              className="flex-1 bg-red-600 text-white font-semibold px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                              Yes, delete
                            </button>
                            <button
                              onClick={() => setexitconfirm(false)}
                              className="flex-1 bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-lg hover:bg-slate-300 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                    {exitconfirm && team.adminId.email === session?.user?.email && (
                      <div className="bg-red-50 border border-red-200 text-sm rounded-lg p-4 space-y-3 animate-in fade-in duration-150">
                        You are the admin of this team. First, make someone else
                        admin.
                      </div>
                    )}

                    {/* Admin Actions */}
                    {isadmin && (
                      <>
                        <div className="border-t border-slate-100 my-2" />

                        {/* Add Member */}
                        <button
                          onClick={() => setmembershow(true)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-blue-700 font-medium transition-colors border border-transparent hover:border-blue-200 group"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-600 group-hover:text-blue-700"
                          >
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                          <div className="text-left">
                            <p>Add Member</p>
                            <p className="text-xs text-blue-600 font-normal">
                              Invite team members
                            </p>
                          </div>
                        </button>

                        {/* Remove Member */}
                        <button
                          onClick={() => setmemberDeleteShow(true)} // Replace with your actual handler
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-50 text-orange-700 font-medium transition-colors border border-transparent hover:border-orange-200 group"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-orange-600 group-hover:text-orange-700"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="18" y1="8" x2="23" y2="13" />
                            <line x1="23" y1="8" x2="18" y2="13" />
                          </svg>
                          <div className="text-left">
                            <p>Remove Member</p>
                            <p className="text-xs text-orange-600 font-normal">
                              Kick out a member
                            </p>
                          </div>
                        </button>

                        {/* Delete Team */}
                        <div className="border-t border-slate-100 my-2" />

                        {!deleteConfirm ? (
                          <button
                            onClick={() => setDeleteConfirm(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-700 font-medium transition-colors border border-transparent hover:border-red-200 group"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-red-600 group-hover:text-red-700"
                            >
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <div className="text-left">
                              <p>Delete Team</p>
                              <p className="text-xs text-red-600 font-normal">
                                Permanently delete
                              </p>
                            </div>
                          </button>
                        ) : (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3 animate-in fade-in duration-150">
                            <p className="text-sm font-semibold text-red-900">
                              Delete team permanently?
                            </p>
                            <p className="text-xs text-red-700">
                              This action cannot be undone. All team data will
                              be deleted.
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={deleteteam}
                                className="flex-1 bg-red-600 text-white font-semibold px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                Yes, delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(false)}
                                className="flex-1 bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-lg hover:bg-slate-300 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Backdrop - close menu when clicked outside */}
              {showMenu && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
              )}
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-3.5 mb-6">
            {/* Total Members */}
            <div className="bg-white border border-slate-200 rounded-2xl p-[22px] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(37,99,235,.1)] hover:-translate-y-0.5">
              <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center mb-3.5 bg-blue-50">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-[.06em] mb-1.5">
                Total Members
              </div>
              <div className="text-[26px] font-extrabold text-slate-900">
                {team.members.length + 1}
              </div>
            </div>

            {/* admin*/}
            <div className="bg-white border border-slate-200 rounded-2xl p-[22px] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(37,99,235,.1)] hover:-translate-y-0.5">
              <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center mb-3.5 bg-indigo-50">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-[.06em] mb-1.5">
                admin
              </div>
              <div className="text-[17px] font-bold text-slate-900">
                {team.adminId.firstName} {team.adminId.lastName}
              </div>
            </div>

            {/* Created */}
            <div className="bg-white border border-slate-200 rounded-2xl p-[22px] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(37,99,235,.1)] hover:-translate-y-0.5">
              <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center mb-3.5 bg-green-50">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-[.06em] mb-1.5">
                Created
              </div>
              <div className="text-[17px] font-bold text-slate-900">
                {team.createdAt
                  ? new Date(team.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </div>
            </div>
          </div>

          {/* ── MEMBERS PANEL ── */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-[18px] border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-[15px] font-bold text-slate-900">
                  Team Members
                </span>
                <span className="text-[12px] font-semibold text-slate-500 bg-slate-100 rounded-full px-2.5 py-0.5 ml-2">
                  {team.members.length + 1}
                </span>
              </div>
              {isadmin && (
                <button
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold rounded-xl px-4 py-[9px] cursor-pointer transition-all duration-150 bg-amber-50 text-amber-700 border border-yellow-300 hover:bg-amber-100 hover:border-amber-400"
                  onClick={() => setShowTransferModal(true)}
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
                    className="shrink-0"
                  >
                    <path d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Transfer adminship
                </button>
              )}
            </div>

            {/* adminrow */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-50 transition-colors duration-150 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 tracking-wide"
                  style={{ background: avatarColor(team.adminId.email) }}
                >
                  {initials(team.adminId.firstName, team.adminId.lastName)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {team.adminId.firstName} {team.adminId.lastName}
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-[3px] rounded-full text-[11.5px] font-bold tracking-wide capitalize bg-amber-100 text-amber-900">
                admin
              </span>
            </div>

            {/* Member rows */}
            {team.members.length === 0 ? (
              <div className="text-center py-7 text-slate-400 text-[13.5px]">
                No additional members yet. Add someone to get started.
              </div>
            ) : (
              team.members.map((member, idx) => (
                <div
                  key={member._id || idx}
                  className="flex items-center justify-between px-6 py-3.5 border-b border-slate-50 last:border-b-0 transition-colors duration-150 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 tracking-wide"
                      style={{ background: avatarColor(member.user.email) }}
                    >
                      {initials(member.user.firstName, member.user.lastName)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {member.user.firstName} {member.user.lastName}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-[3px] rounded-full text-[11.5px] font-bold tracking-wide capitalize ${
                      member.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── TRANSFER MODAL ── */}
      {showTransferModal && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-[rgba(10,20,60,.45)] backdrop-blur-md animate-[fadeIn_.2s_ease]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTransferModal(false);
              setTransferTarget("");
            }
          }}
        >
          <div className="relative w-full max-w-[460px] bg-white rounded-[20px] shadow-[0_20px_60px_-8px_rgba(37,99,235,.22),0_0_0_1px_rgba(37,99,235,.08)] overflow-hidden animate-[scaleIn_.24s_cubic-bezier(.34,1.36,.64,1)]">
            {/* Modal header */}
            <div className="px-6 pt-6 flex items-start justify-between">
              <div className="flex items-start gap-3.5">
                <div className="w-[42px] h-[42px] rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-slate-900 mb-0.5">
                    Transfer adminship
                  </p>
                  <p className="text-[13px] text-slate-500 m-0">
                    You will become a regular member
                  </p>
                </div>
              </div>
              <button
                className="w-[30px] h-[30px] rounded-lg border border-slate-200 bg-slate-50 text-slate-500 flex items-center justify-center cursor-pointer transition-all duration-150 shrink-0 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                onClick={() => {
                  setShowTransferModal(false);
                  setTransferTarget("");
                }}
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
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent my-[18px]" />

            {/* Modal body */}
            <div className="px-6 pb-6">
              <p className="text-[13px] text-slate-500 mb-3.5">
                Select a member to become the new team admin.
              </p>

              {team.members.filter((m) => m.user.email !== team.adminId.email)
                .length === 0 ? (
                <div className="text-center py-7 text-slate-400 text-[13.5px] border border-slate-100 rounded-xl mb-[18px]">
                  No other members to transfer to. Add members first.
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto mb-5">
                  {team.members
                    .filter((m) => m.user.email !== team.adminId.email)
                    .map((member, idx) => (
                      <label
                        key={member._id || idx}
                        className={`flex items-center gap-2.5 px-3.5 py-[11px] rounded-xl border-[1.5px] cursor-pointer transition-all duration-150 ${
                          transferTarget === member.user.email
                            ? "border-amber-400 bg-amber-50"
                            : "border-slate-200 hover:border-yellow-300 hover:bg-amber-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="transfer-target"
                          value={member.user.email}
                          checked={transferTarget === member.user.email}
                          onChange={() => setTransferTarget(member.user.email)}
                          className="accent-amber-600"
                        />
                        <div
                          className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                          style={{ background: avatarColor(member.user.email) }}
                        >
                          {initials(
                            member.user.firstName,
                            member.user.lastName,
                          )}
                        </div>
                        <div>
                          <div className="text-[13.5px] font-semibold text-slate-900">
                            {member.user.firstName} {member.user.lastName}
                          </div>
                          <div className="text-[12px] text-slate-500">
                            {member.user.email} · {member.role}
                          </div>
                        </div>
                      </label>
                    ))}
                </div>
              )}

              <div className="flex gap-2.5">
                <button
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-[13.5px] font-semibold rounded-xl px-4 py-[9px] cursor-pointer transition-all duration-150 bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 hover:text-slate-800"
                  onClick={() => {
                    setShowTransferModal(false);
                    setTransferTarget("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-[13.5px] font-semibold rounded-xl px-4 py-[9px] cursor-pointer transition-all duration-150 bg-amber-50 text-amber-700 border border-yellow-300 hover:bg-amber-100 hover:border-amber-400 disabled:opacity-55 disabled:cursor-not-allowed"
                  onClick={handleTransferAdmin}
                  disabled={!transferTarget || transferring}
                >
                  {transferring ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-200 border-t-amber-700 animate-spin" />
                      Transferring…
                    </>
                  ) : (
                    "Transfer adminship"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Addmember
        teammembers={MembersEmail}
        adminemail={team.adminId.email}
        id={id}
        isOpen={membershow}
        setIsOpen={setmembershow}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
      <DeleteMemberModal
        id={id}
        members={team.members}
        onClose={() => setmemberDeleteShow(false)}
        isOpen={memberDeleteShow}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </>
  );
}
