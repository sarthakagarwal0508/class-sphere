import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Layers,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Shuffle,
} from "lucide-react";

import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Card from "../../components/Card";

export default function Flashcards() {
  const location = useLocation();

  const incomingCards = location.state?.cards;

  const [cards, setCards] = useState(
    Array.isArray(incomingCards) && incomingCards.length
      ? incomingCards.map((card, index) => ({
          ...card,
          id: card.id ?? `generated-${index}`,
          course: card.course ?? "Notes AI",
        }))
      : []
  );

  const [course, setCourse] = useState("All");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({});

  const visibleCards = useMemo(
    () =>
      cards.filter(
        (card) => course === "All" || card.course === course
      ),
    [cards, course]
  );

  const current = visibleCards[index];

  const reviewed = Object.keys(results).length;

  const known = Object.values(results).filter(
    (value) => value === "known"
  ).length;

  const changeCourse = (value) => {
    setCourse(value);
    setIndex(0);
    setFlipped(false);
  };

  const move = (step) => {
    if (!visibleCards.length) return;

    setIndex(
      (currentIndex) =>
        (currentIndex + step + visibleCards.length) %
        visibleCards.length
    );

    setFlipped(false);
  };

  const mark = (value) => {
    if (!current) return;

    setResults((previous) => ({
      ...previous,
      [current.id]: value,
    }));

    if (index < visibleCards.length - 1) {
      setIndex(index + 1);
    }

    setFlipped(false);
  };

  const shuffle = () => {
    setCards((previous) =>
      [...previous].sort(() => Math.random() - 0.5)
    );

    setIndex(0);
    setFlipped(false);
  };

  return (
    <div className="dashboard-stagger space-y-5">
      <Topbar
        title="Flashcards"
        subtitle="Practice active recall, one card at a time"
      />

      <HeroBanner
        variant="yellow"
        title="Small sessions, big progress"
        subtitle="Flip a card to reveal the answer, then mark how well you knew it."
        icons={[Layers, RotateCw, Check]}
      />

<div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <span className="text-muted">Subject</span>

          <select
            value={course}
            onChange={(event) =>
              changeCourse(event.target.value)
            }
            className="rounded-xl border border-line bg-card px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="All">All subjects</option>

            {[
              ...new Set(
                cards.map((card) => card.course || "Notes AI")
              ),
            ].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={shuffle}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-2 text-xs font-bold transition hover:bg-soft"
        >
          <Shuffle size={14} />
          Shuffle cards
        </button>
      </div>

{current ? (
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted">
            <span>{current.course || "Notes AI"}</span>

            <span>
              Card {index + 1} of {visibleCards.length}
            </span>
          </div>

          <button
            type="button"
            aria-label={
              flipped ? "Show question" : "Reveal answer"
            }
            onClick={() =>
              setFlipped((value) => !value)
            }
            className={`min-h-72 w-full rounded-3xl border p-7 text-left shadow-sm transition duration-200 sm:min-h-80 sm:p-10 ${
              flipped
                ? "border-brand bg-brand-soft"
                : "border-line bg-card hover:-translate-y-0.5 hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between gap-3 text-xs font-extrabold uppercase tracking-[0.16em] text-muted">
              <span>
                {flipped ? "Answer" : "Question"}
              </span>

              <RotateCw size={17} />
            </div>

            <div className="flex min-h-52 flex-col items-center justify-center text-center sm:min-h-60">
              <p className="text-xl font-extrabold leading-relaxed sm:text-2xl">
                {flipped
                  ? current.answer
                  : current.question}
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
            No flashcards in this subject yet.
          </p>

          <p className="mt-1 text-sm text-muted">
            Choose another subject or generate cards from Notes AI.
          </p>
        </Card>
      )}

<div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted">Total cards</p>
          <p className="mt-1 text-2xl font-extrabold">
            {visibleCards.length}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted">Reviewed</p>
          <p className="mt-1 text-2xl font-extrabold">
            {reviewed}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted">Known</p>
          <p className="mt-1 text-2xl font-extrabold text-tone-green-fg">
            {known}
          </p>
        </Card>
      </div>

      <p className="text-xs text-muted">
        Flashcards are generated from a PDF in Notes AI. They are not saved between sessions by the current API.
      </p>
    </div>
  );
}
