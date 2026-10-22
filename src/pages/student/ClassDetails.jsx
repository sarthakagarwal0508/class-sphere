import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  Download,
  FileText,
  FolderOpen,
  GraduationCap,
  Megaphone,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/Card";
import HeroBanner from "../../components/HeroBanner";
import Topbar from "../../components/Topbar";
import {
  fetchClassroomDetails,
  leaveClassroom,
} from "../../services/classroomService";
import { getClassroomAnnouncements } from "../../services/announcementService";
import { getClassroomAssignments } from "../../services/assignmentService";
import {
  fetchClassroomMaterials,
  downloadMaterial,
} from "../../services/materialService";

const unwrap = (response) => response?.data?.data ?? response?.data ?? response;
const listFrom = (response, key) => {
  const data = unwrap(response);
  return Array.isArray(data) ? data : data?.[key] ?? [];
};
const classroomName = (item) => item?.name ?? item?.title ?? "Classroom";
const teacherName = (item) =>
  item?.teacher?.name ?? item?.owner?.name ?? item?.teacherName ?? "Teacher";

export default function ClassDetails() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [classState, setClassState] = useState({
    id: null,
    status: "loading",
    error: "",
  });
  const [materialsState, setMaterialsState] = useState({
    id: null,
    status: "loading",
    items: [],
  });
  const [assignmentsState, setAssignmentsState] = useState({
    id: null,
    status: "loading",
    items: [],
  });
  const [announcementsState, setAnnouncementsState] = useState({
    id: null,
    status: "loading",
    items: [],
  });
  const [reloadKey, setReloadKey] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState("");
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    let active = true;

    fetchClassroomDetails(classId)
      .then((data) => {
        if (!active) return;
        const detail = unwrap(data);
        setClassroom(detail?.classroom ?? detail);
        setClassState({ id: classId, status: "ready", error: "" });
      })
      .catch((error) => {
        if (!active) return;
        setClassState({
          id: classId,
          status: "error",
          error: error.message || "Could not load this class.",
        });
      });

    return () => {
      active = false;
    };
  }, [classId, reloadKey]);

  useEffect(() => {
    if (!classroom) return undefined;
    let active = true;

    fetchClassroomMaterials(classId)
      .then((response) => {
        if (active) {
          setMaterialsState({
            id: classId,
            status: "ready",
            items: listFrom(response, "materials"),
          });
        }
      })
      .catch((error) => {
        if (active) {
          setMaterialsState({
            id: classId,
            status: "error",
            items: [],
            error: error.message,
          });
        }
      });

    getClassroomAssignments(classId)
      .then((items) => {
        if (active) {
          setAssignmentsState({ id: classId, status: "ready", items });
        }
      })
      .catch((error) => {
        if (active) {
          setAssignmentsState({
            id: classId,
            status: "error",
            items: [],
            error: error.message,
          });
        }
      });

    getClassroomAnnouncements(classId)
      .then((items) => {
        if (active) {
          setAnnouncementsState({ id: classId, status: "ready", items });
        }
      })
      .catch((error) => {
        if (active) {
          setAnnouncementsState({
            id: classId,
            status: "error",
            items: [],
            error: error.message,
          });
        }
      });

    return () => {
      active = false;
    };
  }, [classroom, classId, reloadKey]);

  if (classState.id === classId && classState.status === "error") {
    return (
      <div className="space-y-4">
        <Topbar
          title="Class unavailable"
          backFallbackPath="/student/classes"
        />
        <Card className="p-6 text-center">
          <p role="alert" className="text-sm font-semibold text-tone-red-fg">
            {classState.error}
          </p>
          <button
            type="button"
            onClick={() => {
              setClassState({ id: classId, status: "loading", error: "" });
              setReloadKey((key) => key + 1);
            }}
            className="mt-3 rounded-lg bg-brand px-4 py-2 text-xs font-bold text-on-brand"
          >
            Try again
          </button>
        </Card>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="space-y-4">
        <Topbar title="Loading class..." backFallbackPath="/student/classes" />
        <Card className="p-6 text-center text-sm text-muted">
          Loading class details...
        </Card>
      </div>
    );
  }

  async function handleLeave() {
    if (!window.confirm(`Leave ${classroomName(classroom)}?`)) return;
    setLeaving(true);
    setLeaveError("");
    try {
      await leaveClassroom(classId);
      navigate("/student/classes", { replace: true });
    } catch (error) {
      setLeaveError(error.message || "Could not leave this class.");
      setLeaving(false);
    }
  }

  const materials = materialsState.id === classId ? materialsState.items : [];
  const assignments =
    assignmentsState.id === classId ? assignmentsState.items : [];
  const announcements =
    announcementsState.id === classId ? announcementsState.items : [];

  return (
    <div className="space-y-5">
      <Topbar
        title={classroomName(classroom)}
        subtitle={`Class code: ${classroom.classCode ?? classroom.code ?? "—"}`}
        backFallbackPath="/student/classes"
      />

      <HeroBanner
        variant="navy"
        eyebrow="YOUR CLASS"
        title={classroomName(classroom)}
        subtitle={`Learn with ${teacherName(classroom)}`}
        icons={[BookOpen, GraduationCap, CalendarDays]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-3 p-5">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-tone-blue text-tone-blue-fg">
            <GraduationCap size={21} />
          </div>
          <div>
            <p className="text-xs text-muted">Teacher</p>
            <p className="font-bold text-ink">{teacherName(classroom)}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3 p-5">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-tone-yellow text-tone-yellow-fg">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-muted">Classmates</p>
            <p className="font-bold text-ink">
              {classroom.enrolledCount ?? classroom.students?.length ?? "—"}
            </p>
          </div>
        </Card>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink">
            <FileText size={19} />
            Class notes
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Materials and PDFs shared by your teacher
          </p>
        </div>
        {downloadError && (
          <Card className="p-3 text-sm text-tone-red-fg" role="alert">
            {downloadError}
          </Card>
        )}

        {materialsState.id !== classId ||
        materialsState.status === "loading" ? (
          <Card className="p-5 text-center text-sm text-muted">
            Loading class notes...
          </Card>
        ) : materialsState.status === "error" ? (
          <Card className="p-5 text-sm text-tone-red-fg">
            {materialsState.error || "Could not load notes for this class."}
          </Card>
        ) : materials.length === 0 ? (
          <Card className="p-8 text-center">
            <FolderOpen className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-3 font-bold text-ink">No notes shared yet</p>
            <p className="mt-1 text-sm text-muted">
              Your teacher’s uploaded notes will appear here.
            </p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {materials.map((material, index) => {
              const materialId = material._id ?? material.id;
              const key = materialId ?? `${material.title}-${index}`;
              return (
                <Card
                  key={key}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tone-yellow text-tone-yellow-fg">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-ink">
                        {material.title || "Class notes"}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {material.description || "PDF shared by your teacher"}
                      </p>
                    </div>
                  </div>
                  {materialId && (
                    <button
                      type="button"
                      onClick={async () => {
                        setDownloadError("");
                        try {
                          await downloadMaterial(
                            materialId,
                            `${material.title || "class-notes"}.pdf`
                          );
                        } catch (error) {
                          setDownloadError(error.message || "Could not download this file.");
                        }
                      }}
                      aria-label={`Download ${material.title || "class notes"}`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-soft text-ink transition hover:bg-brand-soft"
                    >
                      <Download size={16} />
                    </button>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink">
            <ClipboardList size={19} />
            Assignments
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Work assigned for this class
          </p>
        </div>
        {assignmentsState.id !== classId ||
        assignmentsState.status === "loading" ? (
          <Card className="p-5 text-center text-sm text-muted">
            Loading assignments...
          </Card>
        ) : assignmentsState.status === "error" ? (
          <Card className="p-5 text-sm text-tone-red-fg">
            {assignmentsState.error || "Could not load assignments."}
          </Card>
        ) : assignments.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted">
            No assignments posted for this class yet.
          </Card>
        ) : (
          <div className="space-y-2">
            {assignments.map((assignment, index) => (
              <Card
                key={assignment._id ?? assignment.id ?? index}
                className="flex items-start justify-between gap-4 p-4"
              >
                <div className="min-w-0">
                  <h3 className="font-bold text-ink">
                    {assignment.title || "Assignment"}
                  </h3>
                  {assignment.description && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted">
                      {assignment.description}
                    </p>
                  )}
                </div>
                {assignment.dueDate && (
                  <p className="shrink-0 text-xs font-semibold text-muted">
                    Due {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink">
            <Megaphone size={19} />
            Announcements
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Updates from your teacher
          </p>
        </div>
        {announcementsState.id !== classId ||
        announcementsState.status === "loading" ? (
          <Card className="p-5 text-center text-sm text-muted">
            Loading announcements...
          </Card>
        ) : announcementsState.status === "error" ? (
          <Card className="p-5 text-sm text-tone-red-fg">
            {announcementsState.error || "Could not load announcements."}
          </Card>
        ) : announcements.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted">
            No announcements posted for this class yet.
          </Card>
        ) : (
          <div className="space-y-2">
            {announcements.map((announcement, index) => (
              <Card
                key={announcement._id ?? announcement.id ?? index}
                className="p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-ink">
                    {announcement.title || "Announcement"}
                  </h3>
                  {announcement.createdAt && (
                    <span className="shrink-0 text-xs text-muted">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
                  {announcement.content ?? announcement.message ?? ""}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>

      {leaveError && (
        <Card className="p-4 text-sm text-tone-red-fg" role="alert">
          {leaveError}
        </Card>
      )}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={leaving}
          onClick={handleLeave}
          className="rounded-xl border border-tone-red-fg/30 px-4 py-2.5 text-sm font-semibold text-tone-red-fg transition hover:bg-tone-red disabled:opacity-50"
        >
          {leaving ? "Leaving class..." : "Leave class"}
        </button>
      </div>
    </div>
  );
}
