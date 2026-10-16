export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-card shadow-sm ring-1 ring-line/70 ${className}`}>
      {children}
    </div>
  );
}