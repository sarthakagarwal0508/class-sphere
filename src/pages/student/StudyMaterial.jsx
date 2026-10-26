import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, BookOpen, Download } from "lucide-react";

import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import MaterialCard from "../../components/MaterialCard";
import Card from "../../components/Card";
import { fetchMyClassrooms } from "../../services/classroomService";
import { fetchClassroomMaterials, downloadMaterial } from "../../services/materialService";

const colors = ["yellow", "blue", "green"];

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? response;
}

function listFrom(response, key) {
  const data = unwrap(response);
  return Array.isArray(data) ? data : data?.[key] ?? [];
}

function materialIdOf(material) {
  return material?._id ?? material?.id;
}

function normalizeMaterial(material, classroom, color) {
  return {
    ...material,
    id: materialIdOf(material),
    title: material.title ?? material.name ?? material.originalName ?? "Study material",
    topic: material.topic ?? material.description ?? "Class notes",
    type: material.type ?? material.mimeType ?? material.contentType ?? "PDF",
    detail: material.fileSize
      ? `${(material.fileSize / (1024 * 1024)).toFixed(1)} MB`
      : material.fileName ?? material.originalName ?? "Shared file",
    courseId: classroom._id ?? classroom.id,
    course: {
      name: classroom.name ?? classroom.title ?? "Classroom",
      color,
    },
    classroomId: classroom._id ?? classroom.id,
  };
}

export default function StudyMaterial() {
  const navigate = useNavigate();
  const filtersRef = useRef(null);
  const [classrooms, setClassrooms] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [courseId, setCourseId] = useState("all");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [downloadingId, setDownloadingId] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    fetchMyClassrooms()
      .then(async (classroomsResult) => {
        const classroomList = listFrom(classroomsResult, "classrooms");
        const materialGroups = await Promise.all(
          classroomList.map(async (classroom, index) => {
            const classroomId = classroom._id ?? classroom.id;
            if (!classroomId) return [];
            const response = await fetchClassroomMaterials(classroomId);
            return listFrom(response, "materials").map((material) =>
              normalizeMaterial(material, classroom, colors[index % colors.length])
            );
          })
        );
        if (active) {
          setClassrooms(classroomList);
          setMaterials(materialGroups.flat());
          setStatus("ready");
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message || "Could not load study materials.");
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const chips = useMemo(
    () => [
      { id: "all", label: "All classes" },
      ...classrooms.map((classroom) => ({
        id: String(classroom._id ?? classroom.id),
        label: classroom.name ?? classroom.title ?? "Classroom",
      })),
    ],
    [classrooms]
  );

  const visible = materials.filter(
    (material) => courseId === "all" || String(material.courseId) === courseId
  );

  async function handleDownload(material) {
    const fileUrl = material.url ?? material.fileUrl;
    if (String(material.type).toLowerCase() === "link" && fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      return;
    }
    const id = materialIdOf(material);
    if (!id) {
      setDownloadError("This material does not have a valid download ID.");
      return;
    }

    setDownloadingId(String(id));
    setDownloadError("");
    try {
      const fileName =
        material.fileName ??
        material.originalName ??
        `${material.title || "study-material"}.pdf`;
      await downloadMaterial(id, fileName);
    } catch (downloadFailure) {
      setDownloadError(downloadFailure.message || "Could not download this file.");
    } finally {
      setDownloadingId("");
    }
  }

  return (
    <div className="dashboard-stagger space-y-5">
      <Topbar
        title="Study Material"
        subtitle="Notes, PDFs and links shared by your teachers"
      />

      <HeroBanner
        variant="yellow"
        title="Everything your teachers shared"
        subtitle="Browse class notes, download files, or summarize a PDF."
        buttonText="Browse by class"
        onButtonClick={() => filtersRef.current?.scrollIntoView({ behavior: "smooth" })}
        icons={[FileText, BookOpen, Download]}
      />

      {error && (
        <Card className="flex items-center justify-between gap-3 p-4 text-sm text-tone-red-fg" role="alert">
          <span>
            {error}
            {/authentication token|required|unauthorized/i.test(error) && (
              <>
                {" "}
                <Link to="/login" className="font-bold underline">
                  Sign in again
                </Link>
              </>
            )}
          </span>
          <button
            type="button"
            onClick={() => {
              setError("");
              setStatus("loading");
              setReloadKey((key) => key + 1);
            }}
            className="shrink-0 font-bold underline"
          >
            Try again
          </button>
        </Card>
      )}
      {downloadError && (
        <Card className="p-4 text-sm text-tone-red-fg" role="alert">
          {downloadError}
        </Card>
      )}

      <div ref={filtersRef} className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
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

      {status === "loading" ? (
        <Card className="p-8 text-center text-sm text-muted">
          Loading study materials...
        </Card>
      ) : status === "ready" && visible.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted">
          {classrooms.length
            ? "No material has been shared for this class yet."
            : "Join a class to see study materials shared by your teachers."}
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((material, index) => (
            <MaterialCard
              key={material.id ?? `${material.courseId}-${index}`}
              material={material}
              course={material.course}
              downloading={downloadingId === String(material.id)}
              onOpen={handleDownload}
              onSummarize={(selectedMaterial) =>
                navigate("/student/notes-ai", {
                  state: {
                    material: {
                      id: selectedMaterial.id,
                      classroomId: selectedMaterial.classroomId,
                      title: selectedMaterial.title,
                      courseName: selectedMaterial.course?.name,
                    },
                  },
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
