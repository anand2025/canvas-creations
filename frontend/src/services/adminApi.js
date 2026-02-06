import { apiRequest } from './api';

export const adminApi = {
  // Products (Paintings)
  getPaintings: () => apiRequest('/admin/paintings'),
  createPainting: (data) => apiRequest('/admin/paintings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updatePainting: (id, data) => apiRequest(`/admin/paintings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deletePainting: (id) => apiRequest(`/admin/paintings/${id}`, {
    method: 'DELETE',
  }),
  toggleBestseller: (id, isBestseller) => apiRequest(`/admin/paintings/${id}/bestseller?is_bestseller=${isBestseller}`, {
      method: 'PUT'
  }),

  // Orders
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/orders?${query}`);
  },
  updateOrderStatus: (id, status) => apiRequest(`/admin/orders/${id}/status?status=${status}`, {
    method: 'PUT',
  }),

  // Users
  getUsers: () => apiRequest('/admin/users'),

  // Inventory
  getInventory: () => apiRequest('/admin/paintings'), // Reusing getPaintings for now as it returns stock
  updateInventory: (id, stock) => apiRequest(`/admin/inventory/${id}?stock=${stock}`, {
    method: 'POST',
  }),

  // Dashboard Stats
  getDashboardStats: () => apiRequest('/admin/stats'),

  // Reviews
  getReviews: () => apiRequest('/admin/reviews'),
  getReviewsSummary: () => apiRequest('/admin/reviews/summary'),
};
