"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

interface dummypro {
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
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const [teamname, setteamname] = useState<teamformat[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { data: session } = useSession();
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<dummypro>({
    name: "",
    team: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const getusrteam = async () => {
      const teamreq = await fetch("/api/teams");
      const data = await teamreq.json();
      setteamname(data);
    };
    getusrteam();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: formData.name.trim() === "" ? "Project name is required" : "",
      description: formData.description.trim() === "" ? "Description is required" : "",
    };

    setErrors(newErrors);
    if (newErrors.name || newErrors.description) return;

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
      }, 900);
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .cp-overlay {
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: rgba(10, 20, 60, 0.45);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          animation: cp-fade-in 0.2s ease;
        }

        @keyframes cp-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .cp-modal {
          position: relative;
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow:
            0 4px 6px -1px rgba(37, 99, 235, 0.06),
            0 20px 60px -8px rgba(37, 99, 235, 0.22),
            0 0 0 1px rgba(37, 99, 235, 0.08);
          overflow: hidden;
          animation: cp-slide-up 0.25s cubic-bezier(0.34, 1.36, 0.64, 1);
        }

        @keyframes cp-slide-up {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .cp-header {
          padding: 28px 28px 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .cp-header-text {}

        .cp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          padding: 3px 10px;
          border-radius: 999px;
          margin-bottom: 10px;
        }

        .cp-eyebrow svg {
          width: 12px;
          height: 12px;
        }

        .cp-title {
          font-size: 22px;
          font-weight: 700;
          color: #1e3a8a;
          line-height: 1.25;
          margin: 0 0 4px;
        }

        .cp-subtitle {
          font-size: 13.5px;
          color: #64748b;
          margin: 0;
        }

        .cp-close {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          margin-top: 2px;
        }

        .cp-close:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #dc2626;
        }

        .cp-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #dbeafe 30%, #dbeafe 70%, transparent);
          margin: 22px 28px 0;
        }

        .cp-body {
          padding: 22px 28px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .cp-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cp-label {
          font-size: 13px;
          font-weight: 600;
          color: #1e40af;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .cp-label .cp-required {
          color: #dc2626;
          font-size: 15px;
          line-height: 1;
        }

        .cp-input,
        .cp-textarea,
        .cp-select {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          color: #0f172a;
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 14px;
          transition: all 0.18s ease;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }

        .cp-input::placeholder,
        .cp-textarea::placeholder {
          color: #94a3b8;
        }

        .cp-input:hover,
        .cp-textarea:hover,
        .cp-select:hover {
          border-color: #93c5fd;
          background: #fff;
        }

        .cp-input:focus,
        .cp-textarea:focus,
        .cp-select:focus {
          border-color: #3b82f6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
        }

        .cp-input.cp-error,
        .cp-textarea.cp-error {
          border-color: #fca5a5;
          background: #fff5f5;
        }

        .cp-input.cp-error:focus,
        .cp-textarea.cp-error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .cp-textarea {
          resize: none;
          height: 96px;
        }

        .cp-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }

        .cp-error-msg {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #dc2626;
          font-weight: 500;
          animation: cp-shake 0.25s ease;
        }

        @keyframes cp-shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-4px); }
          75%      { transform: translateX(4px); }
        }

        .cp-hint {
          font-size: 11.5px;
          color: #94a3b8;
        }

        .cp-footer {
          padding: 0 28px 28px;
          display: flex;
          gap: 10px;
        }

        .cp-btn-cancel {
          flex: 0 0 auto;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          background: #f1f5f9;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 18px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cp-btn-cancel:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        .cp-btn-submit {
          flex: 1;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border: none;
          border-radius: 10px;
          padding: 11px 18px;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }

        .cp-btn-submit::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
          opacity: 0;
          transition: opacity 0.18s;
        }

        .cp-btn-submit:hover:not(:disabled)::after {
          opacity: 1;
        }

        .cp-btn-submit:active:not(:disabled) {
          transform: scale(0.98);
        }

        .cp-btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .cp-btn-submit span,
        .cp-btn-submit svg {
          position: relative;
          z-index: 1;
        }

        .cp-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: cp-spin 0.6s linear infinite;
        }

        @keyframes cp-spin {
          to { transform: rotate(360deg); }
        }

        .cp-success-check {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cp-optional {
          font-size: 11px;
          font-weight: 400;
          color: #94a3b8;
          margin-left: 4px;
        }
      `}</style>

      {/* Overlay — click outside to close */}
      <div
        className="cp-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cp-title"
        onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
      >
        <div className="cp-modal" ref={modalRef}>

          {/* Header */}
          <div className="cp-header">
            <div className="cp-header-text">
              <div className="cp-eyebrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                New Project
              </div>
              <h2 className="cp-title" id="cp-title">Create a Project</h2>
              <p className="cp-subtitle">Set up your workspace and get started</p>
            </div>
            <button
              className="cp-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="cp-divider" />

          {/* Form body */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="cp-body">

              {/* Project Name */}
              <div className="cp-field">
                <label htmlFor="name" className="cp-label">
                  Project Name <span className="cp-required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`cp-input${errors.name ? " cp-error" : ""}`}
                  placeholder="e.g. Marketing Dashboard"
                  autoComplete="off"
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p className="cp-error-msg" id="name-error" role="alert">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Team */}
              <div className="cp-field">
                <label htmlFor="team" className="cp-label">
                  Team
                  <span className="cp-optional">(optional)</span>
                </label>
                <select
                  name="team"
                  id="team"
                  value={formData.team}
                  onChange={handleChange}
                  className="cp-select"
                >
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
                <p className="cp-hint">Only teams you own can be selected</p>
              </div>

              {/* Description */}
              <div className="cp-field">
                <label htmlFor="description" className="cp-label">
                  Description <span className="cp-required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`cp-textarea${errors.description ? " cp-error" : ""}`}
                  placeholder="What's this project about?"
                  aria-describedby={errors.description ? "desc-error" : undefined}
                />
                {errors.description && (
                  <p className="cp-error-msg" id="desc-error" role="alert">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="cp-footer">
              <button
                type="button"
                className="cp-btn-cancel"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cp-btn-submit"
                disabled={isSubmitting || submitSuccess}
              >
                {isSubmitting ? (
                  <>
                    <div className="cp-spinner" />
                    <span>Creating…</span>
                  </>
                ) : submitSuccess ? (
                  <span className="cp-success-check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    Created!
                  </span>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14"/>
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