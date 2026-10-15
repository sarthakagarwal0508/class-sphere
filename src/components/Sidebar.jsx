import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  HelpCircle,
  Layers,
  BarChart3,
} from 'lucide-react'

const links = [
  { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { name: 'My Classes', path: '/student/classes', icon: BookOpen },
  { name: 'Study Material', path: '/student/material', icon: FileText },
  { name: 'Assignments', path: '/student/assignments', icon: ClipboardList },
  { name: 'Quizzes', path: '/student/quizzes', icon: HelpCircle },
  { name: 'Flashcards', path: '/student/flashcards', icon: Layers },
  { name: 'Progress', path: '/student/progress', icon: BarChart3 },
]

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 p-5 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">ClassSphere</h1>

      <nav className="flex flex-col gap-2">
        {links.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                isActive
                  ? 'bg-yellow-300 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar