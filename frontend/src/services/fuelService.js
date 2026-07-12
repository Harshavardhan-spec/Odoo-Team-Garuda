import api from './api';

export const fuelService = {
  getAll: async () => {
    const res = await api.get('/fuel/');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/fuel/${id}/`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/fuel/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/fuel/${id}/`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/fuel/${id}/`);
    return res.data;
  },
};
