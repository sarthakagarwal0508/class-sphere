export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-4 border-b border-line" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
          className={`-mb-px border-b-2 pb-1 text-sm font-semibold transition ${
            active === t.key ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}