import api from './api';

const activityService = {
  async getFeed() {
    const response = await api.get('/activity/feed');
    return response.data;
  },

  async getUserActivity(username) {
    const response = await api.get(`/activity/${username}`);
    return response.data;
  }
};

export default activityService;