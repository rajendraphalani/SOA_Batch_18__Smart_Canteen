import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('canteen_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  topUpWallet: (amount) => api.post('/auth/wallet/topup', { amount }),
};

export const menuApi = {
  getCategories: () => api.get('/menu/categories'),
  getAvailableItems: () => api.get('/menu/items'),
  getAllItems: () => api.get('/menu/all'),
  createItem: (item) => api.post('/menu/items', item),
  updateItem: (id, item) => api.put(`/menu/items/${id}`, item),
  toggleItemStock: (id) => api.patch(`/menu/items/${id}/toggle`),
  deleteItem: (id) => api.delete(`/menu/items/${id}`),
};

export const orderApi = {
  placeOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
};

export const kitchenApi = {
  getActiveOrders: () => api.get('/kitchen/orders'),
  updateStatus: (id, status) => api.patch(`/kitchen/orders/${id}/status`, { status }),
  verifyToken: (tokenNumber) => api.post('/kitchen/orders/verify', { tokenNumber }),
};

export const adminApi = {
  getAnalytics: () => api.get('/admin/analytics'),
  getAllOrders: () => api.get('/admin/orders'),
};

export default api;
