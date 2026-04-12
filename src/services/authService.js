import api from './api';

async function register(username, email, password) {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
}

async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

const authService = { register, login };

export default authService;