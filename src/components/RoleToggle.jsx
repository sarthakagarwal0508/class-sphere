const roles = [
  { key: "student", label: "Student" },
  { key: "teacher", label: "Teacher" },
];

export default function RoleToggle({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Account type" className="grid grid-cols-2 gap-2">
      {roles.map((r) => (
        <button
          key={r.key}
          type="button"
          role="radio"
          aria-checked={value === r.key}
          onClick={() => onChange(r.key)}
          className={`rounded-xl py-2.5 text-xs font-bold transition ${
            value === r.key ? "bg-brand text-on-brand" : "bg-soft text-muted hover:text-ink"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}