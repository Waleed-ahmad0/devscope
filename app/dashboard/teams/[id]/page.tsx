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
  ownerId: {
    firstName: string;
    lastName?: string;
    email: string;
  };
  members: Member[];
  createdAt?: string;
  updatedAt?: string;
}

export default function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router= useRouter();
  const { data: session } = useSession();
  const id = decodeURIComponent(use(params).id);
  const [memberDeleteShow, setmemberDeleteShow] = useState(false);
  const [membershow, setmembershow] = useState(false);
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTarget, setTransferTarget] = useState("");
  const [transferring, setTransferring] = useState(false);

  const fetchTeam = async () => {
    try {
      const res = await fetch(`/api/teams/${id}`);
      const data = await res.json();
      if(!res.ok) {
        setTeam(null);
        // setLoading();
        return
      
      }
      
      // console.log(data);
      setTeam(data);
      // console.log('hello;',data.ownerId)
    } catch (err) {
      console.error("Failed to fetch team:", err);
    } finally {
      setLoading(false);
    }
  };
  const deleteteam= async () => {
    try{
      const res=await fetch(`/api/teams`,{
        method:"DELETE",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      });
      const data=await res.json();
      console.log(data,"team deleted")
      if(res.ok){
        setTeam(null);
        router.replace("/dashboard/teams");
        setLoading(false);
        return
      
      }
    }catch(err){
      console.error("Failed to fetch team:", err);
    }
    
  }
  useEffect(() => {
    fetchTeam();
  }, [id]);
  // const { data: session } = useSession();
  // useEffect(() => {
  //   // console.log(session)

  // }, [session]);
  const handleTransferAdmin = async () => {
    if (!transferTarget) return;

    setTransferring(true);
    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newOwner: transferTarget }),
      });
      const data = await res.json();
      if (res.ok) {
        setTeam(data.team);
        setShowTransferModal(false);
        setTransferTarget("");
      } else {
        console.error("Transfer failed:", data.error);
      }
    } catch (err) {
      console.error("Transfer failed:", err);
    } finally {
      setTransferring(false);
    }
  };

  function handleNewMember() {
    setmembershow(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-500 dark:text-slate-400 dark:text-slate-400">Loading team...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-500 dark:text-slate-400 dark:text-slate-400">Team not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-auto bg-slate-50 dark:bg-slate-950 dark:bg-slate-950">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 dark:text-slate-50 mb-2">
              {team.name}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 dark:text-slate-400">
              Owner:{" "}
              <span className="font-medium">
                {team.ownerId.firstName} {team.ownerId.lastName}{" "}
                {team.ownerId.email}
              </span>
            </p>
          </div>
          {team.ownerId.email === session?.user?.email && (
            <>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleNewMember}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  <svg
                    className="w-5 h-5"
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
                  New Member
                </button>

                <button
                  onClick={deleteteam}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 dark:bg-slate-900 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium shadow-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete this Team
                </button>
                <button
                  onClick={() => setmemberDeleteShow(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 dark:bg-slate-900 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium shadow-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Member
                </button>
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Members Card */}
          <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-400">Members</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-50 dark:text-slate-50">
              {team.members.length + 1}
            </div>
          </div>

          {/* Owner Card */}
          <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-400">Owner</h3>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-50 dark:text-slate-50 truncate">
              {team.ownerId.firstName} {team.ownerId.lastName}
            </div>
          </div>

          {/* Created Card */}
          <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-400">Created</h3>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-50 dark:text-slate-50">
              {team.createdAt
                ? new Date(team.createdAt).toLocaleDateString()
                : "—"}
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 dark:text-slate-50">
              Team Members
            </h2>
            {team.ownerId.email === session?.user?.email && (
              <button
                onClick={() => setShowTransferModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
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
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                Transfer Admin
              </button>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex w-[55%] items-center justify-around gap-3">
                <div className="w-auto h-9 bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-400">
                    {team.ownerId.firstName} {team.ownerId.lastName}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50 dark:text-slate-50">
                    {team.ownerId.email}
                  </p>

                  <p className="text-xs text-amber-600">Team Owner</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600`}
              >
                Admin
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 dark:divide-slate-800">
              {team.members.map((member, idx) => (
                <div
                  key={member._id || idx}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex w-[55%] items-center justify-around gap-3">
                    <div className="w-auto h-9 bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-400">
                        {member.user.firstName} {member.user.lastName}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-50 dark:text-slate-50">
                        {member.user.email}
                      </p>
                      {member.user.email === team.ownerId.email && (
                        <p className="text-xs text-amber-600">Team Owner</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      member.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 text-slate-600 dark:text-slate-400 dark:text-slate-400"
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Admin Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowTransferModal(false);
              setTransferTarget("");
            }}
          />
          <div className="relative w-full max-w-md mx-4">
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-xl border border-amber-100 p-8">
              {/* Warning icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 dark:text-slate-50">
                    Transfer Admin Role
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400">
                    This action will change the team owner
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-400 mb-4">
                Select a member to become the new team admin. You will be
                demoted to a regular member.
              </p>
              Member selection
              {team.members.filter((m) => m.user.email !== team.ownerId.email)
                .length === 0 ? (
                <div className="py-4 px-3 bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 rounded-lg text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400 text-center mb-6">
                  No other members to transfer admin to. Add members first.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto mb-6">
                  {team.members
                    .filter((m) => m.user.email !== team.ownerId.email)
                    .map((member, idx) => (
                      <label
                        key={member._id || idx}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                          transferTarget === member.user.email
                            ? "border-amber-400 bg-amber-50"
                            : "border-slate-200 dark:border-slate-700 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-900 dark:bg-slate-900"
                        }`}
                      >
                        <input
                          type="radio"
                          name="transfer-target"
                          value={member.user.email}
                          checked={transferTarget === member.user.email}
                          onChange={() => setTransferTarget(member.user.email)}
                          className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                        />
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-400">
                            {member.user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-50 dark:text-slate-50 truncate">
                            {member.user.email}
                          </p>
                          <p className="text-xs text-slate-400">
                            Current role: {member.role}
                          </p>
                        </div>
                      </label>
                    ))}
                </div>
              )}
              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowTransferModal(false);
                    setTransferTarget("");
                  }}
                  className="flex-1 py-2.5 px-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 dark:border-slate-700 text-slate-700 dark:text-slate-300 dark:text-slate-300 font-medium hover:bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransferAdmin}
                  disabled={!transferTarget || transferring}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {transferring ? "Transferring…" : "Transfer Admin"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Addmember
        owneremail={team.ownerId.email}
        id={id}
        isOpen={membershow}
        setIsOpen={setmembershow}
      />
      <DeleteMemberModal
        id={id}
        members={team.members}
        onClose={() => {
          setmemberDeleteShow(false);
        }}
        isOpen={memberDeleteShow}
      />
    </div>
  );
}
