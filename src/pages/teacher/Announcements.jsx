import { useEffect, useState } from "react";
import { Bell, CalendarDays, CheckCircle2, Megaphone } from "lucide-react";
import Card from "../../components/Card";
import HeroBanner from "../../components/HeroBanner";
import Topbar from "../../components/Topbar";
import { fetchMyClassrooms } from "../../services/classroomService";
import {
  createAnnouncement,
  getClassroomAnnouncements,
} from "../../services/announcementService";

function unwrapList(response, key) {
  const payload = response?.data ?? response;
  return Array.isArray(payload) ? payload : payload?.[key] ?? [];
}

function getClassroomId(classroom) {
  return classroom?._id ?? classroom?.id;
}

function getClassroomLabel(classroom) {
  return classroom?.name ?? classroom?.title ?? "Classroom";
}

export default function Announcements() {
  const [classrooms, setClassrooms] = useState([]);
  const [classroomId, setClassroomId] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsClassId, setAnnouncementsClassId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    fetchMyClassrooms()
      .then((response) => {
        if (!active) return;
        const items = unwrapList(response, "classrooms");
        setClassrooms(items);
        if (items.length > 0) {
          setClassroomId(String(getClassroomId(items[0])));
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Could not load your classrooms.");
        }
      })
      .finally(() => {
        if (active) setLoadingClasses(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!classroomId) return undefined;

    let active = true;
    getClassroomAnnouncements(classroomId)
      .then((items) => {
        if (active) {
          setAnnouncements(items);
          setAnnouncementsClassId(classroomId);
        }
      })
      .catch((err) => {
        if (active) {
          setAnnouncements([]);
          setAnnouncementsClassId(classroomId);
          setError(err.message || "Could not load announcements for this class.");
        }
      });

    return () => {
      active = false;
    };
  }, [classroomId]);

  const selectedClassroom = classrooms.find(
    (item) => String(getClassroomId(item)) === classroomId
  );
  const visibleAnnouncements =
    announcementsClassId === classroomId ? announcements : [];
  const loadingAnnouncements =
    Boolean(classroomId) && announcementsClassId !== classroomId;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!classroomId) {
      setError("Create a classroom before posting an announcement.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createAnnouncement(classroomId, {
        title: title.trim(),
        content: message.trim(),
      });

      setAnnouncements((items) => [created, ...items]);
      setTitle("");
      setMessage("");
      setNotice("Announcement posted successfully.");
    } catch (err) {
      setError(err.message || "Could not post the announcement.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <Topbar
        title="Announcements"
        subtitle="Post updates for your classroom"
        backFallbackPath="/teacher/dashboard"
      />

      <HeroBanner
        variant="navy"
        eyebrow="KEEP EVERYONE INFORMED"
        title="Share an update with your students"
        subtitle="Choose a classroom and post important news, reminders, and schedule changes."
        icons={[Megaphone, Bell, CalendarDays]}
      />

      {error && (
        <Card className="border border-tone-red/40 p-4 text-sm text-tone-red-fg">
          {error}
        </Card>
      )}
      {notice && (
        <Card className="flex items-center gap-2 border border-tone-green/40 p-4 text-sm text-tone-green-fg">
          <CheckCircle2 size={17} />
          {notice}
        </Card>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,1fr)]">
        <Card className="p-5 sm:p-6">
          <h2 className="text-base font-extrabold text-ink">New announcement</h2>
          <p className="mt-1 text-xs text-muted">
            Your announcement will be shared with students in the selected class.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="announcement-classroom"
                className="mb-1.5 block text-xs font-bold text-ink"
              >
                Classroom
              </label>
              <select
                id="announcement-classroom"
                value={classroomId}
                onChange={(event) => {
                  setClassroomId(event.target.value);
                  setError("");
                  setNotice("");
                }}
                disabled={loadingClasses || classrooms.length === 0}
                required
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand disabled:opacity-60"
              >
                {loadingClasses ? (
                  <option value="">Loading classrooms...</option>
                ) : classrooms.length === 0 ? (
                  <option value="">No classrooms available</option>
                ) : (
                  classrooms.map((classroom) => {
                    const id = getClassroomId(classroom);
                    return (
                      <option key={id} value={id}>
                        {getClassroomLabel(classroom)}
                      </option>
                    );
                  })
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="announcement-title"
                className="mb-1.5 block text-xs font-bold text-ink"
              >
                Title
              </label>
              <input
                id="announcement-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Lab moved to Friday"
                required
                maxLength={120}
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand"
              />
            </div>

            <div>
              <label
                htmlFor="announcement-message"
                className="mb-1.5 block text-xs font-bold text-ink"
              >
                Message
              </label>
              <textarea
                id="announcement-message"
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write the update for your students..."
                required
                maxLength={5000}
                className="w-full resize-y rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || loadingClasses || classrooms.length === 0}
              className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-extrabold text-on-brand transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post announcement"}
            </button>
          </form>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-ink">
                Posted announcements
              </h2>
              <p className="mt-1 text-xs text-muted">
                {selectedClassroom
                  ? getClassroomLabel(selectedClassroom)
                  : "Select a classroom to view its announcements"}
              </p>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tone-yellow text-tone-yellow-fg">
              <Megaphone size={19} />
            </div>
          </div>

          {loadingAnnouncements ? (
            <p className="py-10 text-center text-sm text-muted">
              Loading announcements...
            </p>
          ) : visibleAnnouncements.length === 0 ? (
            <div className="py-10 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted" />
              <p className="mt-3 text-sm font-bold text-ink">
                No announcements yet
              </p>
              <p className="mt-1 text-xs text-muted">
                Posted updates for this class will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-line">
              {visibleAnnouncements.map((announcement, index) => {
                const id =
                  announcement._id ?? announcement.id ?? `${announcement.title}-${index}`;
                const createdAt = announcement.createdAt
                  ? new Date(announcement.createdAt).toLocaleDateString()
                  : null;

                return (
                  <article key={id} className="py-4 first:pt-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-ink">
                        {announcement.title}
                      </h3>
                      {createdAt && (
                        <span className="shrink-0 text-[11px] text-muted">
                          {createdAt}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
                      {announcement.content ?? announcement.message}
                    </p>
                    {announcement.teacher?.name && (
                      <p className="mt-2 text-xs font-semibold text-muted">
                        {announcement.teacher.name}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
