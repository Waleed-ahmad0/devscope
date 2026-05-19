"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSidebar } from "../components/SidebarContext";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const userName =
    session?.user?.name || (session?.user as any)?.firstName || "User";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const navLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      ),
    },
    {
      href: "/dashboard/teams",
      label: "Teams",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
    },
    {
      href: "/dashboard/projects",
      label: "Projects",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      ),
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </>
      ),
    },
  ];

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <svg
            className="w-8 h-8 shrink-0"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="8" fill="#2563eb" />
            <path
              d="M8 12L16 8L24 12V20L16 24L8 20V12Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 8V16M16 16L8 20M16 16L24 20"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xl font-bold text-slate-900">DevScope</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {navLinks.map(({ href, label, icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 transition-colors shrink-0 ${
                      active
                        ? "text-blue-600"
                        : "text-slate-500 group-hover:text-blue-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {icon}
                  </svg>
                  <span className="font-medium text-[15px]">{label}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-200 p-4 shrink-0">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-all duration-200">
          <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {userInitials}
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <div className="font-semibold text-slate-900 text-sm truncate">
              {userName}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {session?.user?.email}
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden md:flex fixed left-0 top-0 h-dvh w-64 bg-white border-r border-slate-200 flex-col z-40">
        <NavContent />
      </aside>

      {/* Mobile backdrop */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile slide-in drawer */}
      <aside
        className={`md:hidden fixed left-0 top-0 h-dvh w-72 bg-white border-r border-slate-200 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ✕ close button */}
        <button
          onClick={close}
          aria-label="Close menu"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors z-10"
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
        <NavContent />
      </aside>
    </>
  );
}
