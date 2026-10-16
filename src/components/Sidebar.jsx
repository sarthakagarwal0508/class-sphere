import { NavLink } from "react-router-dom";
import { linksByRole } from "../data/navLinks";

export default function Sidebar({ role = "student" }) {
  const links = linksByRole[role] ?? [];

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-card p-3 lg:flex">
      <h1 className="px-3 py-3 text-xl font-extrabold">
        Class<span className="text-logo">Sphere</span>
      </h1>

      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
        {links.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                isActive ? "bg-brand text-on-brand" : "text-muted hover:bg-soft"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-3 shrink-0 rounded-2xl bg-panel p-3 text-center text-white">
        <p className="text-xs font-bold">Help center</p>
        <p className="mt-0.5 text-xs text-white/80">Have a problem? Send us a message.</p>
        <button className="mt-2 w-full rounded-lg bg-white py-1.5 text-xs font-bold text-on-brand">
          Go to help center
        </button>
      </div>
    </aside>
  );
}