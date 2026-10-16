function Tile({ Icon, className }) {
  return (
    <div
      className={`absolute grid h-14 w-14 place-items-center rounded-2xl bg-card text-ink shadow-lg ${className}`}
    >
      <Icon size={22} />
    </div>
  );
}

export default function HeroBanner({
  variant = "navy",
  eyebrow,
  title,
  subtitle,
  buttonText,
  onButtonClick,
  icons = [],
  imageUrl,
  imageAlt = "",
}) {
  const isNavy = variant === "navy";

  return (
    <section
      className={`relative overflow-hidden rounded-3xl p-6 ${
        isNavy ? "bg-panel text-white" : "bg-brand text-on-brand"
      }`}
    >
      {imageUrl && (
        <>
          <img
            src={imageUrl}
            alt={imageAlt}
            className="absolute inset-y-0 right-0 hidden h-full w-[46%] object-cover sm:block"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
          <div
            className={`absolute inset-0 ${
              isNavy
                ? "bg-gradient-to-r from-panel via-panel/95 to-panel/15"
                : "bg-gradient-to-r from-brand via-brand/95 to-brand/15"
            }`}
          />
        </>
      )}

      <div className={`relative z-10 max-w-md ${imageUrl ? "sm:max-w-[60%]" : ""}`}>
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

      {icons.length === 3 && (
        <div className="absolute right-12 top-1/2 hidden h-24 w-44 -translate-y-1/2 sm:block">
          <Tile Icon={icons[0]} className="left-0 top-1 -rotate-6" />
          <Tile Icon={icons[1]} className="left-14 top-8 rotate-6" />
          <Tile Icon={icons[2]} className="right-0 top-0 rotate-6" />
        </div>
      )}
    </section>
  );
}