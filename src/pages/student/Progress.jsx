import { useEffect, useState } from "react";
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
import { fetchMyClassrooms } from "../../services/classroomService";
import {
  getStudentClassroomAnalytics,
  getStudentOverview,
} from "../../services/analyticsService";

export default function Progress() {
  const [overview, setOverview] = useState(null);
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([fetchMyClassrooms(), getStudentOverview()])
      .then(async ([classrooms, studentOverview]) => {
        const results = await Promise.all(classrooms.map(async (classroom) => ({
          classroom,
          analytics: await getStudentClassroomAnalytics(classroom._id ?? classroom.id),
        })));
        if (!active) return;
        setOverview(studentOverview);
        setCourses(results.map(({ classroom, analytics }) => {
          const assignments = analytics?.assignments ?? [];
          const total = analytics?.totalAssignments ?? assignments.length;
          const completed = analytics?.completedAssignments ?? 0;
          return {
            id: classroom._id ?? classroom.id,
            name: classroom.name ?? classroom.title ?? "Classroom",
            teacher: classroom.teacher?.name ?? classroom.owner?.name ?? "Teacher",
            tag: classroom.subject ?? classroom.semesterSection ?? "Classroom",
            assignments,
            total,
            completed,
            percentage: total ? Math.round((completed / total) * 100) : 0,
          };
        }));
        setStatus("ready");
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError.message || "Could not load your progress.");
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  const totalAssignments = overview?.totalAssignments ?? 0;
  const completedAssignments = overview?.completedAssignments ?? 0;
  const pendingAssignments = overview?.pendingAssignments ?? 0;
  const completion = totalAssignments
    ? Math.round((completedAssignments / totalAssignments) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <Topbar title="My Progress" subtitle="Track your assignment activity and graded work" />
      <HeroBanner
        variant="navy"
        title="Look how far you've come!"
        subtitle="See your assignment completion across enrolled classes."
        icons={[TrendingUp, Target, BookOpen]}
      />

      {status === "loading" && <Card className="p-5 text-sm text-muted">Loading your progress...</Card>}
      {status === "error" && <Card role="alert" className="p-5 text-sm text-tone-red-fg">{error}</Card>}

      {status === "ready" && (
        <>
          <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center justify-between gap-2"><p className="text-sm text-muted">Assignments completed</p><BarChart3 size={19} /></div>
              <p className="mt-3 text-3xl font-extrabold">{completion}%</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-soft"><div className="h-full rounded-full bg-brand" style={{ width: `${completion}%` }} /></div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between gap-2"><p className="text-sm text-muted">Classes</p><BookOpen size={19} /></div>
              <p className="mt-3 text-3xl font-extrabold">{overview?.totalClassrooms ?? courses.length}</p>
              <p className="mt-2 text-xs text-muted">Enrolled classrooms</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between gap-2"><p className="text-sm text-muted">Work submitted</p><CheckCircle2 size={19} /></div>
              <p className="mt-3 text-3xl font-extrabold">{completedAssignments}/{totalAssignments}</p>
              <p className="mt-2 text-xs text-muted">Submitted or graded assignments</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between gap-2"><p className="text-sm text-muted">Pending work</p><Clock size={19} /></div>
              <p className="mt-3 text-3xl font-extrabold">{pendingAssignments}</p>
              <p className="mt-2 text-xs text-muted">Assignments awaiting submission</p>
            </Card>
          </section>

          <section>
            <div className="mb-3">
              <h2 className="text-lg font-extrabold">Class-wise assignment progress</h2>
              <p className="mt-1 text-sm text-muted">Completion is based on submitted or graded assignments.</p>
            </div>
            {courses.length === 0 ? (
              <Card className="p-5 text-sm text-muted">Join a classroom to see your progress.</Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <Card key={course.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold">{course.name}</h3>
                        <p className="mt-1 text-xs text-muted">{course.teacher}</p>
                        <p className="mt-2 text-xs text-muted">{course.tag}</p>
                      </div>
                      <span className="rounded-lg bg-brand-soft px-2 py-1 text-xs font-bold">
                        {course.completed}/{course.total}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-sm text-muted">Completion</span>
                      <span className="text-lg font-extrabold">{course.percentage}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-soft">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${course.percentage}%` }} />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-extrabold">Assignment overview</h2>
            <Card className="overflow-hidden">
              {courses.every((course) => course.assignments.length === 0) ? (
                <p className="p-5 text-sm text-muted">No assignments have been shared yet.</p>
              ) : (
                <div className="divide-y divide-line">
                  {courses.flatMap((course) => course.assignments.map((assignment) => (
                    <div key={assignment.assignmentId} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-bold">{assignment.title ?? "Assignment"}</p>
                        <p className="mt-1 text-xs text-muted">{course.name}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {assignment.status === "graded" && (
                          <span className="text-sm font-bold">{assignment.marksObtained}/{assignment.maxMarks} marks</span>
                        )}
                        <span className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize ${
                          assignment.status === "graded"
                            ? "bg-tone-green text-tone-green-fg"
                            : assignment.status === "submitted"
                              ? "bg-brand-soft"
                              : "bg-tone-yellow text-tone-yellow-fg"
                        }`}>
                          {assignment.status ?? "pending"}
                        </span>
                      </div>
                    </div>
                  )))}
                </div>
              )}
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
