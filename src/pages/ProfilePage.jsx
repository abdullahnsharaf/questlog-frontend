import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import activityService from '../services/activityService';

const STATUS_COLORS = {
  PLAYING: 'bg-green-500/20 text-green-400',
  COMPLETED: 'bg-blue-500/20 text-blue-400',
  WISHLIST: 'bg-yellow-500/20 text-yellow-400',
  ON_HOLD: 'bg-orange-500/20 text-orange-400',
  DROPPED: 'bg-red-500/20 text-red-400',
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = !username || username === currentUser?.username;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [profileData, activityData] = await Promise.all([
          isOwnProfile
            ? userService.getMyProfile()
            : userService.getPublicProfile(username),
          isOwnProfile
            ? activityService.getFeed()
            : activityService.getUserActivity(username),
        ]);
        setProfile(profileData);
        setActivities(activityData.slice(0, 5));
      } catch (err) {
        setError('Profile not found.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400 text-xl">{error || 'Profile not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">

      {/* Profile Header */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
            {profile.username[0].toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Orbitron' }}>
              {profile.username}
            </h1>
            {profile.bio && (
              <p className="text-gray-400 mb-4">{profile.bio}</p>
            )}
            <p className="text-gray-600 text-sm">
              Member since {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long'
              })}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Total Games', value: profile.stats.totalGames, icon: '🎮' },
            { label: 'Playing', value: profile.stats.playing, icon: '▶️' },
            { label: 'Completed', value: profile.stats.completed, icon: '✅' },
            { label: 'Wishlist', value: profile.stats.wishlist, icon: '⭐' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Games */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Recent Games</h2>
          {profile.recentGames.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-500">No games yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.recentGames.map(game => (
                <Link
                  key={game.id}
                  to={`/game/${game.rawgGameId}`}
                  className="card p-3 flex items-center gap-3 hover:border-indigo-500/50 transition block"
                >
                  {game.gameCoverUrl && (
                    <img
                      src={game.gameCoverUrl}
                      alt={game.gameTitle}
                      className="w-14 h-10 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{game.gameTitle}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[game.status]}`}>
                      {game.status}
                    </span>
                  </div>
                  {game.personalRating && (
                    <span className="text-yellow-400 text-sm font-bold">⭐ {game.personalRating}</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          {activities.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-500">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map(activity => (
                <div key={activity.id} className="card p-3 flex items-center gap-3">
                  {activity.details?.coverUrl && (
                    <img
                      src={activity.details.coverUrl}
                      alt={activity.gameTitle}
                      className="w-14 h-10 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{activity.gameTitle}</p>
                    <p className="text-gray-500 text-xs">
                      {activity.activityType === 'ADDED_GAME' ? 'Added to library' : `→ ${activity.details?.newStatus}`}
                    </p>
                  </div>
                  <p className="text-gray-600 text-xs flex-shrink-0">{timeAgo(activity.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;