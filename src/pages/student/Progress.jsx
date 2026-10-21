
import { useMemo } from "react";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
} from "lucide-react";

import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Card from "../../components/Card";

import {
  courses,
  assignments,
  continueLearning,
} from "../../data/mockData";

export default function Progress() {
  const overallProgress = useMemo(() => {
    if (!courses.length) return 0;

    return Math.round(
      courses.reduce(
        (total, course) => total + course.progress,
        0
      ) / courses.length
    );
  }, []);

  const completedCourses = courses.filter(
    (course) => course.progress === 100
  ).length;

  const submittedAssignments = assignments.filter(
    (assignment) =>
      ["submitted", "graded"].includes(assignment.status)
  ).length;

  const pendingAssignments = assignments.filter(
    (assignment) => assignment.status === "pending"
  ).length;

  const completedLessons = continueLearning.lesson;
  const totalLessons = continueLearning.totalLessons;

  const lessonProgress = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <Topbar
        title="My Progress"
        subtitle="Track your learning journey and achievements"
      />

      <HeroBanner
        variant="navy"
        title="Look how far you've come!"
        subtitle="Keep learning, stay consistent, and move closer to your goals."
        icons={[TrendingUp, Target, BookOpen]}
      />

      {/* Overall progress */}
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted">Overall progress</p>
            <BarChart3 size={19} />
          </div>

          <p className="mt-3 text-3xl font-extrabold">
            {overallProgress}%
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-soft">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted">Courses completed</p>
            <BookOpen size={19} />
          </div>

          <p className="mt-3 text-3xl font-extrabold">
            {completedCourses}/{courses.length}
          </p>

          <p className="mt-2 text-xs text-muted">
            Courses at 100% progress
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted">Work submitted</p>
            <CheckCircle2 size={19} />
          </div>

          <p className="mt-3 text-3xl font-extrabold">
            {submittedAssignments}/{assignments.length}
          </p>

          <p className="mt-2 text-xs text-muted">
            Submitted or graded assignments
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted">Pending work</p>
            <Clock size={19} />
          </div>

          <p className="mt-3 text-3xl font-extrabold">
            {pendingAssignments}
          </p>

          <p className="mt-2 text-xs text-muted">
            Assignments awaiting submission
          </p>
        </Card>
      </section>

      {/* Course progress */}
      <section>
        <div className="mb-3">
          <h2 className="text-lg font-extrabold">
            Course-wise progress
          </h2>

          <p className="mt-1 text-sm text-muted">
            See how much you've progressed in each course.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold">
                    {course.name}
                  </h3>

                  <p className="mt-1 text-xs text-muted">
                    {course.teacher}
                  </p>

                  <p className="mt-2 text-xs text-muted">
                    {course.tag}
                  </p>
                </div>

                <span
                  className={`rounded-lg px-2 py-1 text-xs font-bold ${
                    course.progress === 100
                      ? "bg-tone-green text-tone-green-fg"
                      : "bg-brand-soft"
                  }`}
                >
                  {course.progress === 100
                    ? "Completed"
                    : "In progress"}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-muted">
                  Course completion
                </span>

                <span className="text-lg font-extrabold">
                  {course.progress}%
                </span>
              </div>

              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-soft"
                role="progressbar"
                aria-label={`${course.name} completion`}
                aria-valuenow={course.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <div className="mt-4 flex justify-between gap-2 text-xs text-muted">
                <span>{course.assignments} assignments</span>
                <span>{course.quizzes} quizzes</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Current learning */}
      <section>
        <h2 className="mb-3 text-lg font-extrabold">
          Learning in progress
        </h2>

        <Card className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft">
              <BookOpen size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-extrabold">
                {continueLearning.title}
              </p>

              <p className="mt-1 text-sm text-muted">
                {continueLearning.course}
              </p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-soft">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${lessonProgress}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between gap-2 text-xs text-muted">
                <span>
                  Lesson {completedLessons} of {totalLessons}
                </span>

                <span>{lessonProgress}%</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Assignment overview */}
      <section>
        <h2 className="mb-3 text-lg font-extrabold">
          Assignment overview
        </h2>

        <Card className="overflow-hidden">
          <div className="divide-y divide-line">
            {assignments.map((assignment) => {
              const isGraded = assignment.status === "graded";
              const isSubmitted =
                assignment.status === "submitted";

              return (
                <div
                  key={assignment.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold">
                      {assignment.title}
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      {assignment.course}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {isGraded && (
                      <span className="text-sm font-bold">
                        {assignment.score}/{assignment.marks} marks
                      </span>
                    )}

                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                        isGraded
                          ? "bg-tone-green text-tone-green-fg"
                          : isSubmitted
                          ? "bg-brand-soft"
                          : "bg-tone-yellow text-tone-yellow-fg"
                      }`}
                    >
                      {isGraded
                        ? "Graded"
                        : isSubmitted
                        ? "Submitted"
                        : "Pending"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </div>
  );
}
