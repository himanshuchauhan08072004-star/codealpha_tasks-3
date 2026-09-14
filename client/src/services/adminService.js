import api from './api';

export const fetchDashboardStats = () => api.get('/admin/dashboard').then((r) => r.data);
export const fetchUsers = () => api.get('/admin/users').then((r) => r.data);
