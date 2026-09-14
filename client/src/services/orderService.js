import api from './api';

export const createOrder = (payload) => api.post('/orders', payload).then((r) => r.data);
export const fetchMyOrders = () => api.get('/orders/my-orders').then((r) => r.data);
export const fetchOrderById = (id) => api.get(`/orders/${id}`).then((r) => r.data);
export const fetchAllOrders = () => api.get('/orders').then((r) => r.data);
export const updateOrderStatusApi = (id, orderStatus) =>
  api.put(`/orders/${id}/status`, { orderStatus }).then((r) => r.data);
