import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  fetchUsers() {
    return apiClient.post('/users/fetch');
  },

  getUsers() {
    return apiClient.get('/users');
  },

  updateUser(uuid, userData) {
    return apiClient.put(`/users/${uuid}`, userData);
  }
};