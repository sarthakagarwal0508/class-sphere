export default function Loader({ label = "Loading..." }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-10 text-sm text-muted">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand" />
      {label}
    </div>
  );
}