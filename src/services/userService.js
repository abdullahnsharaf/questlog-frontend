import api from './api';

const userService = {
  async getMyProfile() {
    const response = await api.get('/users/me');
    return response.data;
  },

  async getPublicProfile(username) {
    const response = await api.get(`/users/${username}`);
    return response.data;
  }
};

export default userService;