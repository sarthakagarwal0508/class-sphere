import { useEffect, useState } from "react";
import { ClipboardList, Clock, Check } from "lucide-react";

import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Tabs from "../../components/Tabs";
import Card from "../../components/Card";
import AssignmentCard from "../../components/AssignmentCard";
import ProgressRing from "../../components/ProgressRing";
import Loader from "../../components/Loader";
import {
  fetchMyClassrooms,
} from "../../services/classroomService";
import { getClassroomAssignments } from "../../services/assignmentService";
import { daysLeft, daysLeftLabel } from "../../utils/date";

const tabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "submitted", label: "Submitted" },
  { key: "graded", label: "Graded" },
];

function normalizeAssignment(assignment, classroom) {
  const dueDate = assignment.dueDate
    ? new Date(assignment.dueDate)
    : null;
  const validDueDate =
    dueDate && !Number.isNaN(dueDate.getTime()) ? dueDate : null;
  const id = assignment._id ?? assignment.id;

  return {
    ...assignment,
    id,
    title: assignment.title ?? "Assignment",
    shortTitle: assignment.shortTitle ?? assignment.title ?? "Assignment",
    course:
      classroom.name ?? classroom.title ?? assignment.classroom?.name ?? "Classroom",
    description: assignment.description ?? assignment.instructions ?? "",
    dueDate: validDueDate ? validDueDate.toISOString().slice(0, 10) : "",
    due: validDueDate
      ? `${new Intl.DateTimeFormat(undefined, { day: "numeric" }).format(validDueDate)} ${new Intl.DateTimeFormat(undefined, { month: "short" }).format(validDueDate)}`
      : "No due date",
    marks: assignment.maxMarks ?? assignment.marks ?? 0,
    status: ["pending", "submitted", "graded"].includes(assignment.status)
      ? assignment.status
      : "pending",
  };
}

export default function Assignments() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [reloadKey, setReloadKey] = useState(0);
  const [tab, setTab] = useState("all");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let ignore = false;

    fetchMyClassrooms()
      .then((classrooms) =>
        Promise.all(
          classrooms.map(async (classroom) => {
            const classroomId = classroom._id ?? classroom.id;
            const assignments = await getClassroomAssignments(classroomId);
            return assignments.map((assignment) =>
              normalizeAssignment(assignment, classroom)
            );
          })
        )
      )
      .then((groups) => {
        if (ignore) return;
        setItems(groups.flat());
        setStatus("ready");
      })
      .catch((error) => {
        if (!ignore) {
          setStatus("error");
          setNotice(error.message || "Could not load your assignments.");
        }
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const retry = () => {
    setStatus("loading");
    setReloadKey((k) => k + 1);
  };

  // Derived data: state mein alag se save nahi karte
  const pending = items
    .filter((a) => a.status === "pending")
    .sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dateA - dateB;
    });
  const visible = items.filter((a) => tab === "all" || a.status === tab);
  const done = items.length - pending.length;

  return (
    <div className="space-y-5">
      <Topbar title="Assignments" subtitle="Review classroom work and due dates" />

      <HeroBanner
        variant="navy"
        title="Stay on top of deadlines"
        subtitle="Review your class assignments and keep track of upcoming deadlines."
        buttonText="View calendar"
        icons={[ClipboardList, Clock, Check]}
      />

      {status === "loading" && <Loader label="Loading assignments..." />}

      {status === "error" && (
        <Card className="p-5 text-center">
          <p className="text-sm font-semibold">{notice || "Could not load your assignments."}</p>
          <button
            onClick={retry}
            className="mt-3 rounded-lg bg-brand px-4 py-2 text-xs font-bold text-on-brand"
          >
            Try again
          </button>
        </Card>
      )}

      {status === "ready" && (
        <div className="grid gap-5 min-[1100px]:grid-cols-[minmax(0,1fr)_16rem]">
          {/* Left: tabs, list, submit form */}
          <div className="space-y-4">
            <Tabs tabs={tabs} active={tab} onChange={setTab} />

            <div className="space-y-2">
              {visible.length === 0 && (
                <p className="py-6 text-center text-sm text-muted">Nothing here yet.</p>
              )}
              {visible.map((a) => (
                <AssignmentCard key={a.id} assignment={a} />
              ))}
            </div>

            <Card className="p-4 text-sm text-muted">
              Assignment submission is not connected yet; the provided API list
              does not include a student submission endpoint.
            </Card>
          </div>

          {/* Right: completion + upcoming deadlines */}
          <aside className="space-y-4 min-[1100px]:self-start">
            <Card className="p-4 text-center">
              <h2 className="text-base font-extrabold">Completion</h2>
              <div className="mt-3 flex justify-center">
                <ProgressRing done={done} total={items.length} />
              </div>
              <p className="mt-3 text-xs text-muted">Assignments done</p>
            </Card>

            <Card className="p-4">
              <h2 className="text-base font-extrabold">Upcoming deadlines</h2>

              {pending.length === 0 && (
                <p className="mt-2 text-xs text-muted">No upcoming deadlines.</p>
              )}

              <div className="mt-3 space-y-3">
                {pending.map((a) => {
                  const [day, month] = a.due.split(" ");
                  const days = a.dueDate ? daysLeft(a.dueDate) : null;

                  return (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className="w-9 shrink-0 text-base font-extrabold leading-tight">
                        <div>{day}</div>
                        <div>{month}</div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-tight">{a.shortTitle}</p>
                        <p
                          className={`text-xs ${
                            days !== null && days < 0
                              ? "font-semibold text-tone-red-fg"
                              : "text-muted"
                          }`}
                        >
                          {days === null ? "No due date" : daysLeftLabel(days)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}