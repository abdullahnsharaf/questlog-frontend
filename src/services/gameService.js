import api from './api';

const gameService = {
  async searchGames(query, page = 1) {
    const response = await api.get('/games/search', {
      params: { q: query, page }
    });
    return response.data;
  },

  async getGame(gameId) {
    const response = await api.get(`/games/${gameId}`);
    return response.data;
  },

  async getTrending() {
    const response = await api.get('/games/trending');
    return response.data;
  },

  async getNewReleases() {
    const response = await api.get('/games/new-releases');
    return response.data;
  }
};

export default gameService;