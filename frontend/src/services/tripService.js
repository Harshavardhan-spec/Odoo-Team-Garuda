import api from './api';

export const tripService = {
  getAll: async () => {
    const res = await api.get('/trips/');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/trips/${id}/`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/trips/create/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/trips/update/${id}/`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/trips/delete/${id}/`);
    return res.data;
  },
  complete: async (id, actualDistance, fuelConsumed) => {
    const res = await api.put(`/trips/complete/${id}/`, {
      actual_distance: actualDistance,
      fuel_consumed: fuelConsumed
    });
    return res.data;
  },
  cancel: async (id) => {
    const res = await api.put(`/trips/cancel/${id}/`);
    return res.data;
  },
  getActive: async () => {
    const res = await api.get('/trips/active/');
    return res.data;
  },
  getCompleted: async () => {
    const res = await api.get('/trips/completed/');
    return res.data;
  },
  getCancelled: async () => {
    const res = await api.get('/trips/cancelled/');
    return res.data;
  },
};

