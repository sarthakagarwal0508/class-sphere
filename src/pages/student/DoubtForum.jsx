import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle,
  Clock3,
  MessageSquare,
  MessagesSquare,
  Search,
  Send,
} from "lucide-react";
import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Card from "../../components/Card";
import {
  addDoubtReply,
  createDoubt,
  formatDoubtTime,
  getDoubts,
  subscribeToDoubts,
} from "../../services/doubtService";

const filters = [
  { key: "all", label: "All doubts" },
  { key: "open", label: "Open" },
  { key: "resolved", label: "Resolved" },
];

export default function DoubtForum() {
  const [doubts, setDoubts] = useState(getDoubts);
  const [filter, setFilter] = useState("all");
  const [activeDoubtId, setActiveDoubtId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");

  useEffect(() => subscribeToDoubts(setDoubts), []);

  const visibleDoubts = doubts.filter((doubt) => {
    const matchesFilter = filter === "all" || doubt.status === filter;
    const searchText =
      `${doubt.title} ${doubt.description} ${doubt.subject} ${doubt.author}`.toLowerCase();
    return matchesFilter && searchText.includes(search.toLowerCase());
  });

  const activeDoubt =
    visibleDoubts.find((doubt) => doubt.id === activeDoubtId) ??
    visibleDoubts[0] ??
    null;

  function handleSubmit(e) {
    e.preventDefault();

    const newDoubt = createDoubt({
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      author: "Student",
    });

    setFilter("all");
    setSearch("");
    setActiveDoubtId(newDoubt.id);
    setTitle("");
    setDescription("");
    setSubject("");
  }

  function handleReply(e) {
    e.preventDefault();
    const message = reply.trim();
    if (!message || !activeDoubt) return;

    addDoubtReply(activeDoubt.id, "Student", message);
    setReply("");
  }

  const openCount = doubts.filter((doubt) => doubt.status !== "resolved").length;
  const resolvedCount = doubts.length - openCount;

  return (
    <div className="space-y-5">
      <Topbar
        title="Doubt Forum"
        subtitle="Ask questions, share answers and learn together"
      />

      <HeroBanner
        variant="navy"
        eyebrow="LEARN TOGETHER"
        title="No question is too small"
        subtitle="Ask your classmates and teachers for help, or share what you know."
        icons={[MessageSquare, BookOpen, MessagesSquare]}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(16rem,0.85fr)_minmax(0,1.6fr)]">
        <Card className="flex min-h-[28rem] flex-col p-4">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doubts..."
              aria-label="Search doubts"
              className="w-full rounded-xl border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-brand"
            />
          </div>

          <div
            className="mt-4 flex gap-1 rounded-xl bg-soft p-1"
            role="tablist"
            aria-label="Filter doubts"
          >
            {filters.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={filter === item.key}
                onClick={() => setFilter(item.key)}
                className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold transition ${
                  filter === item.key
                    ? "bg-card text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex-1 space-y-2 overflow-y-auto lg:max-h-[28rem]">
            {visibleDoubts.length === 0 ? (
              <p className="px-3 py-10 text-center text-sm text-muted">
                No doubts found. Try another filter or ask a question.
              </p>
            ) : (
              visibleDoubts.map((doubt) => {
                const isActive = activeDoubt?.id === doubt.id;

                return (
                  <button
                    key={doubt.id}
                    type="button"
                    onClick={() => setActiveDoubtId(doubt.id)}
                    aria-pressed={isActive}
                    className={`w-full rounded-xl border p-3.5 text-left transition ${
                      isActive
                        ? "border-brand bg-brand-soft"
                        : "border-line bg-card hover:bg-soft"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-bold text-ink">
                        {doubt.title}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          doubt.status === "resolved"
                            ? "bg-tone-green text-tone-green-fg"
                            : "bg-tone-yellow text-tone-yellow-fg"
                        }`}
                      >
                        {doubt.status === "resolved" ? "Resolved" : "Open"}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate text-xs text-muted">
                      {doubt.author} · {doubt.subject}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
                      <MessagesSquare size={13} />
                      {doubt.replies?.length ?? 0} replies
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="min-h-[20rem] p-5 sm:p-6">
            {activeDoubt ? (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-tone-yellow-fg">
                      <BookOpen size={13} />
                      {activeDoubt.subject}
                    </span>
                    <h2 className="mt-3 text-lg font-extrabold leading-snug text-ink">
                      {activeDoubt.title}
                    </h2>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                      <span>{activeDoubt.author}</span>
                      <span aria-hidden="true">·</span>
                      <Clock3 size={13} />
                      <span>{formatDoubtTime(activeDoubt.createdAt)}</span>
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      activeDoubt.status === "resolved"
                        ? "bg-tone-green text-tone-green-fg"
                        : "bg-tone-yellow text-tone-yellow-fg"
                    }`}
                  >
                    {activeDoubt.status === "resolved" ? "Resolved" : "Open"}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap rounded-xl border border-line bg-soft/60 p-4 text-sm leading-6 text-ink">
                  {activeDoubt.description}
                </p>

                <div className="mt-5">
                  <h3 className="flex items-center gap-2 text-sm font-extrabold text-ink">
                    <MessagesSquare size={16} />
                    Responses
                    <span className="text-xs font-semibold text-muted">
                      ({activeDoubt.replies?.length ?? 0})
                    </span>
                  </h3>

                  {activeDoubt.replies?.length ? (
                    <div className="mt-3 space-y-2.5">
                      {activeDoubt.replies.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-line bg-card p-3.5"
                        >
                          <p className="text-xs font-bold text-tone-yellow-fg">
                            {item.author}
                            {item.createdAt && (
                              <span className="font-medium text-muted">
                                {" "}· {formatDoubtTime(item.createdAt)}
                              </span>
                            )}
                          </p>
                          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-ink">
                            {item.message || item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 rounded-xl bg-soft px-4 py-3 text-sm text-muted">
                      No responses yet. Be the first to help.
                    </p>
                  )}
                </div>

                <form onSubmit={handleReply} className="mt-5 border-t border-line pt-4">
                  <label
                    htmlFor="doubt-reply"
                    className="mb-2 block text-xs font-bold text-ink"
                  >
                    Add a response
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="doubt-reply"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Share an explanation or follow-up..."
                      className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand"
                    />
                    <button
                      type="submit"
                      disabled={!reply.trim()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-extrabold text-on-brand transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send size={15} />
                      Reply
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex min-h-[18rem] flex-col items-center justify-center text-center">
                <MessageSquare className="h-9 w-9 text-muted/70" />
                <p className="mt-3 text-sm font-bold text-ink">No doubt selected</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-muted">
                  Choose a question from the list, or post your own below.
                </p>
              </div>
            )}
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="mb-4">
              <h2 className="text-base font-extrabold text-ink">Ask a doubt</h2>
              <p className="mt-1 text-xs text-muted">
                Give your question a clear title and tell us which subject it is about.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Doubt title"
                  aria-label="Doubt title"
                  required
                  className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand"
                />
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject or class"
                  aria-label="Subject or class"
                  required
                  className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand"
                />
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what you are stuck on..."
                aria-label="Describe your doubt"
                rows={3}
                required
                className="w-full resize-y rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-extrabold text-on-brand transition hover:brightness-95"
                >
                  <Send size={15} />
                  Post doubt
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="flex items-center gap-3 p-4">
          <div className="rounded-xl bg-tone-yellow p-2.5 text-tone-yellow-fg">
            <MessageSquare size={18} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-ink">{openCount}</p>
            <p className="text-xs text-muted">Open doubts</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="rounded-xl bg-tone-green p-2.5 text-tone-green-fg">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-ink">{resolvedCount}</p>
            <p className="text-xs text-muted">Resolved doubts</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
