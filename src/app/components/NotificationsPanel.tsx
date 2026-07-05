import { Bell, Calendar, CheckCircle, AlertCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState, useRef, useEffect } from "react";

interface Notification {
  id: number;
  type: "event" | "approval" | "reminder" | "announcement";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "event",
    title: "New Event Available",
    message: "Tech Talk: AI in Modern Development is now open for registration",
    time: "2 hours ago",
    read: false
  },
  {
    id: 2,
    type: "reminder",
    title: "Event Reminder",
    message: "Spring Networking Mixer is tomorrow at 7:00 PM",
    time: "5 hours ago",
    read: false
  },
  {
    id: 3,
    type: "approval",
    title: "Registration Confirmed",
    message: "You're registered for Photography Workshop",
    time: "1 day ago",
    read: true
  },
  {
    id: 4,
    type: "announcement",
    title: "Club Announcement",
    message: "Computer Science Club meeting this Friday",
    time: "2 days ago",
    read: true
  },
];

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="w-4 h-4 text-[#1E3A8A]" />;
      case "approval":
        return <CheckCircle className="w-4 h-4 text-[#10B981]" />;
      case "reminder":
        return <AlertCircle className="w-4 h-4 text-[#F59E0B]" />;
      default:
        return <Bell className="w-4 h-4 text-[#6B7280]" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-blue-800 transition-colors"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-[#E5E7EB] z-50 max-h-[32rem] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
            <div>
              <h3 className="font-semibold text-[#1F2937]">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-[#6B7280]">{unreadCount} unread</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-[#1E3A8A]"
                >
                  Mark all read
                </Button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#6B7280] hover:text-[#1F2937]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length > 0 ? (
              <div className="divide-y divide-[#E5E7EB]">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-[#EFF6FF] hover:bg-[#DBEAFE]' : 'hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        notification.type === 'event' ? 'bg-[#DBEAFE]' :
                        notification.type === 'approval' ? 'bg-[#D1FAE5]' :
                        notification.type === 'reminder' ? 'bg-[#FEF3C7]' :
                        'bg-[#E5E7EB]'
                      }`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm text-[#1F2937]">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#1E3A8A] rounded-full mt-1.5 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-[#E5E7EB] mx-auto mb-3" />
                <p className="text-sm text-[#6B7280]">No notifications</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-[#E5E7EB]">
              <Button
                variant="ghost"
                className="w-full text-[#1E3A8A] hover:bg-[#EFF6FF]"
              >
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
