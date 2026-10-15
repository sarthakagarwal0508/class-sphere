import { Routes, Route, Navigate } from 'react-router-dom'
import StudentLayout from './layouts/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/dashboard" />} />
      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
      </Route>
    </Routes>
  )
}

export default App