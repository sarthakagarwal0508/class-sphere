function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      <h4 className="font-bold">{course.name}</h4>
      <p className="text-sm text-gray-500 mb-3">{course.teacher}</p>

      <div className="flex gap-4 text-xs text-gray-600 mb-3">
        <span>📝 {course.assignments} Assignments</span>
        <span>❓ {course.quizzes} Quizzes</span>
      </div>

      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-2">
        <div
          className="h-1.5 bg-gray-900 rounded-full"
          style={{ width: `${course.progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500">
        Completed: <span className="font-semibold text-green-600">{course.progress}%</span>
      </p>
    </div>
  )
}

export default CourseCard