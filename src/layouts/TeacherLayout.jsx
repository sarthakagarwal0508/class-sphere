import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Plus, Users, Upload, FileText, FileCheck2, HelpCircle,
  Award, BarChart2, Bell, MessageSquare, Search, Menu, X, Sun, Moon
} from 'lucide-react';

export default function TeacherLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
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

  const toggleTheme = () => setIsDark(prev => !prev);

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
    <div className="min-h-screen bg-surface text-ink flex font-sans antialiased selection:bg-amber-300 transition-colors duration-200">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1c1a32] border-r border-[#262344] flex flex-col justify-between p-5 text-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <div onClick={() => navigate('/teacher/dashboard')} className="flex items-center gap-1 cursor-pointer font-extrabold text-2xl tracking-tight text-white">
              <span>Class<span className="text-[#fde047]">Sphere</span></span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1 rounded-md text-slate-400 hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink key={item.name} to={item.path} onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${isActive ? 'bg-[#fde047] text-slate-900 shadow-md shadow-amber-500/20' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="bg-[#262344]/80 border border-white/10 rounded-2xl p-4 text-center space-y-2 mt-6">
          <p className="text-xs font-bold text-white">Help center</p>
          <p className="text-[11px] text-slate-300 leading-tight">Have a problem? Send us a message.</p>
          <button onClick={() => alert('Support chat opened!')} className="w-full py-2.5 px-3 rounded-xl bg-[#f1f3f9] hover:bg-white text-slate-900 text-xs font-bold shadow-sm transition-colors mt-1">
            Go to help center
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto scroll-smooth">
        <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-line px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg text-muted hover:bg-soft">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative w-56 md:w-80">
              <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
              <input type="text" placeholder="Search for classes, tasks, etc..." className="w-full bg-card border border-line rounded-xl pl-9 pr-4 py-2 text-xs text-ink placeholder-muted focus:outline-none focus:ring-1 focus:ring-amber-400" />
            </div>
            <button onClick={toggleTheme} title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"} className="p-2.5 rounded-xl bg-card border border-line text-ink hover:bg-soft transition-all shadow-xs flex items-center justify-center cursor-pointer">
              {isDark ? <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" /> : <Moon className="w-4 h-4 text-slate-700 transition-transform -rotate-12 hover:rotate-0" />}
            </button>
            <div className="flex items-center gap-2 pl-1 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#fde047] text-slate-900 flex items-center justify-center font-bold text-xs ring-2 ring-card">S</div>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 max-w-6xl w-full mx-auto dashboard-stagger">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
