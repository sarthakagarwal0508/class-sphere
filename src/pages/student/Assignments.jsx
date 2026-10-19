import { useEffect, useRef, useState } from "react";
import { ClipboardList, Clock, Check } from "lucide-react";

import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Tabs from "../../components/Tabs";
import Card from "../../components/Card";
import AssignmentCard from "../../components/AssignmentCard";
import SubmitForm from "../../components/SubmitForm";
import ProgressRing from "../../components/ProgressRing";
import Loader from "../../components/Loader";
import { getAssignments, submitAssignment } from "../../services/assignmentService";
import { daysLeft, daysLeftLabel } from "../../utils/date";

const tabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "submitted", label: "Submitted" },
  { key: "graded", label: "Graded" },
];

export default function Assignments() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [reloadKey, setReloadKey] = useState(0);
  const [tab, setTab] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState("");
  const formRef = useRef(null);

  // Data load: loading, error aur retry teeno handle
  useEffect(() => {
    let ignore = false;

    getAssignments()
      .then((data) => {
        if (ignore) return;
        setItems(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!ignore) setStatus("error");
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
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const active = pending.find((a) => a.id === selectedId) ?? pending[0] ?? null;
  const visible = items.filter((a) => tab === "all" || a.status === tab);
  const done = items.length - pending.length;

  const handleSelect = (assignment) => {
    setSelectedId(assignment.id);
    setNotice("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async (payload) => {
    const updated = await submitAssignment(payload);
    // Immutable update: purani array badalte nahi, nayi banate hain
    setItems((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelectedId(null);
    setNotice(`"${updated.title}" submitted successfully.`);
  };

  return (
    <div className="space-y-5">
      <Topbar title="Assignments" subtitle="Track deadlines, submissions and grades" />

      <HeroBanner
        variant="navy"
        title="Stay on top of deadlines"
        subtitle="Submit work, track status and read feedback in one place."
        buttonText="View calendar"
        icons={[ClipboardList, Clock, Check]}
      />

      {status === "loading" && <Loader label="Loading assignments..." />}

      {status === "error" && (
        <Card className="p-5 text-center">
          <p className="text-sm font-semibold">Could not load your assignments.</p>
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
                <AssignmentCard key={a.id} assignment={a} onSubmit={handleSelect} />
              ))}
            </div>

            <div ref={formRef}>
              {notice && (
                <p
                  role="status"
                  className="mb-3 rounded-xl bg-tone-green px-4 py-2 text-sm font-semibold text-tone-green-fg"
                >
                  {notice}
                </p>
              )}

              {active ? (
                <SubmitForm key={active.id} assignment={active} onSubmit={handleSubmit} />
              ) : (
                <Card className="p-5 text-sm text-muted">
                  You are all caught up. No pending assignments.
                </Card>
              )}
            </div>
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
                  const days = daysLeft(a.dueDate);

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
                            days < 0 ? "font-semibold text-tone-red-fg" : "text-muted"
                          }`}
                        >
                          {daysLeftLabel(days)}
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