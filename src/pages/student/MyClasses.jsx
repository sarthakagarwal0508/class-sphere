import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  KeyRound,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import Card from "../../components/Card";
import HeroBanner from "../../components/HeroBanner";
import Topbar from "../../components/Topbar";
import {
  fetchMyClassrooms,
  joinClassroom,
} from "../../services/classroomService";

const idOf = (classroom) => classroom?._id ?? classroom?.id;
const codeOf = (classroom) => classroom?.classCode ?? classroom?.code ?? "";
const teacherOf = (classroom) =>
  classroom?.teacher?.name ??
  classroom?.owner?.name ??
  classroom?.teacherName ??
  classroom?.teacher ??
  "Teacher";

export default function MyClasses() {
  const navigate = useNavigate();
  const classListRef = useRef(null);
  const [classrooms, setClassrooms] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadState, setLoadState] = useState({
    reloadKey: -1,
    status: "loading",
    error: "",
  });
  const [search, setSearch] = useState("");
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    let active = true;

    fetchMyClassrooms()
      .then((items) => {
        if (active) {
          setClassrooms(items);
          setLoadState({ reloadKey, status: "ready", error: "" });
        }
      })
      .catch((error) => {
        if (active) {
          setLoadState({
            reloadKey,
            status: "error",
            error: error.message || "Could not load your classes.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);
  const loading =
    loadState.reloadKey !== reloadKey || loadState.status === "loading";
  const loadError =
    loadState.reloadKey === reloadKey ? loadState.error : "";

  const filteredClasses = useMemo(() => classrooms.filter((item) => {
    const matchesSearch =
      `${item.name ?? item.title ?? ""} ${teacherOf(item)} ${codeOf(item)}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesSearch;
  }), [classrooms, search]);

  async function handleJoin(event) {
    event.preventDefault();
    setJoinError("");
    setJoining(true);

    try {
      await joinClassroom(joinCode.trim());
      setJoinCode("");
      setJoinDialogOpen(false);
      setReloadKey((key) => key + 1);
    } catch (error) {
      setJoinError(error.message || "Could not join this class.");
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="space-y-5">
      <Topbar
        title="My Classes"
        subtitle="Your courses, classmates and learning progress"
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setJoinError("");
            setJoinDialogOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-extrabold text-on-brand shadow-sm transition hover:brightness-95"
        >
          <Plus size={17} />
          Join a class
        </button>
      </div>

      <HeroBanner
        variant="navy"
        eyebrow="YOUR LEARNING SPACE"
        title="Keep learning, one class at a time"
        subtitle="Pick up where you left off and stay on top of your courses."
        buttonText="Browse my classes"
        onButtonClick={() =>
          classListRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
        icons={[BookOpen, GraduationCap, Users]}
      />

      {joinDialogOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setJoinDialogOpen(false);
            }
          }}
        >
          <Card
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-class-title"
            className="w-full max-w-md p-5 shadow-xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-tone-yellow text-tone-yellow-fg">
                  <KeyRound size={19} />
                </div>
                <div>
                  <h2 id="join-class-title" className="font-extrabold text-ink">
                    Join a class
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Enter the code shared by your teacher.
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close join class dialog"
                onClick={() => setJoinDialogOpen(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-soft hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <form className="mt-5 space-y-3" onSubmit={handleJoin}>
              <label
                htmlFor="class-join-code"
                className="block text-xs font-bold text-ink"
              >
                Class code
              </label>
              <input
                id="class-join-code"
                value={joinCode}
                onChange={(event) => {
                  setJoinCode(event.target.value.toUpperCase());
                  setJoinError("");
                }}
                placeholder="e.g. WD101"
                autoComplete="off"
                required
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm font-semibold uppercase tracking-wider text-ink outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-muted focus:border-brand"
              />
              {joinError && (
                <p role="alert" className="rounded-xl bg-tone-red p-3 text-xs leading-5 text-tone-red-fg">
                  {joinError}
                </p>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setJoinDialogOpen(false)}
                  className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!joinCode.trim() || joining}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-extrabold text-on-brand transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <KeyRound size={15} />
                  {joining ? "Joining..." : "Enter code"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-tone-yellow text-tone-yellow-fg">
            <BookOpen size={19} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-ink">{classrooms.length}</p>
            <p className="text-xs text-muted">Enrolled classes</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-tone-blue text-tone-blue-fg">
            <GraduationCap size={19} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-ink">
              {classrooms.reduce(
                (count, classroom) => count + (classroom.students?.length ?? classroom.enrolledCount ?? 0),
                0
              )}
            </p>
            <p className="text-xs text-muted">Classmates</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-tone-green text-tone-green-fg">
            <Users size={19} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-ink">
              {classrooms.filter((classroom) => classroom.status === "completed").length}
            </p>
            <p className="text-xs text-muted">Completed classes</p>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              placeholder="Search by class, teacher or code..."
              aria-label="Search classes"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand"
            />
          </div>
        </div>
      </Card>

      <section ref={classListRef} className="scroll-mt-5 space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-ink">Your classes</h2>
            <p className="mt-0.5 text-xs text-muted">
              {filteredClasses.length}{" "}
              {filteredClasses.length === 1 ? "class" : "classes"} found
            </p>
          </div>
        </div>

        {loading ? (
          <Card className="p-8 text-center text-sm text-muted">Loading your classes...</Card>
        ) : loadError ? (
          <Card className="p-8 text-center">
            <p role="alert" className="text-sm font-semibold text-tone-red-fg">{loadError}</p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-3 rounded-lg bg-brand px-4 py-2 text-xs font-bold text-on-brand"
            >
              Try again
            </button>
          </Card>
        ) : filteredClasses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredClasses.map((item) => (
              <Card
                key={idOf(item)}
                className="flex h-full flex-col p-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-tone-yellow-fg">
                      <BookOpen size={21} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-extrabold text-ink">
                        {item.name ?? item.title ?? "Classroom"}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted">
                        {teacherOf(item)}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-lg bg-soft px-2.5 py-1 text-[11px] font-bold text-muted">
                    {codeOf(item) || "Class"}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-soft/70 px-3 py-2.5">
                  <CalendarDays size={15} className="shrink-0 text-muted" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      Description
                    </p>
                    <p className="truncate text-xs font-semibold text-ink">
                      {item.description || "Class materials and assignments"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/student/classes/${idOf(item)}`)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-extrabold text-on-brand transition hover:brightness-95"
                >
                  View class
                  <ArrowRight size={16} />
                </button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Search className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-3 font-bold text-ink">No classes found</p>
            <p className="mt-1 text-sm text-muted">
              Try another search or choose a different filter.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
