import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gameService from '../services/gameService';

function GameDetailPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadGame() {
      try {
        const data = await gameService.getGame(gameId);
        setGame(data);
      } catch (err) {
        setError('Game not found.');
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, [gameId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Game not found'}</p>
          <button onClick={() => navigate('/search')} className="btn-primary px-6 py-3 rounded-xl">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const platforms = game.platforms?.map(p => p.platform.name).join(', ') || 'Unknown';
  const genres = game.genres?.map(g => g.name).join(', ') || 'Unknown';
  const developers = game.developers?.map(d => d.name).join(', ') || 'Unknown';

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-96 overflow-hidden">
        {game.background_image && (
          <img
            src={game.background_image}
            alt={game.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 glass px-4 py-2 rounded-xl text-white hover:border-indigo-500/50 transition"
        >
          ← Back
        </button>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Left: Cover + Quick Info */}
          <div className="md:w-64 flex-shrink-0">
            <img
              src={game.background_image || 'https://via.placeholder.com/300x400?text=No+Image'}
              alt={game.name}
              className="w-full rounded-2xl border border-indigo-500/20 shadow-2xl mb-4"
            />

            {/* Rating */}
            <div className="card p-4 text-center mb-4">
              <p className="text-gray-400 text-xs mb-1">RAWG Rating</p>
              <p className="text-3xl font-bold text-yellow-400">⭐ {game.rating?.toFixed(1) || 'N/A'}</p>
              <p className="text-gray-500 text-xs mt-1">{game.ratings_count?.toLocaleString()} ratings</p>
            </div>

            {/* Add to Library Button */}
            <button className="btn-primary w-full py-3 rounded-xl mb-2">
              + Add to Library
            </button>
          </div>

          {/* Right: Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily: 'Orbitron' }}>
              {game.name}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {game.genres?.slice(0, 4).map(g => (
                <span key={g.id} className="glass px-3 py-1 rounded-full text-xs text-indigo-400 border border-indigo-500/30">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Released', value: game.released || 'TBA' },
                { label: 'Developer', value: developers },
                { label: 'Platforms', value: platforms },
                { label: 'Playtime', value: game.playtime ? `~${game.playtime}h` : 'N/A' },
              ].map(item => (
                <div key={item.label} className="card p-4">
                  <p className="text-gray-500 text-xs mb-1">{item.label.toUpperCase()}</p>
                  <p className="text-white text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {game.description_raw && (
              <div className="card p-6">
                <h2 className="text-white font-semibold mb-3">About</h2>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-6">
                  {game.description_raw}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetailPage;