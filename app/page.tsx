"use client"
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function HomePage() {
  const session = useSession();
  const router = useRouter()
  useEffect(() => {

    if (session.status === 'authenticated') {
      console.log(session.data.user)
      router.replace('/dashboard')
    }
  }, [router, session])
  return (

    <div className="overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#2563eb" />
              <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 8V16M16 16L8 20M16 16L24 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-2xl font-bold text-slate-900">DevScope</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium text-[15px] transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link href="#pricing" className="text-slate-600 hover:text-slate-900 font-medium text-[15px] transition-colors relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link href="#about" className="text-slate-600 hover:text-slate-900 font-medium text-[15px] transition-colors relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium text-[15px] transition-colors">
                Log in
              </Link>
            </li>
            <li>
              <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-[15px] hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
                Get Started
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-900" aria-label="Toggle mobile menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
        {/* Background linear */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-radial from-blue-500 via-transparent to-transparent opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm text-slate-600 mb-8 animate-fade-in-up">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L9.5 5.5L13 6L10.5 8.5L11 12L8 10L5 12L5.5 8.5L3 6L6.5 5.5L8 2Z" fill="#2563eb" />
              </svg>
              <span>Trusted by 10,000+ teams worldwide</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-400 mb-6 tracking-tight leading-tight animate-fade-in-up animation-delay-100">
              Project management built for <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">modern teams</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-slate-600 mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
              Plan, track, and ship with confidence. DevScope brings your teams, projects, and tasks together in one powerful workspace.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-300">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 text-white rounded-lg font-semibold text-base hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
                Start for free
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 3L14 10L7 17" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="#demo" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-slate-900 border border-slate-200 rounded-lg font-semibold text-base hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200">
                Watch demo
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="10" cy="10" r="8" />
                  <path d="M8 7L13 10L8 13V7Z" fill="currentColor" stroke="none" />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 pt-8 animate-fade-in-up animation-delay-400">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">50K+</div>
                <div className="text-sm text-slate-500">Active users</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
              <div className="sm:hidden w-full h-px bg-slate-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">99.9%</div>
                <div className="text-sm text-slate-500">Uptime</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
              <div className="sm:hidden w-full h-px bg-slate-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">4.9/5</div>
                <div className="text-sm text-slate-500">User rating</div>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto mt-16 animate-fade-in-up animation-delay-500">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:-translate-y-1">
              {/* Preview Header */}
              <div className="px-6 py-4 bg-slate-100 border-b border-slate-200">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                  <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                  <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                </div>
              </div>
              {/* Preview Content */}
              <div className="flex flex-col md:flex-row p-8 gap-8 min-h-96">
                {/* Sidebar */}
                <div className="w-full md:w-48 flex flex-col gap-3">
                  <div className="h-10 bg-blue-600/20 rounded-lg animate-pulse-subtle"></div>
                  <div className="h-10 bg-slate-200 rounded-lg animate-pulse-subtle animation-delay-100"></div>
                  <div className="h-10 bg-slate-200 rounded-lg animate-pulse-subtle animation-delay-200"></div>
                  <div className="h-10 bg-slate-200 rounded-lg animate-pulse-subtle animation-delay-300"></div>
                </div>
                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="h-20 bg-slate-200 rounded-lg animate-slide-in-right animation-delay-100"></div>
                  <div className="h-20 bg-slate-200 rounded-lg animate-slide-in-right animation-delay-200"></div>
                  <div className="h-20 bg-slate-200 rounded-lg animate-slide-in-right animation-delay-300"></div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="hidden lg:block absolute top-1/4 -right-8 xl:-right-16 bg-white border border-slate-200 rounded-xl shadow-lg px-6 py-4 animate-float">
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2563eb" strokeWidth="2">
                  <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" />
                </svg>
                <span className="text-sm font-medium text-slate-600">Task completed</span>
              </div>
            </div>
            <div className="hidden lg:block absolute bottom-1/4 -left-8 xl:-left-16 bg-white border border-slate-200 rounded-xl shadow-lg px-6 py-4 animate-float animation-delay-1500">
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2563eb" strokeWidth="2">
                  <path d="M12 8C12 9.10457 11.1046 10 10 10C8.89543 10 8 9.10457 8 8C8 6.89543 8.89543 6 10 6C11.1046 6 12 6.89543 12 8Z" />
                  <path d="M6 16C6 13.7909 7.79086 12 10 12C12.2091 12 14 13.7909 14 16" />
                </svg>
                <span className="text-sm font-medium text-slate-600">New member joined</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Everything you need to ship faster
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Powerful features that scale with your team. From startups to enterprises.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-600 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Kanban boards</h3>
              <p className="text-slate-600 leading-relaxed">
                Visualize your workflow with intuitive drag-and-drop boards. Move tasks seamlessly across stages.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-600 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" />
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Team collaboration</h3>
              <p className="text-slate-600 leading-relaxed">
                Work together in real-time. Assign tasks, mention teammates, and stay in sync across your organization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-600 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Lightning fast</h3>
              <p className="text-slate-600 leading-relaxed">
                Built for speed. Navigate projects, search tasks, and update statuses instantly with our optimized interface.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-600 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Enterprise security</h3>
              <p className="text-slate-600 leading-relaxed">
                Bank-level encryption, SSO support, and role-based permissions. Your data is protected at every level.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-600 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Analytics & insights</h3>
              <p className="text-slate-600 leading-relaxed">
                Track team velocity, identify bottlenecks, and make data-driven decisions with powerful analytics.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-600 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6V12L16 14" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Time tracking</h3>
              <p className="text-slate-600 leading-relaxed">
                Monitor time spent on tasks and projects. Generate reports for billing and productivity analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500 mb-12">
            Trusted by leading teams worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-60">
            <div className="text-2xl font-bold text-slate-800">TechCorp</div>
            <div className="text-2xl font-bold text-slate-800">InnovateLabs</div>
            <div className="text-2xl font-bold text-slate-800">DesignHub</div>
            <div className="text-2xl font-bold text-slate-800">BuildFast</div>
            <div className="text-2xl font-bold text-slate-800">CloudScale</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Loved by teams everywhere
            </h2>
            <p className="text-lg text-slate-600">
              See what our customers have to say about DevScope
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow duration-300">
              <div className="flex gap-1 mb-4">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                "DevScope completely transformed how our team collaborates. We've seen a 40% increase in productivity since switching."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Sarah Mitchell</div>
                  <div className="text-sm text-slate-500">Product Manager at TechCorp</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow duration-300">
              <div className="flex gap-1 mb-4">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                "The best project management tool we've used. Clean interface, powerful features, and excellent support team."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  JC
                </div>
                <div>
                  <div className="font-semibold text-slate-900">James Chen</div>
                  <div className="text-sm text-slate-500">CTO at InnovateLabs</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow duration-300">
              <div className="flex gap-1 mb-4">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                "Switching to DevScope was a game-changer. Our remote team now stays perfectly aligned on all projects."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  ER
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Emily Rodriguez</div>
                  <div className="text-sm text-slate-500">CEO at DesignHub</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-linear-to-br from-blue-600 to-blue-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of teams already using DevScope to build better products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/register" className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-blue-600 rounded-lg font-semibold text-base hover:bg-slate-50 hover:-translate-y-0.5 transition-all duration-200">
              Get started free
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-7 py-3.5 bg-transparent text-white border-2 border-white/30 rounded-lg font-semibold text-base hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5 transition-all duration-200">
              Talk to sales
            </Link>
          </div>
          <p className="text-sm text-blue-100">
            No credit card required · Free 14-day trial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="8" fill="#2563eb" />
                  <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 8V16M16 16L8 20M16 16L24 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-2xl font-bold text-slate-900">DevScope</span>
              </Link>
              <p className="text-slate-600 leading-relaxed mb-6 max-w-sm">
                The modern project management platform that helps teams plan, track, and deliver exceptional work.
              </p>
              <div className="flex gap-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg flex items-center justify-center text-slate-600 transition-all duration-200" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg flex items-center justify-center text-slate-600 transition-all duration-200" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg flex items-center justify-center text-slate-600 transition-all duration-200" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg flex items-center justify-center text-slate-600 transition-all duration-200" aria-label="YouTube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 9.71a8.5 8.5 0 00-.91-4.13 2.92 2.92 0 00-1.72-1C18.88 4 12 4 12 4s-6.88 0-8.37.58a2.92 2.92 0 00-1.72 1 8.5 8.5 0 00-.91 4.13v2.58a8.5 8.5 0 00.91 4.13 2.92 2.92 0 001.72 1C5.12 18 12 18 12 18s6.88 0 8.37-.58a2.92 2.92 0 001.72-1 8.5 8.5 0 00.91-4.13V9.71zM9.75 14.85V8.15l5.5 3.35-5.5 3.35z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links - Product */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-5">Product</h4>
              <ul className="space-y-3.5">
                <li><Link href="#features" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">Features</Link></li>
                <li><Link href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">Pricing</Link></li>
                <li><Link href="#integrations" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">Integrations</Link></li>
                <li><Link href="#updates" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">Updates</Link></li>
                <li><Link href="#roadmap" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">Roadmap</Link></li>
              </ul>
            </div>

            {/* Links - Company */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-5">Company</h4>
              <ul className="space-y-3.5">
                <li><Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">About Us</Link></li>
                <li><Link href="/blog" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">Blog</Link></li>
                <li><Link href="/careers" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">Careers</Link></li>
                <li><Link href="/customers" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">Customers</Link></li>
                <li><Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">Contact</Link></li>
              </ul>
            </div>

            {/* Links - Resources */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-5">Resources</h4>
              <ul className="space-y-3.5">
                <li><Link href="/help" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">Help Center</Link></li>
                <li><Link href="/guides" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">Guides</Link></li>
                <li><Link href="/api" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">API Docs</Link></li>
                <li><Link href="/community" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">Community</Link></li>
                <li><Link href="/status" className="text-slate-600 hover:text-blue-600 transition-colors text-[15px] hover:translate-x-1 inline-block">Status</Link></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              &copy; 2024 DevScope, Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-slate-600 hover:text-blue-600 transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-slate-600 hover:text-blue-600 transition-colors">Cookie Policy</Link>
              <Link href="/security" className="text-slate-600 hover:text-blue-600 transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}