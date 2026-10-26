import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Layers,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Shuffle,
  Sparkles,
} from "lucide-react";

import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Card from "../../components/Card";
import { fetchMyClassrooms } from "../../services/classroomService";
import { fetchClassroomMaterials } from "../../services/materialService";
import { generateStudyAid } from "../../services/notesAiService";

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? response;
}

function listFrom(response, key) {
  const data = unwrap(response);
  return Array.isArray(data) ? data : data?.[key] ?? [];
}

function classroomIdOf(classroom) {
  return classroom?._id ?? classroom?.id;
}

function isPdf(material) {
  const type = String(
    material.type ?? material.mimeType ?? material.contentType ?? ""
  ).toLowerCase();
  const filename = String(
    material.fileName ?? material.originalName ?? material.title ?? ""
  ).toLowerCase();
  return (
    !type.includes("link") &&
    (type.includes("pdf") || filename.endsWith(".pdf") || (!type && !filename))
  );
}

function normalizeCards(cards, material) {
  const className = material?.courseName ?? "Personal notes";
  return cards.map((card, index) => ({
    ...card,
    id: card.id ?? `${material?.id ?? "notes"}-${Date.now()}-${index}`,
    course: card.course ?? className,
    classroomId: card.classroomId ?? material?.classroomId ?? null,
    sourceMaterialId: card.sourceMaterialId ?? material?.id ?? null,
  }));
}

export default function Flashcards() {
  const location = useLocation();
  const incomingCards = location.state?.cards;
  const incomingMaterial = location.state?.material ?? null;

  const [cards, setCards] = useState(() =>
    Array.isArray(incomingCards) ? normalizeCards(incomingCards, incomingMaterial) : []
  );
  const [classrooms, setClassrooms] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [materialsStatus, setMaterialsStatus] = useState("loading");
  const [materialsError, setMaterialsError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedClass, setSelectedClass] = useState("all");
  const [generatingId, setGeneratingId] = useState("");
  const [generationError, setGenerationError] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({});

  useEffect(() => {
    let active = true;

    fetchMyClassrooms()
      .then(async (classroomList) => {
        const materialGroups = await Promise.all(
          classroomList.map(async (classroom) => {
            const classroomId = classroomIdOf(classroom);
            if (!classroomId) return [];
            const response = await fetchClassroomMaterials(classroomId);
            return listFrom(response, "materials")
              .filter(isPdf)
              .map((material) => ({
                id: String(material._id ?? material.id),
                title:
                  material.title ??
                  material.originalName ??
                  material.fileName ??
                  "Study material",
                classroomId: String(classroomId),
                courseName:
                  classroom.name ?? classroom.title ?? "Classroom",
              }));
          })
        );

        if (active) {
          setClassrooms(
            classroomList.map((classroom) => ({
              id: String(classroomIdOf(classroom)),
              name: classroom.name ?? classroom.title ?? "Classroom",
            }))
          );
          setMaterials(materialGroups.flat());
          setMaterialsStatus("ready");
        }
      })
      .catch((error) => {
        if (active) {
          setMaterialsError(
            error.message || "Could not load your class study materials."
          );
          setMaterialsStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const visibleCards = useMemo(
    () =>
      cards.filter(
        (card) =>
          selectedClass === "all" ||
          String(card.classroomId ?? `personal:${card.course}`) === selectedClass
      ),
    [cards, selectedClass]
  );
  const visibleMaterials = materials.filter(
    (material) =>
      selectedClass === "all" || material.classroomId === selectedClass
  );
  const current = visibleCards[index];
  const reviewed = visibleCards.filter((card) => results[card.id]).length;
  const known = visibleCards.filter(
    (card) => results[card.id] === "known"
  ).length;

  const classes = useMemo(() => {
    const knownClasses = new Map(classrooms.map((classroom) => [classroom.id, classroom.name]));
    cards.forEach((card) => {
      const id = String(card.classroomId ?? `personal:${card.course}`);
      if (!knownClasses.has(id)) knownClasses.set(id, card.course ?? "Personal notes");
    });
    return [...knownClasses].map(([id, name]) => ({ id, name }));
  }, [cards, classrooms]);

  const changeClass = (value) => {
    setSelectedClass(value);
    setIndex(0);
    setFlipped(false);
  };

  const move = (step) => {
    if (!visibleCards.length) return;
    setIndex((currentIndex) =>
      (currentIndex + step + visibleCards.length) % visibleCards.length
    );
    setFlipped(false);
  };

  const mark = (value) => {
    if (!current) return;
    setResults((previous) => ({ ...previous, [current.id]: value }));
    if (index < visibleCards.length - 1) setIndex(index + 1);
    setFlipped(false);
  };

  const shuffle = () => {
    setCards((previous) => [...previous].sort(() => Math.random() - 0.5));
    setIndex(0);
    setFlipped(false);
  };

  const generateFromMaterial = async (material) => {
    setGeneratingId(material.id);
    setGenerationError("");
    try {
      const result = await generateStudyAid({ material });
      const generatedCards = normalizeCards(result.flashcards ?? [], material);
      if (!generatedCards.length) {
        setGenerationError(
          `No flashcards were returned for “${material.title}”. Try another PDF.`
        );
        return;
      }
      setCards((previous) => [
        ...previous.filter((card) => card.sourceMaterialId !== material.id),
        ...generatedCards,
      ]);
      setSelectedClass(material.classroomId);
      setIndex(0);
      setFlipped(false);
    } catch (error) {
      setGenerationError(
        error.message || `Could not generate flashcards from “${material.title}”.`
      );
    } finally {
      setGeneratingId("");
    }
  };

  return (
    <div className="dashboard-stagger space-y-5">
      <Topbar
        title="Flashcards"
        subtitle="Practice active recall from your class study materials"
      />

      <HeroBanner
        variant="yellow"
        title="Small sessions, big progress"
        subtitle="Choose a class PDF to make flashcards, then flip each card to test yourself."
        icons={[Layers, RotateCw, Check]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <span className="text-muted">Class</span>
          <select
            value={selectedClass}
            onChange={(event) => changeClass(event.target.value)}
            className="rounded-xl border border-line bg-card px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="all">All classes</option>
            {classes.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={shuffle}
          disabled={visibleCards.length < 2}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-2 text-xs font-bold transition hover:bg-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Shuffle size={14} />
          Shuffle cards
        </button>
      </div>

      {current ? (
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted">
            <span>{current.course}</span>
            <span>Card {index + 1} of {visibleCards.length}</span>
          </div>

          <button
            type="button"
            aria-label={flipped ? "Show question" : "Reveal answer"}
            onClick={() => setFlipped((value) => !value)}
            className={`min-h-72 w-full rounded-3xl border p-7 text-left shadow-sm transition duration-200 sm:min-h-80 sm:p-10 ${
              flipped
                ? "border-brand bg-brand-soft"
                : "border-line bg-card hover:-translate-y-0.5 hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between gap-3 text-xs font-extrabold uppercase tracking-[0.16em] text-muted">
              <span>{flipped ? "Answer" : "Question"}</span>
              <RotateCw size={17} />
            </div>
            <div className="flex min-h-52 flex-col items-center justify-center text-center sm:min-h-60">
              <p className="text-xl font-extrabold leading-relaxed sm:text-2xl">
                {flipped ? current.answer : current.question}
              </p>
              {!flipped && (
                <p className="mt-5 text-xs text-muted">
                  Click card to reveal answer
                </p>
              )}
            </div>
          </button>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              className="inline-flex items-center gap-1 rounded-xl border border-line bg-card px-3 py-2.5 text-xs font-bold hover:bg-soft"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => mark("review")}
                className="inline-flex items-center gap-1 rounded-xl border border-line bg-card px-3 py-2.5 text-xs font-bold hover:bg-soft"
              >
                <X size={15} />
                Review again
              </button>
              <button
                type="button"
                onClick={() => mark("known")}
                className="inline-flex items-center gap-1 rounded-xl bg-brand px-3 py-2.5 text-xs font-extrabold text-on-brand hover:opacity-90"
              >
                <Check size={15} />
                Got it
              </button>
            </div>
            <button
              type="button"
              onClick={() => move(1)}
              className="inline-flex items-center gap-1 rounded-xl border border-line bg-card px-3 py-2.5 text-xs font-bold hover:bg-soft"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="font-bold">
            {cards.length
              ? "No flashcards for this class yet."
              : "No flashcards generated yet."}
          </p>
          <p className="mt-1 text-sm text-muted">
            Choose a shared PDF below to create flashcards for its class.
          </p>
        </Card>
      )}

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-muted" />
          <h2 className="text-base font-extrabold">Make flashcards from study material</h2>
        </div>
        <p className="mt-1 text-sm text-muted">
          Pick a PDF shared in one of your classes to generate cards for that class.
        </p>

        {materialsError && (
          <div role="alert" className="mt-3 text-sm text-tone-red-fg">
            {materialsError}{" "}
            <button
              type="button"
              onClick={() => {
                setMaterialsError("");
                setMaterialsStatus("loading");
                setReloadKey((key) => key + 1);
              }}
              className="font-bold underline"
            >
              Try again
            </button>
          </div>
        )}
        {generationError && (
          <p role="alert" className="mt-3 text-sm text-tone-red-fg">
            {generationError}
          </p>
        )}

        {materialsStatus === "loading" ? (
          <p className="mt-4 text-sm text-muted">Loading your class materials...</p>
        ) : materialsStatus === "ready" && visibleMaterials.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            {classrooms.length
              ? "No PDFs are shared in this class yet."
              : "Join a class to use PDFs shared by your teachers."}
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {visibleMaterials.map((material) => (
              <div
                key={material.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-card p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{material.title}</p>
                  <p className="text-xs text-muted">{material.courseName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => generateFromMaterial(material)}
                  disabled={Boolean(generatingId)}
                  className="shrink-0 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-on-brand disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {generatingId === material.id ? "Generating..." : "Make flashcards"}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted">Total cards</p>
          <p className="mt-1 text-2xl font-extrabold">{visibleCards.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted">Reviewed</p>
          <p className="mt-1 text-2xl font-extrabold">{reviewed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted">Known</p>
          <p className="mt-1 text-2xl font-extrabold text-tone-green-fg">{known}</p>
        </Card>
      </div>

    </div>
  );
}
