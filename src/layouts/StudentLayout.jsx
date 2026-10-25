import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function StudentLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar
        role="student"
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onHelpClick={() => {
          setMobileMenuOpen(false);
          navigate("/student/help");
        }}
      />
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line/70 bg-surface/85 px-4 py-3 backdrop-blur-lg lg:hidden">
        <h1 className="text-xl font-extrabold tracking-tight">
          Class<span className="text-brand">Sphere</span>
        </h1>
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-controls="mobile-navigation"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-card text-ink shadow-sm transition hover:bg-soft"
        >
          <Menu size={20} />
        </button>
      </header>
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-7 sm:py-6">
        <Outlet />
      </main>
    </div>
  );
}