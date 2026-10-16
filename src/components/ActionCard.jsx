export default function ActionCard({
  variant = "navy",
  eyebrow,
  title,
  description,
  buttonText,
  onButtonClick,
}) {
  const isNavy = variant === "navy";

  return (
    <section
      className={`rounded-2xl p-5 ${isNavy ? "bg-navy text-white" : "bg-brand text-navy"}`}
    >
      <p className={`text-xs ${isNavy ? "text-white/70" : "text-navy/70"}`}>{eyebrow}</p>
      <h3 className="mt-1 text-base font-extrabold leading-tight">{title}</h3>
      <p className={`mt-0.5 text-xs ${isNavy ? "text-white/80" : "text-navy/80"}`}>
        {description}
      </p>
      <button
        onClick={onButtonClick}
        className={`mt-3 rounded-lg px-4 py-2 text-xs font-bold ${
          isNavy ? "bg-brand text-navy" : "bg-navy text-white"
        }`}
      >
        {buttonText}
      </button>
    </section>
  );
}