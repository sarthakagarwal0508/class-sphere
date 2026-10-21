import Card from "./Card";
import Loader from "./Loader";

export default function KeyPointsCard({ items, status }) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-extrabold">Key points</h2>

      {status === "idle" && (
        <p className="mt-2 text-sm text-muted">
          Your key points will appear here after you generate a summary.
        </p>
      )}

      {status === "loading" && <Loader label="Reading your notes..." />}

      {status === "error" && (
        <p className="mt-2 text-sm text-muted">Nothing to show yet. Fix the message on the left and try again.</p>
      )}

      {status === "ready" && (
        <ol className="mt-3 space-y-3">
          {items.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-tone-green text-xs font-bold text-tone-green-fg">
                {i + 1}
              </span>
              <span className="text-sm leading-snug">{point}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}