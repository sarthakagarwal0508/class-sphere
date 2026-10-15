import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function StudentLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default StudentLayout