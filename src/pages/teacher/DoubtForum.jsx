import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle,
  Clock3,
  MessageSquare,
  MessagesSquare,
  Send,
} from "lucide-react";
import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Card from "../../components/Card";
import { fetchMyClassrooms } from "../../services/classroomService";
import {
  addDoubtReply,
  fetchClassroomDoubts,
  formatDoubtTime,
  normalizeDoubt,
  setDoubtStatus,
} from "../../services/doubtService";

export default function DoubtForum() {
  const [doubts, setDoubts] = useState([]);
  const [filter, setFilter] = useState("open");
  const [activeDoubtId, setActiveDoubtId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchMyClassrooms()
      .then(async (classrooms) => {
        const groups = await Promise.all(
          classrooms.map(async (classroom) => {
            const classroomId = classroom._id ?? classroom.id;
            const classroomName = classroom.name ?? classroom.title ?? "Classroom";
            const result = await fetchClassroomDoubts(classroomId);
            return result.map((doubt) => normalizeDoubt(doubt, classroomName));
          })
        );
        if (active) setDoubts(groups.flat());
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Could not load classroom doubts.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredDoubts = useMemo(
    () => doubts.filter((doubt) => doubt.status === filter),
    [doubts, filter]
  );
  const activeDoubt =
    filteredDoubts.find((doubt) => doubt.id === activeDoubtId) ??
    filteredDoubts[0] ??
    null;

  async function handlePostReply(event) {
    event.preventDefault();
    const message = replyText.trim();
    if (!message || !activeDoubt) return;

    setSubmitting(true);
    setError("");
    try {
      const response = await addDoubtReply(activeDoubt.id, message);
      const updated = response?.doubt ?? response;
      if (updated?.replies) {
        const normalized = normalizeDoubt(updated, activeDoubt.subject);
        setDoubts((previous) =>
          previous.map((item) => item.id === activeDoubt.id ? normalized : item)
        );
      } else {
        setDoubts((previous) =>
          previous.map((item) =>
            item.id === activeDoubt.id
              ? normalizeDoubt(
                  {
                    ...item,
                    replies: [
                      ...item.replies,
                      {
                        author: "You",
                        message,
                        createdAt: new Date().toISOString(),
                      },
                    ],
                  },
                  item.subject
                )
              : item
          )
        );
      }
      setReplyText("");
    } catch (replyError) {
      setError(replyError.message || "Could not post your answer.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleResolved(doubt) {
    const status = doubt.status === "resolved" ? "open" : "resolved";
    setSubmitting(true);
    setError("");
    try {
      const response = await setDoubtStatus(doubt.id, status);
      const updated = response?.doubt ?? response;
      const normalized =
        updated?._id || updated?.id
          ? normalizeDoubt(updated, doubt.subject)
          : { ...doubt, status };
      setDoubts((previous) =>
        previous.map((item) => item.id === doubt.id ? normalized : item)
      );
      setActiveDoubtId(doubt.id);
    } catch (statusError) {
      setError(statusError.message || "Could not update the doubt status.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 dashboard-stagger max-w-6xl mx-auto">
      <Topbar
        title="Doubt forum"
        subtitle="Answer student questions and clarify course concepts."
        backFallbackPath="/teacher/dashboard"
      />
      <HeroBanner
        variant="navy"
        eyebrow="STUDENT SUPPORT"
        title="Help students move forward"
        subtitle="Review class questions, share explanations, and mark topics resolved."
        icons={[MessageSquare, CheckCircle, Clock3]}
      />

      {error && (
        <Card className="p-4 text-sm text-tone-red-fg" role="alert">
          {error}
          <button
            type="button"
            onClick={() => setError("")}
            className="ml-2 font-bold underline"
          >
            Dismiss
          </button>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="space-y-4 p-5">
          <div className="flex gap-1 rounded-xl bg-soft p-1">
            {["open", "resolved"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setFilter(status);
                  setActiveDoubtId(null);
                }}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold capitalize transition ${
                  filter === status
                    ? "bg-card text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {status === "open" ? "Open doubts" : "Resolved"}
              </button>
            ))}
          </div>

          <div className="max-h-[500px] space-y-2 overflow-y-auto pr-1">
            {loading ? (
              <p className="py-6 text-center text-xs text-muted">Loading class doubts...</p>
            ) : filteredDoubts.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted">No doubts in this category.</p>
            ) : (
              filteredDoubts.map((doubt) => (
                <button
                  key={doubt.id}
                  type="button"
                  onClick={() => setActiveDoubtId(doubt.id)}
                  className={`w-full rounded-xl border p-3.5 text-left transition ${
                    activeDoubt?.id === doubt.id
                      ? "border-brand bg-brand-soft"
                      : "border-line bg-card hover:bg-soft"
                  }`}
                >
                  <p className="line-clamp-2 text-sm font-bold text-ink">{doubt.title}</p>
                  <p className="mt-1 text-[11px] text-muted">
                    {doubt.author} · {doubt.subject}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
                    <MessagesSquare size={13} />
                    {doubt.replies.length} replies
                  </p>
                </button>
              ))
            )}
          </div>
        </Card>

        <Card className="flex min-h-[30rem] flex-col justify-between space-y-5 p-5 lg:col-span-2 sm:p-6">
          {activeDoubt ? (
            <>
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-tone-yellow-fg">
                      <BookOpen size={13} />
                      {activeDoubt.subject}
                    </span>
                    <h2 className="mt-3 text-lg font-extrabold text-ink">{activeDoubt.title}</h2>
                    <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                      {activeDoubt.author}
                      <span aria-hidden="true">·</span>
                      <Clock3 size={13} />
                      {formatDoubtTime(activeDoubt.createdAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => toggleResolved(activeDoubt)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
                      activeDoubt.status === "resolved"
                        ? "bg-tone-green text-tone-green-fg"
                        : "bg-soft text-ink hover:bg-tone-green"
                    }`}
                  >
                    <CheckCircle size={14} />
                    {activeDoubt.status === "resolved" ? "Reopen doubt" : "Mark resolved"}
                  </button>
                </div>

                <p className="whitespace-pre-wrap rounded-xl border border-line bg-soft/60 p-4 text-sm leading-6 text-ink">
                  {activeDoubt.description}
                </p>

                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-ink">
                    Responses ({activeDoubt.replies.length})
                  </h3>
                  {activeDoubt.replies.length ? (
                    activeDoubt.replies.map((reply) => (
                      <div key={reply.id} className="rounded-xl border border-line bg-card p-3.5">
                        <p className="text-xs font-bold text-tone-yellow-fg">
                          {reply.author}
                          {reply.createdAt && (
                            <span className="font-medium text-muted">
                              {" "}· {formatDoubtTime(reply.createdAt)}
                            </span>
                          )}
                        </p>
                        <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-ink">
                          {reply.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-xl bg-soft px-4 py-3 text-sm text-muted">
                      No responses yet. Be the first to help.
                    </p>
                  )}
                </div>
              </div>

              <form onSubmit={handlePostReply} className="space-y-2 border-t border-line pt-4">
                <label htmlFor="teacher-doubt-reply" className="block text-xs font-bold text-ink">
                  Add an answer
                </label>
                <textarea
                  id="teacher-doubt-reply"
                  rows={3}
                  maxLength={3000}
                  required
                  placeholder="Type your explanation..."
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-on-brand disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={14} />
                  {submitting ? "Sending..." : "Post answer"}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <MessageSquare className="h-9 w-9 text-muted/70" />
              <p className="mt-3 text-sm font-bold text-ink">
                {loading ? "Loading doubts..." : "No doubt selected"}
              </p>
              <p className="mt-1 text-xs text-muted">
                {loading ? "Fetching questions from your classrooms." : "Choose a question from the list."}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
