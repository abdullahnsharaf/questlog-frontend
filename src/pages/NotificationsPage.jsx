import { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getNotificationIcon(type) {
  switch (type) {
    case 'FRIEND_REQUEST': return '👋';
    case 'FRIEND_ACCEPTED': return '🤝';
    default: return '🔔';
  }
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleMarkAllRead() {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }

  async function handleMarkRead(id) {
    await notificationService.markAsRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Orbitron' }}>
          🔔 Notifications
          {unreadCount > 0 && (
            <span className="ml-3 text-sm bg-indigo-500 text-white px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="btn-outline px-4 py-2 rounded-xl text-sm"
          >
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔔</p>
          <p className="text-gray-400 text-lg">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => !notification.isRead && handleMarkRead(notification.id)}
              className={`card p-4 flex items-start gap-4 cursor-pointer transition ${
                !notification.isRead
                  ? 'border-indigo-500/40 bg-indigo-500/5'
                  : 'opacity-60'
              }`}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-lg flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-white text-sm">{notification.message}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {timeAgo(notification.createdAt)}
                </p>
              </div>

              {/* Unread dot */}
              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;