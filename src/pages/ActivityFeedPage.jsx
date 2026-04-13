import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import activityService from '../services/activityService';

function getActivityText(activity) {
  switch (activity.activityType) {
    case 'ADDED_GAME':
      return `added ${activity.gameTitle} to their library`;
    case 'STATUS_CHANGED':
      return `moved ${activity.gameTitle} to ${activity.details?.newStatus}`;
    default:
      return `updated ${activity.gameTitle}`;
  }
}

function getActivityIcon(type) {
  switch (type) {
    case 'ADDED_GAME': return '➕';
    case 'STATUS_CHANGED': return '🔄';
    default: return '🎮';
  }
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function ActivityFeedPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await activityService.getFeed();
        setActivities(data);
      } catch (err) {
        setError('Failed to load activity feed.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Orbitron' }}>
        📡 Activity Feed
      </h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-400 text-lg mb-2">No activity yet</p>
          <p className="text-gray-600 mb-6">Add friends and start tracking games to see activity here</p>
          <Link to="/friends" className="btn-primary px-8 py-3 rounded-xl">
            Find Friends
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="card p-4 flex gap-4 items-start">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {activity.username[0].toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300">
                  <Link
                    to={`/profile/${activity.username}`}
                    className="text-indigo-400 font-semibold hover:text-indigo-300"
                  >
                    {activity.username}
                  </Link>
                  {' '}{getActivityText(activity)}
                </p>

                {/* Game Cover */}
                {activity.details?.coverUrl && (
                  <Link to={`/game/${activity.rawgGameId}`}>
                    <div className="mt-2 flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                      <img
                        src={activity.details.coverUrl}
                        alt={activity.gameTitle}
                        className="w-12 h-8 object-cover rounded"
                      />
                      <span className="text-white text-sm font-medium">{activity.gameTitle}</span>
                    </div>
                  </Link>
                )}

                <p className="text-gray-600 text-xs mt-2">
                  {getActivityIcon(activity.activityType)} {timeAgo(activity.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityFeedPage;