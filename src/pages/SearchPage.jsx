import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GameCard from '../components/game/GameCard';
import gameService from '../services/gameService';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [input, setInput] = useState(searchParams.get('q') || '');
  const [games, setGames] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Load trending on first visit
  useEffect(() => {
    async function loadTrending() {
      try {
        const data = await gameService.getTrending();
        setTrending(data.results || []);
      } catch (err) {
        console.error('Failed to load trending:', err);
      }
    }
    loadTrending();
  }, []);

  // Search when query changes
  useEffect(() => {
    if (!query) return;
    async function doSearch() {
      setLoading(true);
      setError('');
      try {
        const data = await gameService.searchGames(query, 1);
        setGames(data.results || []);
        setHasMore(!!data.next);
        setPage(1);
      } catch (err) {
        setError('Search failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    doSearch();
  }, [query]);

  function handleSearch(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setQuery(input.trim());
    setSearchParams({ q: input.trim() });
  }

  async function loadMore() {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const data = await gameService.searchGames(query, nextPage);
      setGames(prev => [...prev, ...(data.results || [])]);
      setHasMore(!!data.next);
      setPage(nextPage);
    } catch (err) {
      setError('Failed to load more games.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">

      {/* Search Bar */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron' }}>
          🔍 Search Games
        </h1>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search 500,000+ games..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors text-lg"
          />
          <button
            type="submit"
            className="btn-primary px-8 py-4 rounded-xl text-lg"
          >
            Search
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* Search Results */}
      {query && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            {loading && games.length === 0
              ? 'Searching...'
              : `Results for "${query}" (${games.length} games)`}
          </h2>

          {loading && games.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="card overflow-hidden h-64 animate-pulse">
                  <div className="h-48 bg-white/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {games.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="btn-outline px-10 py-3 rounded-xl disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Trending (shown when no search) */}
      {!query && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">
            🔥 Trending Games
          </h2>
          {trending.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="card overflow-hidden h-64 animate-pulse">
                  <div className="h-48 bg-white/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {trending.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;