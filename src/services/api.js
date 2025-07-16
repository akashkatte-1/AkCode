import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Problems API
export const problemsAPI = {
  getAll: (params) => api.get('/problems', { params }),
  getBySlug: (slug) => api.get(`/problems/${slug}`),
  create: (problemData) => api.post('/problems', problemData),
  update: (id, problemData) => api.put(`/problems/${id}`, problemData),
  delete: (id) => api.delete(`/problems/${id}`),
  getTags: () => api.get('/problems/tags'),
};

// Submissions API
export const submissionsAPI = {
  submit: (submissionData) => api.post('/submissions/submit', submissionData),
  run: (codeData) => api.post('/submissions/run', codeData),
  getUserSubmissions: (params) => api.get('/submissions/user', { params }),
  getById: (id) => api.get(`/submissions/${id}`),
};

// Leaderboard API
export const leaderboardAPI = {
  get: (params) => api.get('/leaderboard', { params }),
  getUserRank: () => api.get('/leaderboard/rank'),
  getTopPerformers: (params) => api.get('/leaderboard/top', { params }),
};

export default api;