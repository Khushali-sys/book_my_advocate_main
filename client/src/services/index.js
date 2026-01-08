import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export const advocateService = {
  search: async (filters) => {
    const response = await api.get('/advocates', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/advocates/${id}`);
    return response.data;
  },

  registerAdvocate: async (advocateData) => {
    const response = await api.post('/advocates/register', advocateData);
    return response.data;
  },

  updateProfile: async (id, data) => {
    const response = await api.put(`/advocates/${id}`, data);
    return response.data;
  }
};

export const serviceService = {
  getByAdvocate: async (advocateId) => {
    const response = await api.get(`/services/advocate/${advocateId}`);
    return response.data;
  },

  getMyServices: async () => {
    const response = await api.get('/services/my-services');
    return response.data;
  },

  create: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  update: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  }
};

export const bookingService = {
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  getAdvocateBookings: async () => {
    const response = await api.get('/bookings/advocate-bookings');
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  }
};

export const reviewService = {
  create: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getByAdvocate: async (advocateId) => {
    const response = await api.get(`/reviews/advocate/${advocateId}`);
    return response.data;
  }
};

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getAllAdvocates: async () => {
    const response = await api.get('/admin/advocates');
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get('/admin/bookings');
    return response.data;
  },

  verifyAdvocate: async (id, isVerified) => {
    const response = await api.patch(`/admin/advocates/${id}/verify`, { is_verified: isVerified });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }
};