import CourseCard from '../../components/CourseCard'
import { courses } from '../../data/courses'

function StudentDashboard() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">My Courses</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

export default StudentDashboard