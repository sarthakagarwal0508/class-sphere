import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Search, Menu, Sun, Moon
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import PortalBackButton from '../components/PortalBackButton';

export default function TeacherLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-surface text-ink flex font-sans antialiased selection:bg-amber-300 transition-colors duration-200">
      <Sidebar
        role="teacher"
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onHelpClick={() => window.alert('Support chat opened!')}
      />

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
          <div className="mb-4">
            <PortalBackButton fallbackPath="/teacher/dashboard" />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
