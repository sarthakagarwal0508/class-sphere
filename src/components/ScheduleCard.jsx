export default function ScheduleCard({ items }) {
  return (
    <section>
      <h2 className="text-lg font-extrabold">Schedule</h2>

      {items.length === 0 && (
        <p className="mt-2 text-xs text-muted">No upcoming classes.</p>
      )}

      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <div key={item.id}>
            <p className="text-xs text-muted">{item.date}</p>
            <div className="mt-0.5 rounded-lg border-l-4 border-navy bg-brand-soft px-3 py-1.5">
              <p className="text-sm">
                <span className="font-bold">{item.time}</span> {item.title}
              </p>
              <p className="text-xs text-muted">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}