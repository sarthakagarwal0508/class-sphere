import { useEffect, useState } from "react";
import { Megaphone, Search, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Card from "../../components/Card";
import { getClassroomAnnouncements } from "../../services/announcementService";
import { fetchMyClassrooms } from "../../services/classroomService";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    fetchMyClassrooms()
      .then((classrooms) =>
        Promise.all(
          classrooms.map(async (classroom) => {
            const classroomId = classroom._id ?? classroom.id;
            const items = await getClassroomAnnouncements(classroomId);
            return items.map((item) => ({
              ...item,
              classroom: item.classroom?.name ?? classroom.name ?? classroom.title,
            }));
          })
        )
      )
      .then((groups) => {
        if (active) setAnnouncements(groups.flat());
      })
      .catch((err) => {
        if (active) {
          setError(err);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = announcements.filter((item) => {
    const text = [
      item.title,
      item.content,
      item.message,
      item.classroom,
      item.class,
      item.teacher?.name,
      item.teacherName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen">
      <Topbar
        title="Announcements"
        subtitle="Important updates and messages from your teachers"
      />

      <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <HeroBanner
          eyebrow="STAY UPDATED"
          title="Announcements"
          description="Important updates and messages from your teachers."
        />

        <Card>
          <div className="relative p-4">
            <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-yellow-500"
            />
          </div>
        </Card>

        {loading ? (
          <p className="py-8 text-center text-gray-500">
            Loading announcements...
          </p>
        ) : error ? (
          <Card>
            <div className="space-y-3 p-6 text-center">
              <p className="text-red-600">
                {error.status === 401
                  ? "Please sign in to view announcements."
                  : error.message || "Failed to load announcements."}
              </p>
              {error.status === 401 && (
                <Link
                  to="/login"
                  className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-on-brand"
                >
                  Sign in
                </Link>
              )}
            </div>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <div className="p-8 text-center">
              <Megaphone className="mx-auto mb-3 h-8 w-8 text-gray-400" />
              <p className="font-semibold">No announcements found</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((item, index) => (
              <Card key={item._id ?? item.id ?? index}>
                <div className="flex gap-4 p-5">
                  <div className="hidden h-fit rounded-xl bg-yellow-100 p-3 sm:block">
                    <Megaphone className="h-6 w-6 text-yellow-700" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-gray-800">
                      {item.title}
                    </h2>

                    {(item.classroom || item.class) && (
                      <p className="mt-1 text-sm font-medium text-gray-500">
                        {item.classroom || item.class}
                      </p>
                    )}

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-muted">
                      {item.content ?? item.message}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span>
                        {item.teacher?.name ||
                          item.teacherName ||
                          item.teacher ||
                          "Teacher"}
                      </span>

                      {item.createdAt && (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}