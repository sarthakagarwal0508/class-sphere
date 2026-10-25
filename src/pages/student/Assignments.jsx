import { useEffect, useState } from "react";
import { ClipboardList, Clock, Check, X } from "lucide-react";

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
import {
  getClassroomAssignments,
  getMyAssignmentSubmission,
  submitAssignment,
} from "../../services/assignmentService";
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
    submittedOn: assignment.submittedAt
      ? new Date(assignment.submittedAt).toLocaleDateString()
      : "",
    status: ["pending", "submitted", "graded"].includes(assignment.status)
      ? assignment.status
      : "pending",
  };
}

export default function Assignments() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [tab, setTab] = useState("all");
  const [notice, setNotice] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  useEffect(() => {
    let ignore = false;

    fetchMyClassrooms()
      .then((classrooms) =>
        Promise.all(
          classrooms.map(async (classroom) => {
            const classroomId = classroom._id ?? classroom.id;
            const assignments = await getClassroomAssignments(classroomId);
            return Promise.all(assignments.map(async (assignment) => {
              const submissionData = await getMyAssignmentSubmission(
                assignment._id ?? assignment.id
              );
              const submission = submissionData?.submission;
              return {
                ...normalizeAssignment(assignment, classroom),
                status: submission?.status ?? "pending",
                score: submission?.marksObtained,
                feedback: submission?.feedback ?? "",
                submittedAt: submission?.submittedAt,
                submittedOn: submission?.submittedAt
                  ? new Date(submission.submittedAt).toLocaleDateString()
                  : "",
                answerText: submission?.answerText ?? "",
                submissionUrl: submission?.submissionUrl ?? "",
              };
            }));
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

  const handleSubmitAssignment = async (event) => {
    event.preventDefault();
    if (!selectedAssignment || (!answerText.trim() && !submissionUrl.trim())) {
      setSubmissionError("Add your answer or a link to your work before submitting.");
      return;
    }

    setSubmitting(true);
    setSubmissionError("");
    try {
      await submitAssignment(selectedAssignment.id, {
        answerText: answerText.trim(),
        submissionUrl: submissionUrl.trim(),
      });
      setSelectedAssignment(null);
      setAnswerText("");
      setSubmissionUrl("");
      setStatus("loading");
      setReloadKey((key) => key + 1);
    } catch (error) {
      setSubmissionError(error.message || "Could not submit this assignment.");
    } finally {
      setSubmitting(false);
    }
  };

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

          <div className="space-y-4">
            <Tabs tabs={tabs} active={tab} onChange={setTab} />

            <div className="space-y-2">
              {visible.length === 0 && (
                <p className="py-6 text-center text-sm text-muted">Nothing here yet.</p>
              )}
              {visible.map((a) => (
                <AssignmentCard
                  key={a.id}
                  assignment={a}
                  onSubmit={setSelectedAssignment}
                />
              ))}
            </div>
          </div>

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

              {selectedAssignment && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
                  <Card
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="submit-assignment-title"
                    className="w-full max-w-xl p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 id="submit-assignment-title" className="text-lg font-extrabold">
                          Submit {selectedAssignment.title}
                        </h2>
                        <p className="mt-1 text-xs text-muted">
                          Provide written work, a link, or both.
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Close submission form"
                        onClick={() => setSelectedAssignment(null)}
                        className="rounded-lg p-2 text-muted hover:bg-soft"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <form onSubmit={handleSubmitAssignment} className="mt-4 space-y-3">
                      <label className="block space-y-1 text-sm font-semibold">
                        Written answer
                        <textarea
                          rows={5}
                          maxLength={10000}
                          value={answerText}
                          onChange={(event) => setAnswerText(event.target.value)}
                          className="w-full rounded-xl border border-line bg-surface p-3 text-sm font-normal text-ink"
                        />
                      </label>
                      <label className="block space-y-1 text-sm font-semibold">
                        Link to your work
                        <input
                          type="url"
                          maxLength={2048}
                          value={submissionUrl}
                          onChange={(event) => setSubmissionUrl(event.target.value)}
                          placeholder="https://..."
                          className="w-full rounded-xl border border-line bg-surface p-3 text-sm font-normal text-ink"
                        />
                      </label>
                      {submissionError && (
                        <p role="alert" className="text-sm text-tone-red-fg">
                          {submissionError}
                        </p>
                      )}
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedAssignment(null)}
                          className="rounded-xl border border-line px-4 py-2 text-sm font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-on-brand disabled:opacity-50"
                        >
                          {submitting ? "Submitting..." : "Submit work"}
                        </button>
                      </div>
                    </form>
                  </Card>
                </div>
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
