import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios para cada entidad
export const authService = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (email: string, password: string, role: string) => 
    api.post('/auth/register', { email, password, role }),
    
  getCurrentUser: () => 
    api.get('/auth/me'),
};

export const weeksService = {
  getAll: () => 
    api.get('/weeks'),
  
  getById: (id: string) => 
    api.get(`/weeks/${id}`),
};

export const lessonsService = {
  getByWeekId: (weekId: string) => 
    api.get(`/weeks/${weekId}/lessons`),
  
  getById: (id: string) => 
    api.get(`/lessons/${id}`),
};

export const problemsService = {
  getByLessonId: (lessonId: string) => 
    api.get(`/lessons/${lessonId}/problems`),
  
  getById: (id: string) => 
    api.get(`/problems/${id}`),
    
  submitAnalyticalSolution: (id: string, solution: string) => 
    api.post(`/problems/${id}/analytical`, { solution }),
    
  submitCodeSolution: (id: string, code: string) => 
    api.post(`/problems/${id}/code`, { code }),
};

export const progressService = {
  getUserProgress: () => 
    api.get('/user/progress'),
  
  getLeaderboard: () => 
    api.get('/leaderboard'),
}; 