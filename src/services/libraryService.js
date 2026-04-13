import api from './api';

const libraryService = {
  async getMyLibrary() {
    const response = await api.get('/library');
    return response.data;
  },

  async getByStatus(status) {
    const response = await api.get(`/library/status/${status}`);
    return response.data;
  },

  async addGame(gameData) {
    const response = await api.post('/library', gameData);
    return response.data;
  },

  async updateGame(id, updates) {
    const response = await api.put(`/library/${id}`, updates);
    return response.data;
  },

  async deleteGame(id) {
    await api.delete(`/library/${id}`);
  }
};

export default libraryService;