import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import friendService from '../services/friendService';

function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('friends');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [friendsData, pendingData] = await Promise.all([
        friendService.getMyFriends(),
        friendService.getPending(),
      ]);
      setFriends(friendsData);
      setPending(pendingData);
    } catch (err) {
      setError('Failed to load friends.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const results = await friendService.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError('Search failed.');
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleSendRequest(username) {
    try {
      await friendService.sendRequest(username);
      setSuccessMsg(`Friend request sent to ${username}!`);
      setSearchResults([]);
      setSearchQuery('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send request.');
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleAccept(id) {
    try {
      await friendService.acceptRequest(id);
      await loadData();
      setSuccessMsg('Friend request accepted!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to accept request.');
    }
  }

  async function handleReject(id) {
    try {
      await friendService.deleteRequest(id);
      setPending(prev => prev.filter(p => p.friendshipId !== id));
    } catch (err) {
      setError('Failed to reject request.');
    }
  }

  async function handleRemove(id) {
    if (!window.confirm('Remove this friend?')) return;
    try {
      await friendService.deleteRequest(id);
      setFriends(prev => prev.filter(f => f.friendshipId !== id));
    } catch (err) {
      setError('Failed to remove friend.');
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Orbitron' }}>
        👥 Friends
      </h1>

      {/* Messages */}
      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-4 mb-6">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* Search Users */}
      <div className="card p-6 mb-8">
        <h2 className="text-white font-semibold mb-4">Find Players</h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" disabled={searchLoading} className="btn-primary px-6 py-3 rounded-xl">
            {searchLoading ? '...' : 'Search'}
          </button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {searchResults.map(user => (
              <div key={user.username} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{user.username}</span>
                </div>
                <button
                  onClick={() => handleSendRequest(user.username)}
                  className="btn-primary px-4 py-2 rounded-lg text-sm"
                >
                  + Add Friend
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('friends')}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition border ${
            activeTab === 'friends'
              ? 'border-indigo-500 bg-indigo-500/20 text-white'
              : 'border-white/10 bg-white/5 text-gray-400'
          }`}
        >
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition border ${
            activeTab === 'pending'
              ? 'border-indigo-500 bg-indigo-500/20 text-white'
              : 'border-white/10 bg-white/5 text-gray-400'
          }`}
        >
          Pending {pending.length > 0 && (
            <span className="ml-1 bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/5 rounded w-1/3" />
                <div className="h-3 bg-white/5 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'friends' ? (
        friends.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">👥</p>
            <p className="text-gray-400 text-lg mb-2">No friends yet</p>
            <p className="text-gray-600">Search for players above to add friends</p>
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map(friend => (
              <div key={friend.friendshipId} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {friend.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{friend.username}</p>
                    <p className="text-gray-500 text-xs">Friends since {new Date(friend.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/profile/${friend.username}`}
                    className="btn-outline px-4 py-2 rounded-lg text-sm"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => handleRemove(friend.friendshipId)}
                    className="px-4 py-2 rounded-lg text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        pending.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400 text-lg">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(request => (
              <div key={request.friendshipId} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                    {request.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{request.username}</p>
                    <p className="text-gray-500 text-xs">Wants to be your friend</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(request.friendshipId)}
                    className="btn-primary px-4 py-2 rounded-lg text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request.friendshipId)}
                    className="px-4 py-2 rounded-lg text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default FriendsPage;