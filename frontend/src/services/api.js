import axios from 'axios';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running. Please start the backend service.');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const pharmacyAPI = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Billing endpoints
  billing: {
    create: (billData) => api.post('/api/billing', billData),
    getAll: () => api.get('/api/billing'),
    getById: (id) => api.get(`/api/billing/${id}`),
    delete: (id) => api.delete(`/api/billing/${id}`)
  },
  
  // Inventory endpoints
  inventory: {
    getAll: () => api.get('/api/inventory'),
    getById: (id) => api.get(`/api/inventory/${id}`),
    create: (item) => api.post('/api/inventory', item),
    update: (id, item) => api.put(`/api/inventory/${id}`, item),
    delete: (id) => api.delete(`/api/inventory/${id}`),
    lowStock: () => api.get('/api/inventory/low-stock')
  },
  
  // Purchase endpoints
  purchase: {
    getAll: () => api.get('/api/purchase'),
    getById: (id) => api.get(`/api/purchase/${id}`),
    create: (order) => api.post('/api/purchase', order),
    update: (id, order) => api.put(`/api/purchase/${id}`, order),
    delete: (id) => api.delete(`/api/purchase/${id}`),
    pending: () => api.get('/api/purchase/pending')
  }
};

export default api;