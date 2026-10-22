
import { useState } from "react";
import {
  Award,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Card from "../../components/Card";

const courses = [
  { id: 1, name: "Data Structures", code: "CS201" },
  { id: 2, name: "Database Systems", code: "CS202" },
  { id: 3, name: "Web Development", code: "CS203" },
];

const grades = [
  {
    id: 1,
    title: "Portfolio Website",
    course: "Web Development",
    type: "Assignment",
    score: 22,
    total: 25,
    date: "Demo result",
  },
  {
    id: 2,
    title: "Normalization Quiz",
    course: "Database Systems",
    type: "Quiz",
    score: 16,
    total: 20,
    date: "Demo result",
  },
  {
    id: 3,
    title: "Linked List Quiz",
    course: "Data Structures",
    type: "Quiz",
    score: 18,
    total: 20,
    date: "Demo result",
  },
  {
    id: 4,
    title: "SQL Practice",
    course: "Database Systems",
    type: "Assignment",
    score: 19,
    total: 20,
    date: "Demo result",
  },
  {
    id: 5,
    title: "React Components",
    course: "Web Development",
    type: "Assignment",
    score: 17,
    total: 20,
    date: "Demo result",
  },
];

const filters = ["All Results", "Assignments", "Quizzes"];

export default function Grades() {
  const [activeFilter, setActiveFilter] = useState("All Results");

  const totalScored = grades.reduce(
    (sum, item) => sum + item.score,
    0
  );

  const totalMarks = grades.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const average = totalMarks
    ? Math.round((totalScored / totalMarks) * 100)
    : 0;

  const filteredGrades = grades.filter((item) => {
    if (activeFilter === "Assignments") {
      return item.type === "Assignment";
    }

    if (activeFilter === "Quizzes") {
      return item.type === "Quiz";
    }

    return true;
  });

  const coursePerformance = courses.map((course) => {
    const items = grades.filter(
      (item) => item.course === course.name
    );

    const scored = items.reduce(
      (sum, item) => sum + item.score,
      0
    );

    const total = items.reduce(
      (sum, item) => sum + item.total,
      0
    );

    return {
      ...course,
      scored,
      total,
      percentage: total
        ? Math.round((scored / total) * 100)
        : 0,
      count: items.length,
    };
  });

  return (
    <div className="space-y-5">
      <Topbar
        title="My Grades"
        subtitle="Track your academic progress and results"
      />

      <HeroBanner
        variant="navy"
        title="Every effort counts"
        subtitle="Review your scores, monitor course performance, and keep improving."
        icons={[Award, TrendingUp, BookOpen]}
      />

<section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Overall score</p>
            <Award size={19} />
          </div>
          <p className="mt-3 text-3xl font-extrabold">
            {average}%
          </p>
          <p className="mt-1 text-xs text-muted">
            Across all demo results
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Graded items</p>
            <CheckCircle2 size={19} />
          </div>
          <p className="mt-3 text-3xl font-extrabold">
            {grades.length}
          </p>
          <p className="mt-1 text-xs text-muted">
            Assignments and quizzes
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Total marks</p>
            <ClipboardList size={19} />
          </div>
          <p className="mt-3 text-3xl font-extrabold">
            {totalScored}/{totalMarks}
          </p>
          <p className="mt-1 text-xs text-muted">
            Marks earned
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Courses</p>
            <BookOpen size={19} />
          </div>
          <p className="mt-3 text-3xl font-extrabold">
            {courses.length}
          </p>
          <p className="mt-1 text-xs text-muted">
            With course summaries
          </p>
        </Card>
      </section>

<section>
        <h2 className="text-lg font-extrabold">
          Course performance
        </h2>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {coursePerformance.map((course) => (
            <Card key={course.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold">{course.name}</p>
                  <p className="mt-1 text-xs text-muted">
                    {course.code}
                  </p>
                </div>

                <span className="rounded-lg bg-brand-soft px-2 py-1 text-xs font-bold">
                  {course.count} items
                </span>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <p className="text-2xl font-extrabold">
                  {course.percentage}%
                </p>
                <p className="text-xs text-muted">
                  {course.scored}/{course.total} marks
                </p>
              </div>

              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-soft"
                role="progressbar"
                aria-label={`${course.name} score`}
                aria-valuenow={course.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${course.percentage}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      </section>

<section>
        <h2 className="text-lg font-extrabold">
          Grade history
        </h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                activeFilter === filter
                  ? "bg-brand text-on-brand"
                  : "border border-line bg-card hover:bg-soft"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <Card className="mt-3 overflow-hidden">
          {filteredGrades.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted">
              No results available.
            </p>
          ) : (
            <div className="divide-y divide-line">
              {filteredGrades.map((item) => {
                const percentage = Math.round(
                  (item.score / item.total) * 100
                );

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p className="mt-1 text-xs text-muted">
                        {item.course} · {item.type} · {item.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold">
                        {item.score}/{item.total}
                      </span>

                      <span
                        className={`min-w-16 rounded-lg px-2 py-1 text-center text-xs font-extrabold ${
                          percentage >= 80
                            ? "bg-tone-green text-tone-green-fg"
                            : percentage >= 60
                            ? "bg-tone-yellow text-tone-yellow-fg"
                            : "bg-tone-red text-tone-red-fg"
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </section>

      <p className="text-xs text-muted">
        These are sample frontend grades. Connect your grades API
        to display actual student results.
      </p>
    </div>
  );
}
