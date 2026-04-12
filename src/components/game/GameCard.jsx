import { Link } from 'react-router-dom';

function GameCard({ game }) {
  const rating = game.rating ? game.rating.toFixed(1) : 'N/A';
  const cover = game.background_image || '/placeholder-game.jpg';
  const platforms = game.platforms
    ? game.platforms.slice(0, 3).map(p => p.platform.name).join(', ')
    : 'Unknown';

  function getRatingColor(rating) {
    if (rating >= 4) return 'text-green-400';
    if (rating >= 3) return 'text-yellow-400';
    return 'text-red-400';
  }

  return (
    <Link to={`/game/${game.id}`} className="block group">
      <div className="card overflow-hidden h-full">
        {/* Cover Image */}
        <div className="relative overflow-hidden h-48">
          <img
            src={cover}
            alt={game.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
            }}
          />
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 glass px-2 py-1 rounded-lg">
            <span className={`text-sm font-bold ${getRatingColor(game.rating)}`}>
              ⭐ {rating}
            </span>
          </div>
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <span className="text-white text-xs font-medium">View Details →</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-indigo-400 transition-colors">
            {game.name}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-1">{platforms}</p>
          {game.released && (
            <p className="text-gray-600 text-xs mt-1">
              {new Date(game.released).getFullYear()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default GameCard;