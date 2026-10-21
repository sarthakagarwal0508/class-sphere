import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, BookOpen, Download, Layers } from "lucide-react";

import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import MaterialCard from "../../components/MaterialCard";
import Card from "../../components/Card";
import { courses, materials, recentlyOpened } from "../../data/mockData";

const tints = {
  yellow: "bg-tone-yellow",
  blue: "bg-tone-blue",
  green: "bg-tone-green",
};

const badges = {
  downloaded: { label: "Downloaded", style: "bg-tone-green text-tone-green-fg" },
  viewed: { label: "Viewed", style: "bg-tone-blue text-tone-blue-fg" },
};

const findCourse = (id) => courses.find((c) => c.id === id);

export default function StudyMaterial() {
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState("all");
  const filtersRef = useRef(null);

  const chips = [{ id: "all", label: "All" }, ...courses.map((c) => ({ id: c.id, label: c.name }))];

  const visible = materials.filter((m) => courseId === "all" || m.courseId === courseId);

  return (
    <div className="dashboard-stagger space-y-5">
      <Topbar
        title="Study Material"
        subtitle="Notes, PDFs and links shared by your teachers"
      />

      <HeroBanner
        variant="yellow"
        title="Everything your teachers shared"
        subtitle="Notes, PDFs and links, sorted by class and topic."
        buttonText="Browse by class"
        onButtonClick={() => filtersRef.current?.scrollIntoView({ behavior: "smooth" })}
        icons={[FileText, BookOpen, Download]}
      />

      <div ref={filtersRef} className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setCourseId(chip.id)}
            className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
              courseId === chip.id
                ? "border-brand bg-card font-bold text-ink"
                : "border-line bg-card text-muted hover:text-ink"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-sm text-muted">No material shared for this class yet.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((m) => (
          <MaterialCard
            key={m.id}
            material={m}
            course={findCourse(m.courseId)}
            onSummarize={(material) =>
              navigate("/student/notes-ai", { state: { materialId: material.id } })
            }
          />
        ))}
      </div>

      <section>
        <h2 className="text-xl font-extrabold">Recently opened</h2>

        <div className="mt-2 space-y-2">
          {recentlyOpened.map((r) => {
            const material = materials.find((m) => m.id === r.materialId);
            const course = findCourse(material.courseId);
            const badge = badges[r.action];
            const Icon = material.type === "Link" ? Layers : FileText;

            return (
              <Card key={r.id} className="flex items-center gap-3 p-3">
                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tints[course.color]}`}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold">{material.title}</h3>
                  <p className="text-xs text-muted">{r.openedAt}</p>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-bold ${badge.style}`}>
                  {badge.label}
                </span>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}