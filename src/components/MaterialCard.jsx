import { FileText, Layers, Download, ExternalLink, Sparkles } from "lucide-react";
import Card from "./Card";

const tints = {
  yellow: "bg-tone-yellow",
  blue: "bg-tone-blue",
  green: "bg-tone-green",
};

export default function MaterialCard({
  material,
  course = { name: "Classroom", color: "yellow" },
  downloading = false,
  onOpen,
  onSummarize,
}) {
  const { title, topic, type, detail } = material;
  const isLink = String(type).toLowerCase() === "link";
  const Icon = isLink ? Layers : FileText;

  return (
    <Card className="p-4">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${tints[course.color] ?? tints.yellow}`}>
        <Icon size={18} />
      </div>

      <h3 className="mt-3 text-base font-bold leading-tight">{title}</h3>
      <p className="text-sm text-muted">{course.name ?? "Classroom"}</p>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="rounded-full bg-tone-yellow px-2.5 py-0.5 font-semibold text-tone-yellow-fg">
          {topic}
        </span>
        <span>
          {type}, {detail}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onOpen?.(material)}
          disabled={downloading}
          className="flex items-center gap-1.5 rounded-lg bg-panel px-3 py-2 text-xs font-bold text-white"
        >
          {isLink ? <ExternalLink size={13} /> : <Download size={13} />}
          {isLink ? "Open" : downloading ? "Downloading..." : "Download"}
        </button>

        {!isLink && (
          <button
            type="button"
            onClick={() => onSummarize?.(material)}
            className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-on-brand"
          >
            <Sparkles size={13} />
            Summarize
          </button>
        )}
      </div>
    </Card>
  );
}