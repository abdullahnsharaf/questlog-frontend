import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import libraryService from '../services/libraryService';

const STATUS_TABS = [
  { value: 'ALL', label: '🎮 All Games' },
  { value: 'PLAYING', label: '▶️ Playing' },
  { value: 'COMPLETED', label: '✅ Completed' },
  { value: 'WISHLIST', label: '⭐ Wishlist' },
  { value: 'ON_HOLD', label: '⏸️ On Hold' },
  { value: 'DROPPED', label: '❌ Dropped' },
];

const STATUS_COLORS = {
  PLAYING: 'bg-green-500/20 text-green-400 border-green-500/30',
  COMPLETED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  WISHLIST: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  ON_HOLD: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  DROPPED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const STATUS_OPTIONS = [
  { value: 'PLAYING', label: '▶️ Playing' },
  { value: 'COMPLETED', label: '✅ Completed' },
  { value: 'WISHLIST', label: '⭐ Wishlist' },
  { value: 'ON_HOLD', label: '⏸️ On Hold' },
  { value: 'DROPPED', label: '❌ Dropped' },
];

// Edit Modal Component
function EditGameModal({ game, onClose, onSave }) {
  const [status, setStatus] = useState(game.status);
  const [rating, setRating] = useState(game.personalRating || 0);
  const [hours, setHours] = useState(game.hoursPlayed || '');
  const [review, setReview] = useState(game.reviewText || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const updated = await libraryService.updateGame(game.id, {
        status,
        personalRating: rating > 0 ? rating : null,
        hoursPlayed: hours ? parseFloat(hours) : null,
        reviewText: review || null,
      });
      onSave(updated);
      onClose();
    } catch (err) {
      setError('Failed to update game.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl p-6 w-full max-w-md border border-indigo-500/30 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Edit Game</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="flex gap-3 mb-6 p-3 bg-white/5 rounded-xl">
          {game.gameCoverUrl && (
            <img src={game.gameCoverUrl} alt={game.gameTitle}
              className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
          )}
          <div>
            <p className="text-white font-semibold text-sm">{game.gameTitle}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`py-2 px-3 rounded-lg text-sm transition border ${
                    status === opt.value
                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-indigo-500/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Your Rating {rating > 0 ? `(${rating}/10)` : '(optional)'}
            </label>
            <div className="flex gap-1">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(rating === n ? 0 : n)}
                  className={`flex-1 py-2 rounded text-xs font-bold transition ${
                    n <= rating
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/5 text-gray-500 hover:bg-indigo-500/30'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Hours Played (optional)</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="0"
              min="0"
              step="0.5"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Review */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Review (optional)</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What do you think of this game?"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Main Library Page
function LibraryPage() {
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingGame, setEditingGame] = useState(null);

  useEffect(() => {
    loadGames();
  }, [activeTab]);

  async function loadGames() {
    setLoading(true);
    setError('');
    try {
      const data = activeTab === 'ALL'
        ? await libraryService.getMyLibrary()
        : await libraryService.getByStatus(activeTab);
      setGames(data);
    } catch (err) {
      setError('Failed to load library.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this game from your library?')) return;
    try {
      await libraryService.deleteGame(id);
      setGames(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      alert('Failed to remove game.');
    }
  }

  function handleSave(updated) {
    setGames(prev => prev.map(g => g.id === updated.id ? updated : g));
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">

      {/* Edit Modal */}
      {editingGame && (
        <EditGameModal
          game={editingGame}
          onClose={() => setEditingGame(null)}
          onSave={handleSave}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Orbitron' }}>
          📚 My Library
        </h1>
        <Link to="/search" className="btn-primary px-5 py-2 rounded-xl text-sm">
          + Add Games
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
              activeTab === tab.value
                ? 'border-indigo-500 bg-indigo-500/20 text-white'
                : 'border-white/10 bg-white/5 text-gray-400 hover:border-indigo-500/50'
            }`}
          >
            {tab.label}
            {activeTab === tab.value && games.length > 0 && (
              <span className="ml-2 text-xs text-indigo-400">({games.length})</span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="card overflow-hidden h-72 animate-pulse">
              <div className="h-48 bg-white/5" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-6xl mb-4">🎮</p>
          <p className="text-gray-400 text-xl mb-2">No games here yet</p>
          <p className="text-gray-600 mb-6">Search for games and add them to your library</p>
          <Link to="/search" className="btn-primary px-8 py-3 rounded-xl">
            Search Games
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {games.map(game => (
            <div key={game.id} className="card overflow-hidden group relative">
              <Link to={`/game/${game.rawgGameId}`}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={game.gameCoverUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={game.gameTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="absolute top-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDelete(game.id)}
                  className="w-7 h-7 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500"
                >
                  ×
                </button>
                <button
                  onClick={() => setEditingGame(game)}
                  className="w-7 h-7 rounded-full bg-indigo-500/80 text-white text-xs flex items-center justify-center hover:bg-indigo-500"
                >
                  ✏️
                </button>
              </div>

              <div className="p-3">
                <p className="text-white text-sm font-semibold mb-2 line-clamp-1">{game.gameTitle}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[game.status] || ''}`}>
                    {game.status}
                  </span>
                  {game.personalRating && (
                    <span className="text-yellow-400 text-xs font-bold">⭐ {game.personalRating}/10</span>
                  )}
                </div>
                {game.hoursPlayed && (
                  <p className="text-gray-500 text-xs mt-1">⏱️ {game.hoursPlayed}h played</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LibraryPage;