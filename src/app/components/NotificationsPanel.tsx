import { AlertCircle, Bell, Calendar, CheckCircle, Trash2, X } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Button } from "./ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

interface Notification {
  _id: string;
  type: string;
  category: "EVENTS" | "CLUBS" | "REGISTRATIONS" | "SYSTEM";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

const formatTime = (value: string) => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const notificationNumber = (id: string) =>
  Math.abs([...id].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) | 0, 0)) || 1;

const showNewPhoneNotifications = async (userId: string, items: Notification[]) => {
  if (!Capacitor.isNativePlatform()) return;
  const storageKey = `uniClubSeenPhoneNotifications:${userId}`;
  const storedIds = localStorage.getItem(storageKey);
  const currentIds = items.map((item) => item._id);

  if (!storedIds) {
    localStorage.setItem(storageKey, JSON.stringify(currentIds));
    return;
  }

  const seenIds = new Set<string>(JSON.parse(storedIds));
  const newItems = items.filter((item) => !item.isRead && !seenIds.has(item._id));
  if (newItems.length) {
    const permission = await LocalNotifications.checkPermissions();
    if (permission.display === "granted") {
      await LocalNotifications.schedule({
        notifications: newItems.map((item) => ({
          id: notificationNumber(item._id),
          title: item.title,
          body: item.message,
          schedule: { at: new Date(Date.now() + 500) },
          extra: { actionUrl: item.actionUrl, notificationId: item._id },
        })),
      });
    }
  }
  localStorage.setItem(storageKey, JSON.stringify([...new Set([...seenIds, ...currentIds])].slice(-200)));
};

export function NotificationsPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async (showLoading = false) => {
    if (!user) return;
    if (showLoading) setLoading(true);
    try {
      const [listResponse, countResponse] = await Promise.all([
        apiFetch("/api/notifications?limit=20"),
        apiFetch("/api/notifications/unread-count"),
      ]);
      const loadedNotifications = listResponse.notifications || [];
      setNotifications(loadedNotifications);
      setUnreadCount(countResponse.count || 0);
      await showNewPhoneNotifications(String(user._id), loadedNotifications);
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Unable to load notifications");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotifications(true);
    const pollingId = window.setInterval(() => loadNotifications(), 30000);
    return () => window.clearInterval(pollingId);
  }, [loadNotifications]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    LocalNotifications.requestPermissions();
    const listener = LocalNotifications.addListener("localNotificationActionPerformed", (action) => {
      const actionUrl = action.notification.extra?.actionUrl;
      if (actionUrl) navigate(actionUrl);
    });
    return () => {
      listener.then((handle) => handle.remove());
    };
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const openNotification = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await apiFetch(`/api/notifications/${notification._id}/read`, { method: "PATCH" });
        setNotifications((items) =>
          items.map((item) => item._id === notification._id ? { ...item, isRead: true } : item)
        );
        setUnreadCount((count) => Math.max(0, count - 1));
      } catch (err) {
        setError((err as Error).message);
        return;
      }
    }
    setIsOpen(false);
    if (notification.actionUrl) navigate(notification.actionUrl);
  };

  const markAllAsRead = async () => {
    try {
      await apiFetch("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const removeNotification = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    try {
      await apiFetch(`/api/notifications/${id}`, { method: "DELETE" });
      const removed = notifications.find((item) => item._id === id);
      setNotifications((items) => items.filter((item) => item._id !== id));
      if (removed && !removed.isRead) setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const getIcon = (notification: Notification) => {
    if (notification.priority === "HIGH" || notification.priority === "URGENT") {
      return <AlertCircle className="w-4 h-4 text-[#EF4444]" />;
    }
    if (notification.category === "EVENTS") return <Calendar className="w-4 h-4 text-[#1E3A8A]" />;
    if (notification.category === "REGISTRATIONS") return <CheckCircle className="w-4 h-4 text-[#10B981]" />;
    return <Bell className="w-4 h-4 text-[#6B7280]" />;
  };

  if (!user) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => {
          setIsOpen((open) => !open);
          if (!isOpen) loadNotifications(true);
        }}
        className="relative p-2 rounded-lg hover:bg-blue-800 transition-colors"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-xs font-semibold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed left-3 right-3 top-24 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96 bg-white rounded-lg shadow-xl border border-[#E5E7EB] z-[60] max-h-[70vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
            <div>
              <h3 className="font-semibold text-[#1F2937]">Notifications</h3>
              <p className="text-xs text-[#6B7280]">{unreadCount} unread</p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs text-[#1E3A8A]">
                  Mark all read
                </Button>
              )}
              <button onClick={() => setIsOpen(false)} aria-label="Close notifications">
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {loading && notifications.length === 0 ? (
              <p className="p-8 text-center text-sm text-[#6B7280]">Loading notifications…</p>
            ) : error && notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-red-600 mb-3">{error}</p>
                <Button size="sm" variant="outline" onClick={() => loadNotifications(true)}>Try again</Button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-[#E5E7EB] mx-auto mb-3" />
                <p className="text-sm text-[#6B7280]">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E5E7EB]">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => openNotification(notification)}
                    className={`p-4 cursor-pointer transition-colors ${
                      !notification.isRead ? "bg-[#EFF6FF] hover:bg-[#DBEAFE]" : "hover:bg-[#F9FAFB]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-white border border-[#E5E7EB]">
                        {getIcon(notification)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm text-[#1F2937]">{notification.title}</p>
                          <div className="flex items-center gap-2">
                            {!notification.isRead && <span className="w-2 h-2 bg-[#1E3A8A] rounded-full" />}
                            <button
                              onClick={(event) => removeNotification(event, notification._id)}
                              className="text-[#9CA3AF] hover:text-[#EF4444]"
                              aria-label="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-[#9CA3AF]">{formatTime(notification.createdAt)}</p>
                          <span className={`text-[10px] font-semibold ${
                            notification.priority === "URGENT" || notification.priority === "HIGH"
                              ? "text-[#EF4444]"
                              : "text-[#6B7280]"
                          }`}>{notification.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
