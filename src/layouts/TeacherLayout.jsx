import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Plus,
  Users,
  Upload,
  FileText,
  FileCheck2,
  HelpCircle,
  Award,
  BarChart2,
  Bell,
  MessageSquare,
  Search,
  BookOpen,
  Menu,
  X
} from 'lucide-react';

export default function TeacherLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Create Classroom', path: '/teacher/create-classroom', icon: Plus },
    { name: 'Members', path: '/teacher/members', icon: Users },
    { name: 'Upload Material', path: '/teacher/upload-material', icon: Upload },
    { name: 'Create Assignment', path: '/teacher/create-assignment', icon: FileText },
    { name: 'Submissions', path: '/teacher/submissions', icon: FileCheck2 },
    { name: 'Create Quiz', path: '/teacher/create-quiz', icon: HelpCircle },
    { name: 'Quiz Results', path: '/teacher/quiz-results', icon: Award },
    { name: 'Analytics', path: '/teacher/analytics', icon: BarChart2 },
    { name: 'Announcements', path: '/teacher/announcements', icon: Bell },
    { name: 'Doubt Forum', path: '/teacher/doubt-forum', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 flex font-sans antialiased selection:bg-amber-300">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#fbfbf9] border-r border-[#eceee8] flex flex-col justify-between p-5 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div 
              onClick={() => navigate('/teacher/dashboard')} 
              className="flex items-center gap-2 cursor-pointer font-extrabold text-xl tracking-tight text-slate-900"
            >
              <span>Class<span className="text-[#eab308]">Sphere</span></span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="lg:hidden p-1 rounded-md text-slate-500 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#fde047] text-slate-900 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Help Center Card */}
        <div className="bg-[#181829] rounded-2xl p-4 text-white space-y-2 mt-6">
          <p className="text-xs font-semibold text-slate-200">Help center</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Have a problem? Send us a message.
          </p>
          <button
            onClick={() => alert('Support chat opened!')}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold transition-colors mt-1"
          >
            Go to help center
          </button>
        </div>
      </aside>

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-[#fbfbf9]/80 backdrop-blur-md border-b border-[#eceee8] px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative w-64 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search for classes, tasks, etc..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#fde047] text-slate-900 flex items-center justify-center font-bold text-xs ring-2 ring-white">
                S
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
      <main className="p-6 md:p-8 max-w-6xl w-full mx-auto dashboard-stagger">
  <Outlet />
        </main>
      </div>
    </div>
  );
}