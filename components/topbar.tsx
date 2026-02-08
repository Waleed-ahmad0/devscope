export default function Topbar() {
    return (
        


<header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-30">
          <div className="h-full px-6 flex items-center justify-between gap-4">
            {/* Left Section - Breadcrumb & Search */}
            <div className="flex items-center gap-4 flex-1">
              {/* Breadcrumb */}
              <nav className="hidden lg:flex items-center text-sm">
                <a href="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Dashboard
                </a>
                <svg className="w-4 h-4 mx-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-slate-900 font-medium">Overview</span>
              </nav>

              {/* Divider */}
              <div className="hidden lg:block w-px h-6 bg-slate-200"></div>

              {/* Search */}
              <div className="flex-1 max-w-xl">
                <div className="relative">
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
                    type="text"
                    placeholder="Search projects, tasks, or teams... (Cmd+K)"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                  />
                  <kbd className="hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-500">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Quick Actions Dropdown */}
              <div className="relative hidden md:block">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors group" aria-label="Quick actions">
                  <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors group" aria-label="Notifications">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-slate-200"></div>

              {/* User Menu */}
              <button className="flex items-center gap-3 pl-2 pr-3 py-1.5 hover:bg-slate-100 rounded-lg transition-all group">
                <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  JD
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-semibold text-slate-900 leading-none mb-0.5">John Doe</div>
                  <div className="text-xs text-slate-500 leading-none">Admin</div>
                </div>
                <svg 
                  className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors hidden lg:block" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Create New Button */}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 hover:shadow-md transition-all flex items-center gap-2 ml-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">New</span>
              </button>
            </div>
          </div>
        </header>

    );
}