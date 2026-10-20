import { useEffect, useState } from "react";

// Free hosting par server so jata hai. Request 4 second se zyada lage to
// user ko batao ki wait karna normal hai.
export default function ServerWakeHint({ active, delay = 4000 }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!active) return undefined;

    const id = setTimeout(() => setSlow(true), delay);
    return () => {
      clearTimeout(id);
      setSlow(false);
    };
  }, [active, delay]);

  if (!active || !slow) return null;

  return (
    <p role="status" className="mt-2 text-center text-xs text-muted">
      The server is waking up. This can take up to a minute the first time.
    </p>
  );
}