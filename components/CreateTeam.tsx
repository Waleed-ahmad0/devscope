"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
interface MemberInput {
  user: string;
  role: "admin" | "member";
}

export default function CreateTeam({
  isOpen,
  setIsOpen,
onSuccess
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSuccess?: () => void;
}) {
  const {data} = useSession();
  const adminemail= data?.user?.email 
  const [name, setName] = useState("");
  const [members, setMembers] = useState<MemberInput[]>([]);
  const [errors, setErrors] = useState<{ name: string; members: string }>({
    name: "",
    members: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const addMember = () => {
    setMembers((prev) => [...prev, { user: "", role: "member" }]);
  };

  const removeMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMember = (
    index: number,
    field: keyof MemberInput,
    value: string,
  ) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
    if (errors.members) setErrors((prev) => ({ ...prev, members: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only validate filled member rows
    const filledMembers = members.filter((m) => m.user.trim() !== "");
    if (filledMembers.some((m) => m.user === adminemail )) {
      setErrors({name: adminemail || " " ,members: "You cannot add yourself as a member" });
      return;
    }
    if (filledMembers.some((obj, index) => 
    filledMembers.findIndex(item => item.user === obj.user) !== index)) {
      setErrors({name:" " ,members: "You cannot add same memeber twice" });
      return;
    }
    const newErrors = {
      name: name.trim() === "" ? "Team name is required" : "",
      members: "",
    };
    setErrors(newErrors);

    if (newErrors.name) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          members: filledMembers.map((m) => ({
            user: m.user.trim(),
            role: m.role,
          })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess?.()
        setName("");
        setMembers([]);
        setIsOpen(false);
      }
      if (data?.error?.includes("User not found:")) {
        setErrors({
          name: " has not signed in to devscope",
          members: data.error.split("User not found:", 2),
        });
      }
    } catch (err) {
      // setSubmitting(false);
      console.error("Failed to create team:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setMembers([]);
    setErrors({ name: "", members: "" });
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 my-4 sm:my-0 animate-in fade-in zoom-in-95">
        <div className="bg-linear-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100 p-5 sm:p-8">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-5 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
              Create Team
            </h2>
            <p className="text-blue-600">
              Set up your team and add members later
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Team Name */}
            <div className="space-y-2">
              <label
                htmlFor="team-name"
                className="block text-sm font-semibold text-blue-900"
              >
                Team Name
              </label>
              <input
                type="text"
                id="team-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${"border-blue-200 hover:border-blue-300"}`}
                placeholder="e.g. Startup Alpha"
              />
            </div>

            {/* Creator is admin notice */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-blue-50 border border-blue-200">
              <svg
                className="w-4 h-4 text-blue-600 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-blue-700">
                You will be the team admin by default
              </p>
            </div>

            {/* Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-blue-900">
                  Members{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <button
                  type="button"
                  onClick={addMember}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Member
                </button>
              </div>

              {members.length === 0 ? (
                <p className="text-sm text-slate-400 py-2">
                  No members added yet. You can add members now or after
                  creating the team.
                </p>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {members.map((member, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={member.user}
                        onChange={(e) =>
                          updateMember(index, "user", e.target.value)
                        }
                        className="flex-1 px-4 py-2.5 rounded-lg border-2 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-blue-200 hover:border-blue-300"
                        placeholder="Email or username"
                      />
                      <select
                        value={member.role}
                        onChange={(e) =>
                          updateMember(index, "role", e.target.value)
                        }
                        className="px-3 py-2.5 rounded-lg border-2 border-blue-200 hover:border-blue-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="shrink-0">⚠</span>
                      <span>
                        {" "}
                        {errors.name} <b>{errors.members}</b> 
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 px-6 rounded-lg border-2 border-blue-200 text-blue-700 font-semibold hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating…" : "Create Team"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
