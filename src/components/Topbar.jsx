import { Search, Bell } from 'lucide-react'

function Topbar() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">Hello, Student 👋</h2>
        <p className="text-sm text-gray-500">Let's learn something new today!</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-72">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search for classes, tasks, etc..."
            className="outline-none text-sm w-full bg-transparent"
          />
        </div>

        <button className="relative bg-white border border-gray-200 rounded-xl p-2.5">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  )
}

export default Topbar