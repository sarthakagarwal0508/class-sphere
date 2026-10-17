import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  error,
  hint,
  ...rest
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && visible ? "text" : type;

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border bg-card px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/30 ${
            error ? "border-tone-red-fg" : "border-line"
          } ${isPassword ? "pr-10" : ""}`}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted transition hover:text-ink"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-semibold text-tone-red-fg">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}