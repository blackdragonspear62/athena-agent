import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('athena_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('athena_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const skillsApi = {
  list: (params?: { query?: string; category?: string; limit?: number; offset?: number }) =>
    api.get('/skills', { params }),
  get: (id: string) => api.get(`/skills/${id}`),
  install: (skillId: string) => api.post('/skills/install', { skill_id: skillId }),
  getCategories: () => api.get('/skills/categories'),
};

export const agentsApi = {
  list: () => api.get('/agents'),
  get: (id: string) => api.get(`/agents/${id}`),
  getStats: () => api.get('/agents/stats'),
  createTask: (agentId: string, input: string) =>
    api.post('/agents/task', { agent_id: agentId, input }),
  executeTask: (taskId: string) => api.post(`/agents/task/${taskId}/execute`),
};

export const commandsApi = {
  list: () => api.get('/commands'),
  execute: (command: string, args?: string[]) =>
    api.post('/commands/execute', { command, args }),
};

export const healthApi = {
  check: () => api.get('/health'),
  ready: () => api.get('/health/ready'),
  info: () => api.get('/health/info'),
};
