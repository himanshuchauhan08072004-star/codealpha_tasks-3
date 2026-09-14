import api from './api';

export const fetchCart = () => api.get('/cart').then((r) => r.data);
export const addCartItem = (productId, quantity = 1) =>
  api.post('/cart', { productId, quantity }).then((r) => r.data);
export const updateCartItemQty = (productId, quantity) =>
  api.put(`/cart/${productId}`, { quantity }).then((r) => r.data);
export const removeCartItemApi = (productId) => api.delete(`/cart/${productId}`).then((r) => r.data);
export const clearCartApi = () => api.delete('/cart').then((r) => r.data);
