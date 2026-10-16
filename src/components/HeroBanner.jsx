export default function HeroBanner({
  variant = "navy",
  eyebrow,
  title,
  subtitle,
  buttonText,
  onButtonClick,
}) {
  const isNavy = variant === "navy";

  return (
    <section
      className={`relative overflow-hidden rounded-3xl p-6 ${
        isNavy ? "bg-panel text-white" : "bg-brand text-on-brand"
      }`}
    >
      <div className="relative z-10 max-w-md">
        {eyebrow && (
          <p className={`text-base ${isNavy ? "text-white/80" : "text-on-brand/70"}`}>
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-extrabold leading-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-xs opacity-80">{subtitle}</p>}
        {buttonText && (
          <button
            onClick={onButtonClick}
            className={`mt-4 rounded-xl px-4 py-2 text-xs font-bold ${
              isNavy ? "bg-brand text-on-brand" : "bg-panel text-white"
            }`}
          >
            {buttonText}
          </button>
        )}
      </div>

      <div
        className={`absolute -right-10 -top-16 h-56 w-56 rounded-full ${
          isNavy ? "bg-brand" : "bg-white/30"
        }`}
      />
      <div
        className={`absolute -bottom-12 right-24 h-32 w-32 rounded-full ${
          isNavy ? "bg-panel-2" : "bg-black/5"
        }`}
      />
    </section>
  );
}