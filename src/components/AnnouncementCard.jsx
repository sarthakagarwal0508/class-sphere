export default function AnnouncementCard({ items }) {
  return (
    <section>
      <h2 className="text-lg font-extrabold">Announcements</h2>

      {items.length === 0 && (
        <p className="mt-2 text-xs text-muted">No announcements yet.</p>
      )}

      <div className="mt-2 space-y-2">
        {items.map((a) => (
          <div key={a.id}>
            <p className="text-sm font-bold">{a.title}</p>
            <p className="text-xs text-muted">{a.by}</p>
          </div>
        ))}
      </div>
    </section>
  );
}