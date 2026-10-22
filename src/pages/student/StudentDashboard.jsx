import { useState } from "react";
import { BookOpen, ClipboardList, Award, Star } from "lucide-react";

import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import StatCard from "../../components/StatCard";
import CourseCard from "../../components/CourseCard";
import AssignmentCard from "../../components/AssignmentCard";
import ActionCard from "../../components/ActionCard";
import ProfilePanel from "../../components/ProfilePanel";
import CalendarCard from "../../components/CalendarCard";
import ScheduleCard from "../../components/ScheduleCard";
import AnnouncementCard from "../../components/AnnouncementCard";
import ReminderCard from "../../components/ReminderCard";

import {
  student,
  stats,
  continueLearning,
  courses,
  assignments,
  upNextQuiz,
  flashcardsDue,
  schedule,
  announcements,
  reminders,
} from "../../data/mockData";

const tabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

const dashboardAssignments = ["pending", "submitted", "graded"]
  .map((s) => assignments.find((a) => a.status === s))
  .filter(Boolean);

export default function StudentDashboard() {
  const [tab, setTab] = useState("all");

  const visibleCourses = courses.filter((c) => tab === "all" || c.status === tab);

  return (
    <div className="grid gap-6 min-[1100px]:grid-cols-[minmax(0,1fr)_20rem]">

      <div className="dashboard-stagger space-y-5">
        <Topbar
          title={`Hello, ${student.firstName}` }
          subtitle="Let's learn something new today!"
        />

        <HeroBanner
          variant="navy"
          eyebrow="Continue learning"
          title={continueLearning.title}
          subtitle={`${continueLearning.course}, lesson ${continueLearning.lesson} of ${continueLearning.totalLessons}`}
          buttonText="Resume lesson"
          imageUrl={continueLearning.imageUrl}
          imageAlt="Programming code on a laptop"
        />

        <section className="grid grid-cols-2 gap-3 min-[1200px]:grid-cols-4">
          <StatCard label="Courses" value={stats.courses} icon={BookOpen} tone="yellow" />
          <StatCard label="Pending work" value={stats.pendingWork} icon={ClipboardList} tone="red" />
          <StatCard label="Average score" value={`${stats.averageScore}%`} icon={Award} tone="green" />
          <StatCard label="Day streak" value={stats.dayStreak} icon={Star} tone="blue" />
        </section>

        <section>
          <h2 className="text-xl font-extrabold">My Courses</h2>

          <div className="mt-2 flex gap-4 border-b border-line">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`-mb-px border-b-2 pb-1 text-sm font-semibold ${
                  tab === t.key ? "border-ink text-ink" : "border-transparent text-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {visibleCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-extrabold">Assignments</h2>
          <div className="mt-2 space-y-2">
            {dashboardAssignments.map((a) => (
              <AssignmentCard key={a.id} assignment={a} compact />
            ))}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <ActionCard
            variant="navy"
            eyebrow={`Due ${upNextQuiz.due}, ${upNextQuiz.priority}`}
            title={upNextQuiz.title}
            description={upNextQuiz.description}
            buttonText="Start quiz"
          />
          <ActionCard
            variant="yellow"
            eyebrow={`${flashcardsDue.count} cards waiting`}
            title="Revise your flashcards"
            description="Mark how confident you feel on each card."
            buttonText="Start revising"
          />
        </section>
      </div>

<aside className="dashboard-stagger space-y-5 [scrollbar-width:thin] min-[1100px]:sticky min-[1100px]:top-6 min-[1100px]:max-h-[calc(100vh-3rem)] min-[1100px]:self-start min-[1100px]:overflow-y-auto">
        <ProfilePanel name={student.name} email={student.email} />
        <CalendarCard />
        <ScheduleCard items={schedule} />
        <AnnouncementCard items={announcements} />
        <ReminderCard items={reminders} />
      </aside>
    </div>
  );
}
