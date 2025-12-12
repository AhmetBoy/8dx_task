import axios from 'axios';

const API_BASE_URL = 'http://localhost/8dx/backend/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Problems API
export const problemsAPI = {
  getAll: () => api.get('/problems'),

  getById: (id) => api.get(`/problems/${id}`),

  create: (data) => api.post('/problems', data),

  update: (id, data) => api.put(`/problems/${id}`, data),

  delete: (id) => api.delete(`/problems/${id}`),
};

// Root Causes API
export const rootCausesAPI = {
  getByProblemId: (problemId) => api.get(`/problems/${problemId}/causes`),

  create: (data) => api.post('/causes', data),

  update: (id, data) => api.put(`/causes/${id}`, data),

  delete: (id) => api.delete(`/causes/${id}`),
};

export default api;
