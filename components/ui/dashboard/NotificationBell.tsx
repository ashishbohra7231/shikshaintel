"use client";

import React, { useState, useEffect, useRef } from "react";
import ApiDataController from "@/controllers/masters";
import { Constants } from "@/constants/Constants";
import { FiBell, FiCheck } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

interface Notification {
  _id: string;
  message: string;
  type: "expiry_warning" | "expired" | "system";
  read: boolean;
  createdAt: string;
}

const NotificationBell = () => {
  const { t } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
      if (!token) return;

      const api = new ApiDataController(token);
      const res = await api.GetApiWithToken(Constants.notifications_url);
      if (res && res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("app-auth");
      if (!token) return;

      const api = new ApiDataController(token);
      await api.PatchApiWithToken(`${Constants.notifications_url}/${id}/read`, {});
      
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 text-gray-500 hover:${t.textPrimary} transition-colors bg-gray-100 rounded-full`}
      >
        <FiBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black ring-opacity-5">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Notifications</h3>
            {unreadCount > 0 && <span className={`text-[10px] ${t.bgLight} ${t.textPrimary} px-2 py-0.5 rounded-full font-bold uppercase`}>{unreadCount} New</span>}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p className="text-sm">All caught up!</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n._id} 
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors relative group ${!n.read ? `${t.bgLight}/30` : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${n.type === 'expired' ? 'bg-red-500' : n.type === 'expiry_warning' ? 'bg-amber-500' : t.bgPrimary}`} />
                    <div className="flex-1">
                      <p className={`text-sm leading-relaxed ${!n.read ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                        {n.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tight">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!n.read && (
                      <button 
                        onClick={() => markAsRead(n._id)}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 ${t.textPrimary} ${t.bgLight} rounded-lg h-fit`}
                        title="Mark as read"
                      >
                        <FiCheck className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
              <button className={`text-xs font-bold text-gray-500 hover:${t.textPrimary} transition-colors uppercase tracking-widest`}>
                View All Notification
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
