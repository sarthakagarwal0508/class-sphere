import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function StudentLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar role="student" />
      <main className="min-w-0 flex-1 px-7 py-6">
        <Outlet />
      </main>
    </div>
  );
}