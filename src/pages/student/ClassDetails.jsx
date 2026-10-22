import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Download,
  FileText,
  FolderOpen,
  GraduationCap,
} from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import Card from "../../components/Card";
import HeroBanner from "../../components/HeroBanner";
import Topbar from "../../components/Topbar";
import { classesData } from "../../data/classes";
import {
  fetchClassroomMaterials,
  getDownloadMaterialUrl,
} from "../../services/materialService";

export default function ClassDetails() {
  const { classId } = useParams();
  const classroom = classesData.find((item) => String(item.id) === classId);
  const [materials, setMaterials] = useState([]);
  const [loadState, setLoadState] = useState({
    classId: null,
    status: "loading",
  });
  const [reloadKey, setReloadKey] = useState(0);
  const status =
    loadState.classId === classId ? loadState.status : "loading";

  useEffect(() => {
    if (!classroom) return undefined;
    let ignore = false;

    fetchClassroomMaterials(classroom.id)
      .then((response) => {
        if (ignore) return;

        const payload = response?.data ?? response;
        const items = Array.isArray(payload)
          ? payload
          : payload?.materials ?? [];
        setMaterials(items);
        setLoadState({ classId, status: "ready" });
      })
      .catch(() => {
        if (!ignore) setLoadState({ classId, status: "error" });
      });

    return () => {
      ignore = true;
    };
  }, [classroom, classId, reloadKey]);

  if (!classroom) {
    return <Navigate to="/student/classes" replace />;
  }

  return (
    <div className="space-y-5">
      <Topbar
        title={classroom.name}
        subtitle={`Class code: ${classroom.code}`}
        backFallbackPath="/student/classes"
      />

      <HeroBanner
        variant="navy"
        eyebrow="YOUR CLASS"
        title={classroom.name}
        subtitle={`Learn with ${classroom.teacher} · ${classroom.code}`}
        icons={[BookOpen, GraduationCap, CalendarDays]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-tone-blue text-tone-blue-fg">
              <GraduationCap size={21} />
            </div>
            <div>
              <p className="text-xs text-muted">Teacher</p>
              <p className="font-bold text-ink">{classroom.teacher}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-tone-yellow text-tone-yellow-fg">
              <CalendarDays size={20} />
            </div>
            <div>
              <p className="text-xs text-muted">Next class</p>
              <p className="font-bold text-ink">{classroom.schedule}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-ink">Course progress</h2>
            <p className="mt-1 text-xs text-muted">
              Your current progress in this class
            </p>
          </div>
          <span className="text-lg font-extrabold text-ink">
            {classroom.progress}%
          </span>
        </div>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-soft"
          role="progressbar"
          aria-valuenow={classroom.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${classroom.name} progress`}
        >
          <div
            className={`h-full rounded-full bg-gradient-to-r ${classroom.color}`}
            style={{ width: `${classroom.progress}%` }}
          />
        </div>
      </Card>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-extrabold text-ink">Class notes</h2>
          <p className="mt-0.5 text-xs text-muted">
            Materials and PDFs shared by your teacher
          </p>
        </div>

        {status === "loading" ? (
          <Card className="p-5 text-center text-sm text-muted">
            Loading class notes...
          </Card>
        ) : status === "error" ? (
          <Card className="p-5 text-center">
            <p className="text-sm font-semibold text-ink">
              Could not load notes for this class.
            </p>
            <button
              type="button"
              onClick={() => {
                setLoadState({ classId, status: "loading" });
                setReloadKey((key) => key + 1);
              }}
              className="mt-3 rounded-lg bg-brand px-4 py-2 text-xs font-bold text-on-brand"
            >
              Try again
            </button>
          </Card>
        ) : materials.length === 0 ? (
          <Card className="p-8 text-center">
            <FolderOpen className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-3 font-bold text-ink">No notes shared yet</p>
            <p className="mt-1 text-sm text-muted">
              Your teacher’s uploaded notes will appear here.
            </p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {materials.map((material, index) => {
              const materialId = material._id ?? material.id;
              const key = materialId ?? `${material.title}-${index}`;

              return (
                <Card
                  key={key}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tone-yellow text-tone-yellow-fg">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-ink">
                        {material.title || "Class notes"}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {material.description || "PDF shared by your teacher"}
                      </p>
                    </div>
                  </div>
                  {materialId && (
                    <a
                      href={getDownloadMaterialUrl(materialId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Download ${material.title || "class notes"}`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-soft text-ink transition hover:bg-brand-soft"
                    >
                      <Download size={16} />
                    </a>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
