import Card from "./Card";
import Loader from "./Loader";

export default function FlashcardsCard({ cards, status, onRevise }) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-extrabold">
        Flashcards{status === "ready" ? ` (${cards.length})` : ""}
      </h2>

      {status === "idle" && (
        <p className="mt-2 text-sm text-muted">
          Question and answer cards will appear here so you can revise.
        </p>
      )}

      {status === "loading" && <Loader label="Making flashcards..." />}

      {status === "error" && (
        <p className="mt-2 text-sm text-muted">No flashcards yet.</p>
      )}

      {status === "ready" && (
        <>
          <div className="mt-3 space-y-2">
            {cards.map((card, i) => (
              <div key={i} className="rounded-xl bg-brand-soft px-4 py-3">
                <p className="text-sm font-bold leading-snug">{card.question}</p>
                <p className="mt-0.5 text-sm text-muted">{card.answer}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onRevise}
            className="mt-4 rounded-lg bg-brand px-4 py-2 text-xs font-bold text-on-brand"
          >
            Revise these cards
          </button>
        </>
      )}
    </Card>
  );
}