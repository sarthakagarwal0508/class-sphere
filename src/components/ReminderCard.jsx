import { Clock } from "lucide-react";

export default function ReminderCard({ items }) {
  return (
    <section>
      <h2 className="text-lg font-extrabold">Reminders</h2>

      {items.length === 0 && (
        <p className="mt-2 text-xs text-muted">You are all caught up.</p>
      )}

      <div className="mt-2 space-y-2">
        {items.map((r) => (
          <div key={r.id} className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-tone-green text-tone-green-fg">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-sm font-bold">{r.title}</p>
              <p className="text-xs text-muted">{r.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}