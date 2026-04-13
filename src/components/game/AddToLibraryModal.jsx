import { useState } from 'react';
import libraryService from '../../services/libraryService';

const STATUS_OPTIONS = [
  { value: 'PLAYING', label: '🎮 Playing', color: 'text-green-400' },
  { value: 'COMPLETED', label: '✅ Completed', color: 'text-blue-400' },
  { value: 'WISHLIST', label: '⭐ Wishlist', color: 'text-yellow-400' },
  { value: 'ON_HOLD', label: '⏸️ On Hold', color: 'text-orange-400' },
  { value: 'DROPPED', label: '❌ Dropped', color: 'text-red-400' },
];

function AddToLibraryModal({ game, onClose, onSuccess }) {
  const [status, setStatus] = useState('WISHLIST');
  const [rating, setRating] = useState(0);
  const [hours, setHours] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await libraryService.addGame({
        rawgGameId: game.id,
        gameTitle: game.name,
        gameCoverUrl: game.background_image,
        status,
        personalRating: rating > 0 ? rating : null,
        hoursPlayed: hours ? parseFloat(hours) : null,
        reviewText: review || null,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add game.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass rounded-2xl p-6 w-full max-w-md border border-indigo-500/30 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add to Library</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        {/* Game Info */}
        <div className="flex gap-3 mb-6 p-3 bg-white/5 rounded-xl">
          {game.background_image && (
            <img src={game.background_image} alt={game.name}
              className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
          )}
          <div>
            <p className="text-white font-semibold text-sm">{game.name}</p>
            <p className="text-gray-400 text-xs mt-1">⭐ {game.rating?.toFixed(1) || 'N/A'} RAWG rating</p>
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
            <label className="block text-sm text-gray-300 mb-2">Quick Review (optional)</label>
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
            {loading ? 'Adding...' : '+ Add to Library'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddToLibraryModal;