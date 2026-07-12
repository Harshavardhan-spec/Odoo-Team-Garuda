import api from './api';

export const dashboardService = {
  getOverview: async () => {
    const res = await api.get('/dashboard/');
    // Extract data from standard backend envelope if it exists
    if (res.data && res.data.data) {
      return res.data.data;
    }
    return res.data;
  },
  
  getFleetReport: async (params = {}) => {
    const res = await api.get('/reports/fleet/', { params });
    if (res.data && res.data.data) {
      return res.data.data;
    }
    return res.data;
  },
  
  getExpenseReport: async (params = {}) => {
    const res = await api.get('/reports/expenses/', { params });
    if (res.data && res.data.data) {
      return res.data.data;
    }
    return res.data;
  },
  
  getFuelReport: async (params = {}) => {
    const res = await api.get('/reports/fuel/', { params });
    if (res.data && res.data.data) {
      return res.data.data;
    }
    return res.data;
  }
};
