import { Search, Bell } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Topbar({ title, subtitle }) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden w-72 items-center gap-2 rounded-xl border border-line bg-card px-3 py-2 sm:flex">
          <Search size={15} className="text-muted" />
          <input
            className="w-full bg-transparent text-xs outline-none"
            placeholder="Search for classes, tasks, etc..."
          />
        </div>

        <ThemeToggle />

        <button className="relative rounded-xl border border-line bg-card p-2.5">
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
}