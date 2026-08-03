"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationDropdown() {
  const { user, token } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications/me');
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user, token]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Mark as read in DB
      api.patch('/notifications/me/read').catch(console.error);
      // Optimistically update UI
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={handleOpen}
        className="relative p-2 text-secondaryText hover:text-luxuryGold transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-secondaryBg rounded-lg shadow-2xl border border-divider overflow-hidden z-50">
          <div className="p-4 bg-surface border-b border-divider flex justify-between items-center">
            <h3 className="font-serif text-primaryText text-lg">Notifications</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-secondaryText text-sm">
                You have no notifications.
              </div>
            ) : (
              <div className="divide-y divide-divider">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 transition-colors ${notification.isRead ? 'bg-secondaryBg' : 'bg-surface'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-medium ${notification.isRead ? 'text-secondaryText' : 'text-primaryText'}`}>
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-luxuryGold mt-1.5 flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-secondaryText mb-2 leading-relaxed">{notification.message}</p>
                    <p className="text-[10px] uppercase tracking-wider text-mutedText">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
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
