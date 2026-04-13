import api from './api';

const friendService = {
  async getMyFriends() {
    const response = await api.get('/friends');
    return response.data;
  },

  async getPending() {
    const response = await api.get('/friends/pending');
    return response.data;
  },

  async sendRequest(username) {
    const response = await api.post(`/friends/request/${username}`);
    return response.data;
  },

  async acceptRequest(id) {
    const response = await api.put(`/friends/accept/${id}`);
    return response.data;
  },

  async deleteRequest(id) {
    await api.delete(`/friends/reject/${id}`);
  },

  async searchUsers(query) {
    const response = await api.get('/friends/search', { params: { q: query } });
    return response.data;
  }
};

export default friendService;