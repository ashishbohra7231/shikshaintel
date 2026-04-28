"use client";

import ApiDataController from "@/controllers/masters";
import React, { useEffect, useState, useCallback } from "react";
import { 
  FiAlertTriangle, 
  FiXCircle, 
  FiInfo, 
  FiRefreshCw, 
  FiBell 
} from "react-icons/fi";
import { Constants } from "@/constants/Constants";

// ── Types ──────────────────────────────────────────────────────────────────
interface Notification {
  _id: string;
  message: string;
  type: "expiry_warning" | "expired" | "system";
  read: boolean;
  createdAt: string;
  libraryId?: string;
  studentId?: {
    _id: string;
    name: string;
    seatNumber?: string;
  } | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function typeConfig(type: Notification["type"]) {
  switch (type) {
    case "expiry_warning":
      return {
        label: "Expiry Warning",
        icon: <FiAlertTriangle size={16} strokeWidth={2.5} />,
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        iconBg: "bg-amber-50 text-amber-500",
        dot: "bg-amber-400",
      };
    case "expired":
      return {
        label: "Subscription Expired",
        icon: <FiXCircle size={16} strokeWidth={2.5} />,
        badge: "bg-rose-100 text-rose-700 border-rose-200",
        iconBg: "bg-rose-50 text-rose-500",
        dot: "bg-rose-400",
      };
    default:
      return {
        label: "System",
        icon: <FiInfo size={16} strokeWidth={2.5} />,
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        iconBg: "bg-blue-50 text-blue-500",
        dot: "bg-blue-400",
      };
  }
}

// ── Component ──────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "expiry_warning" | "expired" | "system">("all");
  const [markingId, setMarkingId] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const apiController = new ApiDataController(token);
      const data = await apiController.GetApiWithToken(Constants.notifications_url);
      const items: Notification[] = data?.notifications || data || [];
      setNotifications(items);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      setMarkingId(id);
      const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
      if (!token) return;
      const apiController = new ApiDataController(token);
      await apiController.PatchApiWithToken(`${Constants.notifications_url}/${id}/read`, {});
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    } finally {
      setMarkingId(null);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await markAsRead(n._id);
    }
  };

  // Filtered list
  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "all") return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full mx-auto pb-14">

      {/* ── Page Header ── */}
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 bg-violet-500/10 p-8 rounded-xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread alert${unreadCount > 1 ? "s" : ""}.`
              : "You are all caught up!"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={fetchNotifications}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 transition-colors"
          >
            <FiRefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "unread", "expiry_warning", "expired", "system"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`text-xs font-bold px-4 py-1.5 rounded-lg border transition-all ${
              filter === tab
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            {tab === "expiry_warning" ? "Expiry Warnings" : tab === "expired" ? "Expired" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "unread" && unreadCount > 0 && (
              <span className="ml-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse flex gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-2 bg-slate-100 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-8 text-center">
          <p className="text-rose-600 font-bold text-sm mb-3">{error}</p>
          <button onClick={fetchNotifications} className="text-xs font-bold text-rose-600 border border-rose-200 px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-slate-300">
            <FiBell size={24} />
          </div>
          <p className="text-slate-900 font-bold text-lg">No notifications found</p>
          <p className="text-slate-500 text-sm mt-1">
            {filter === "unread" ? "You have read everything." : "There are no notifications in this category."}
          </p>
        </div>
      )}

      {/* ── Notification List ── */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(notification => {
            const cfg = typeConfig(notification.type);
            return (
              <div
                key={notification._id}
                className={`bg-white rounded-xl border transition-all ${
                  notification.read
                    ? "border-slate-100 opacity-60"
                    : "border-slate-200 shadow-sm"
                }`}
              >
                <div className="p-5 flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                      {notification.studentId?.name && (
                        <span className="text-xs font-semibold text-slate-500">
                          · {notification.studentId.name}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-semibold leading-relaxed ${notification.read ? "text-slate-500" : "text-slate-900"}`}>
                      {notification.message}
                    </p>
                    <p className="text-[11px] font-medium text-slate-400 mt-1">
                      {timeAgo(notification.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      disabled={markingId === notification._id}
                      className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors border border-slate-200 px-3 py-1.5 rounded-lg disabled:opacity-50"
                    >
                      {markingId === notification._id ? "..." : "Mark Read"}
                    </button>
                  )}
                  {notification.read && (
                    <div className="text-[11px] font-semibold text-slate-300 px-3 py-1.5">
                      Completed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Summary Footer ── */}
      {!loading && notifications.length > 0 && (
        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mt-8">
          Showing {filtered.length} of {notifications.length} notifications
        </p>
      )}
    </div>
  );
}
