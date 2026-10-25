import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Plus, Users, Upload, FileText, 
  FileCheck2, HelpCircle, Award, BarChart3, Bell, 
  MessageSquare, Sun, Moon, Search, LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TeacherLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // 🌓 Light/Dark Theme Engine
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleLogout = async () => {
    try {
      if (typeof logout === 'function') {
        await logout();
      }
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      navigate('/login', { replace: true });
    }
  };

  const navLinks = [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/teacher/create-class', label: 'Create Classroom', icon: Plus },
    { to: '/teacher/members', label: 'Members', icon: Users },
    { to: '/teacher/upload-material', label: 'Upload Material', icon: Upload },
    { to: '/teacher/create-assignment', label: 'Create Assignment', icon: FileText },
    { to: '/teacher/submissions', label: 'Submissions', icon: FileCheck2 },
    { to: '/teacher/create-quiz', label: 'Create Quiz', icon: HelpCircle },
    { to: '/teacher/quiz-results', label: 'Quiz Results', icon: Award },
    { to: '/teacher/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/teacher/announcements', label: 'Announcements', icon: Bell },
    { to: '/teacher/doubts', label: 'Doubt Forum', icon: MessageSquare },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'S';

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0b0b0c] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* 🌟 Sidebar */}
      <aside className="w-64 border-r border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] p-4 flex flex-col justify-between hidden md:flex shrink-0 z-20">
        <div className="space-y-6">
          {/* Brand Logo */}
          <div 
            onClick={() => navigate('/teacher/dashboard')}
            className="px-2 pt-2 cursor-pointer flex items-center gap-1 text-2xl font-black tracking-tight"
          >
            <span className="text-slate-900 dark:text-white">Class</span>
            <span className="text-[#fde047]">Sphere</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#fde047] text-slate-950 font-black shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Help Center Card & Logout */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          {/* Help Center Card */}
          <div className="p-4 rounded-2xl bg-[#181824] dark:bg-[#1a1a24] text-white space-y-2.5 text-center border border-slate-800 shadow-sm">
            <div>
              <p className="text-xs font-bold text-white">Help center</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Have a problem? Send us a message.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/teacher/help')}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-bold text-xs transition shadow-sm"
            >
              Go to help center
            </button>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-center py-1 text-xs font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search for classes, tasks, etc..." 
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-[#fde047]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Toggle Light/Dark Theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <div 
              onClick={() => navigate('/teacher/dashboard')}
              className="w-8 h-8 rounded-full bg-[#fde047] text-slate-950 font-black flex items-center justify-center text-xs shadow-sm cursor-pointer hover:scale-105 transition"
              title={user?.name || 'Teacher Profile'}
            >
              {userInitial}
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}