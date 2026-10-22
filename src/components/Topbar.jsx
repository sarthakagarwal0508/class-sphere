import { useState } from "react";
import { Search, Bell } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import PortalBackButton from "./PortalBackButton";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../services/announcementService";

export default function Topbar({
  title,
  subtitle,
  backFallbackPath = "/student/dashboard",
}) {
  const [notifications, setNotifications] = useState([]);
  const [notificationError, setNotificationError] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  async function loadNotifications() {
    setNotificationsLoading(true);
    setNotificationError("");
    try {
      const items = await getMyNotifications();
      setNotifications(items);
    } catch (error) {
      setNotificationError(error.message || "Could not load notifications.");
    } finally {
      setNotificationsLoading(false);
    }
  }

  function toggleNotifications() {
    const willOpen = !notificationsOpen;
    setNotificationsOpen(willOpen);
    if (willOpen) loadNotifications();
  }

  async function handleNotificationClick(notification) {
    const id = notification._id ?? notification.id;
    if (!id || notification.isRead || notification.read) return;

    try {
      await markNotificationAsRead(id);
      setNotifications((items) =>
        items.map((item) =>
          (item._id ?? item.id) === id
            ? { ...item, isRead: true, read: true }
            : item
        )
      );
      setNotificationError("");
    } catch (error) {
      setNotificationError(error.message || "Could not mark as read.");
    }
  }

  const unreadCount = notifications.filter(
    (item) => !item.isRead && !item.read
  ).length;

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <PortalBackButton fallbackPath={backFallbackPath} />
        <div className="min-w-0">
          {title && <h1 className="text-2xl font-extrabold leading-tight">{title}</h1>}
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden w-72 items-center gap-2 rounded-xl border border-line bg-card px-3 py-2 sm:flex">
          <Search size={15} className="text-muted" />
          <input
            className="w-full bg-transparent text-xs outline-none"
            placeholder="Search for classes, tasks, etc..."
          />
        </div>

        <ThemeToggle />

        <div className="relative">
          <button
            type="button"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={notificationsOpen}
            onClick={toggleNotifications}
            className="relative rounded-xl border border-line bg-card p-2.5 text-ink"
          >
          <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {notificationsOpen && (
            <div
              role="region"
              aria-label="Notifications"
              className="absolute right-0 z-50 mt-2 max-h-96 w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-card p-3 text-ink shadow-xl"
            >
              <h2 className="px-2 py-1 text-sm font-extrabold">
                Notifications
              </h2>
              {notificationsLoading ? (
                <p className="p-3 text-xs text-muted">Loading notifications...</p>
              ) : notificationError ? (
                <div className="p-3">
                  <p role="alert" className="text-xs text-tone-red-fg">
                    {notificationError}
                  </p>
                  <button
                    type="button"
                    onClick={loadNotifications}
                    className="mt-2 text-xs font-bold text-ink underline"
                  >
                    Try again
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <p className="p-3 text-xs text-muted">You’re all caught up.</p>
              ) : (
                <div className="mt-1 space-y-1">
                  {notifications.map((notification, index) => {
                    const id =
                      notification._id ?? notification.id ?? index;
                    const isRead = notification.isRead ?? notification.read;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full rounded-xl p-3 text-left transition hover:bg-soft ${
                          isRead ? "" : "bg-brand-soft"
                        }`}
                      >
                        <span className="block text-xs font-bold">
                          {notification.title || notification.message || "Notification"}
                        </span>
                        {notification.title && notification.message && (
                          <span className="mt-1 block text-xs text-muted">
                            {notification.message}
                          </span>
                        )}
                        {notification.createdAt && (
                          <span className="mt-1 block text-[10px] text-muted">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}