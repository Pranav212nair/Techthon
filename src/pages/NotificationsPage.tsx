import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/motionPresets";
import { Bell, AlertTriangle, Info, CheckCircle, Settings, Trash2, X } from "lucide-react";

interface Notification {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationPreferences {
  critical: boolean;
  warnings: boolean;
  info: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    critical: true,
    warnings: true,
    info: true,
    emailNotifications: false,
    pushNotifications: true,
  });

  useEffect(() => {
    // Load notifications from localStorage
    try {
      const stored = localStorage.getItem("notifications");
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        // Initialize with mock notifications
        const mockNotifications: Notification[] = [
          {
            id: "notif-001",
            type: "critical",
            title: "Battery Health Critical",
            message: "Your 12V battery voltage has dropped below safe levels. Schedule a battery check immediately.",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: false,
          },
          {
            id: "notif-002",
            type: "warning",
            title: "Service Due Soon",
            message: "Your next general service is due in 500 km. Book an appointment to avoid overdue.",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            read: false,
          },
          {
            id: "notif-003",
            type: "info",
            title: "Service Booking Confirmed",
            message: "Your appointment at AutoCare Hub on Dec 20, 2025 at 10:00 AM has been confirmed.",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            read: true,
          },
          {
            id: "notif-004",
            type: "success",
            title: "Tire Pressure Normalized",
            message: "Front-right tire pressure has returned to optimal levels.",
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            read: true,
          },
        ];
        setNotifications(mockNotifications);
        localStorage.setItem("notifications", JSON.stringify(mockNotifications));
      }

      const storedPrefs = localStorage.getItem("notification_preferences");
      if (storedPrefs) {
        setPreferences(JSON.parse(storedPrefs));
      }
    } catch {
      // ignore
    }
  }, []);

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
      localStorage.setItem("notifications", JSON.stringify([]));
    }
  };

  const savePreferences = () => {
    localStorage.setItem("notification_preferences", JSON.stringify(preferences));
    setShowPreferences(false);
    alert("Notification preferences saved!");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5" />;
      case "warning":
        return <Bell className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "critical":
        return { bg: "bg-danger/20", text: "text-danger", border: "border-danger/30" };
      case "warning":
        return { bg: "bg-warning/20", text: "text-warning", border: "border-warning/30" };
      case "info":
        return { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" };
      case "success":
        return { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" };
      default:
        return { bg: "bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/30" };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-200">Alerts</p>
          <h1 className="text-3xl font-semibold text-white">Notifications</h1>
          <p className="text-sm text-slate-300">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        <button
          onClick={() => setShowPreferences(!showPreferences)}
          className="inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-4 py-2 text-sm text-accent-200 ring-1 ring-accent-500/30 transition hover:bg-accent-500/30"
        >
          <Settings className="h-4 w-4" /> Preferences
        </button>
      </div>

      {/* Preferences Panel */}
      {showPreferences && (
        <motion.div
          {...fadeInUp}
          className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
            <button
              onClick={() => setShowPreferences(false)}
              className="rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">Alert Types</p>
              <label className="flex items-center justify-between rounded-xl border border-white/5 bg-panel/70 p-3">
                <span className="text-sm text-white">Critical Alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.critical}
                  onChange={(e) => setPreferences({ ...preferences, critical: e.target.checked })}
                  className="h-4 w-4 rounded accent-accent-500"
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-white/5 bg-panel/70 p-3">
                <span className="text-sm text-white">Warnings</span>
                <input
                  type="checkbox"
                  checked={preferences.warnings}
                  onChange={(e) => setPreferences({ ...preferences, warnings: e.target.checked })}
                  className="h-4 w-4 rounded accent-accent-500"
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-white/5 bg-panel/70 p-3">
                <span className="text-sm text-white">Info & Updates</span>
                <input
                  type="checkbox"
                  checked={preferences.info}
                  onChange={(e) => setPreferences({ ...preferences, info: e.target.checked })}
                  className="h-4 w-4 rounded accent-accent-500"
                />
              </label>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-200">Delivery Methods</p>
              <label className="flex items-center justify-between rounded-xl border border-white/5 bg-panel/70 p-3">
                <span className="text-sm text-white">Email Notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                  className="h-4 w-4 rounded accent-accent-500"
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-white/5 bg-panel/70 p-3">
                <span className="text-sm text-white">Push Notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.pushNotifications}
                  onChange={(e) => setPreferences({ ...preferences, pushNotifications: e.target.checked })}
                  className="h-4 w-4 rounded accent-accent-500"
                />
              </label>
            </div>

            <button
              onClick={savePreferences}
              className="w-full rounded-full bg-accent-500 px-4 py-3 font-semibold text-surface shadow-neon transition hover:bg-accent-400"
            >
              Save Preferences
            </button>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      {notifications.length > 0 && (
        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.05 }}
          className="flex gap-3"
        >
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-accent-300/50 hover:text-white"
            >
              <CheckCircle className="h-4 w-4" /> Mark All Read
            </button>
          )}
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-2 rounded-full border border-danger/30 bg-danger/10 px-4 py-2 text-sm text-danger transition hover:bg-danger/20"
          >
            <Trash2 className="h-4 w-4" /> Clear All
          </button>
        </motion.div>
      )}

      {/* Notifications List */}
      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.1 }}
        className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
      >
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <Bell className="mx-auto mb-3 h-12 w-12 text-slate-400" />
            <p className="text-lg text-slate-200">No notifications</p>
            <p className="mt-2 text-sm text-slate-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, idx) => {
              const colors = getColor(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`rounded-2xl border ${colors.border} ${
                    notification.read ? "bg-panel/30" : colors.bg
                  } p-4 transition hover:border-accent-500/30`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-lg ${colors.bg} p-2 ${colors.text}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-start justify-between gap-3">
                        <h3 className={`font-semibold ${notification.read ? "text-slate-300" : "text-white"}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{formatTimestamp(notification.timestamp)}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="rounded-full p-1 text-slate-400 transition hover:bg-danger/20 hover:text-danger"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm ${notification.read ? "text-slate-400" : "text-slate-200"}`}>
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <span className="mt-2 inline-flex items-center gap-1 text-xs text-accent-200">
                          <span className="h-2 w-2 rounded-full bg-accent-400"></span>
                          Unread
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default NotificationsPage;
