"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface project {
  name: string;
  team: string;
  description: string;
}

interface members {
  user: string;
  role: string;
}

interface teamformat {
  _id: string;
  name: string;
  ownerId: string;
  members: members[];
}

export default function CreateProject({
  isOpen,
  setIsOpen,
  onSuccess,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSuccess?: () => void;
}) {
  const [teamname, setteamname] = useState<teamformat[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { data: session } = useSession();
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<project>({
    name: "",
    team: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    team: "",
  });

  useEffect(() => {
    const getusrteam = async () => {
      const teamreq = await fetch("/api/teams");
      const data = await teamreq.json();
      setteamname(data);
    };
    getusrteam();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: formData.name.trim() === "" ? "Project name is required" : "",
      description:
        formData.description.trim() === "" ? "Description is required" : "",
      team: formData.team === "" ? "Please select a team" : "",
    };

    setErrors(newErrors);
    if (newErrors.name || newErrors.description || newErrors.team) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setFormData({ name: "", description: "", team: "" });
        setSubmitSuccess(false);
        setIsOpen(false);
        onSuccess?.();
      }, 900);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-blue-950/45 backdrop-blur-md animate-[fadeIn_0.2s_ease]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cp-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpen(false);
        }}
      >
        <div
          ref={modalRef}
          className="relative w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_4px_6px_-1px_rgba(37,99,235,0.06),0_20px_60px_-8px_rgba(37,99,235,0.22),0_0_0_1px_rgba(37,99,235,0.08)] overflow-hidden animate-[slideUp_0.25s_cubic-bezier(0.34,1.36,0.64,1)]"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <div className="px-7 pt-7 flex justify-between items-start">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full mb-2.5">
                <svg
                  className="w-3 h-3"
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
              </div>
              <h2
                id="cp-title"
                className="text-[22px] font-bold text-blue-900 leading-tight m-0 mb-1"
              >
                Create a Project
              </h2>
              <p className="text-[13.5px] text-slate-500 m-0">
                Set up your workspace and get started
              </p>
            </div>
            <button
              className="flex-shrink-0 w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 flex items-center justify-center cursor-pointer transition-all duration-150 mt-0.5 hover:bg-red-100 hover:border-red-300 hover:text-red-600"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
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
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="h-px mx-7 mt-[22px] bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          <form onSubmit={handleSubmit} noValidate>
            <div className="px-7 pt-[22px] pb-7 flex flex-col gap-[18px]">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-[13px] font-semibold text-blue-800 flex items-center gap-1.5"
                >
                  Project Name{" "}
                  <span className="text-red-600 text-[15px] leading-none">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Marketing Dashboard"
                  autoComplete="off"
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`text-sm text-slate-900 bg-slate-50 border-[1.5px] rounded-[10px] px-3.5 py-2.5 transition-all duration-[180ms] outline-none w-full placeholder:text-slate-400
                    focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]
                    hover:bg-white
                    ${
                      errors.name
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                        : "border-slate-300 focus:border-blue-500 hover:border-blue-300"
                    }`}
                />
                {errors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="flex items-center gap-1.5 text-xs text-red-600 font-medium animate-[shake_0.25s_ease]"
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
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="team"
                  className="text-[13px] font-semibold text-blue-800 flex items-center gap-1.5"
                >
                  Team
                  <span className="text-red-600 text-[15px] leading-none">
                    *
                  </span>
                </label>
                <select
                  name="team"
                  id="team"
                  value={formData.team}
                  onChange={handleChange}
                  className="text-sm text-slate-900 bg-slate-50 border-[1.5px] border-slate-300 rounded-[10px] px-3.5 py-2.5 transition-all duration-[180ms] outline-none w-full cursor-pointer appearance-none
                    hover:border-blue-300 hover:bg-white
                    focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    paddingRight: "36px",
                  }}
                >
                  <option value="">— No team —</option>

                  {teamname.map((team: teamformat) => (
                    <option
                      key={team._id}
                      value={team._id}
                      disabled={team.ownerId !== session?.user?.id}
                    >
                      {team.name}
                      {team.ownerId !== session?.user?.id ? " (no access)" : ""}
                    </option>
                  ))}
                </select>
                {errors.team && (
                  <p
                    id="team-error"
                    aria-invalid={true}
                    className="flex items-center gap-1.5 text-xs text-red-600 font-medium animate-[shake_0.25s_ease]"
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
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.team}
                  </p>
                )}
                <p className="text-[11.5px] text-slate-400">
                  Only teams you own can be selected
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="description"
                  className="text-[13px] font-semibold text-blue-800 flex items-center gap-1.5"
                >
                  Description{" "}
                  <span className="text-red-600 text-[15px] leading-none">
                    *
                  </span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What's this project about?"
                  aria-describedby={
                    errors.description ? "desc-error" : undefined
                  }
                  className={`text-sm text-slate-900 bg-slate-50 border-[1.5px] rounded-[10px] px-3.5 py-2.5 transition-all duration-[180ms] outline-none w-full resize-none h-24 placeholder:text-slate-400
                    hover:bg-white
                    focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]
                    ${
                      errors.description
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                        : "border-slate-300 focus:border-blue-500 hover:border-blue-300"
                    }`}
                />
                {errors.description && (
                  <p
                    id="desc-error"
                    role="alert"
                    className="flex items-center gap-1.5 text-xs text-red-600 font-medium animate-[shake_0.25s_ease]"
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
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            <div className="px-7 pb-7 flex gap-2.5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-none text-sm font-semibold text-slate-600 bg-slate-100 border-[1.5px] border-slate-200 rounded-[10px] px-[18px] py-2.5 cursor-pointer transition-all duration-150 hover:bg-slate-200 hover:text-slate-800"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className="flex-1 text-sm font-bold text-white bg-gradient-to-br from-blue-600 to-blue-700 border-none rounded-[10px] px-[18px] py-[11px] cursor-pointer transition-all duration-[180ms] shadow-[0_2px_8px_rgba(37,99,235,0.35)] flex items-center justify-center gap-2 relative overflow-hidden
                  hover:from-blue-700 hover:to-blue-800
                  active:scale-[0.98]
                  disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                    <span>Creating…</span>
                  </>
                ) : submitSuccess ? (
                  <span className="flex items-center gap-1.5">
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
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Created!
                  </span>
                ) : (
                  <>
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
                    <span>Create Project</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
