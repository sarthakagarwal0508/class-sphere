import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PortalBackButton({ fallbackPath }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(window.history.state?.idx > 0 ? -1 : fallbackPath);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-soft"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}
