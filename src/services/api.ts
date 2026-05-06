import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const purchaseOrderService = {
  getAll: () => api.get('/purchase-orders'),
  getById: (id: string) => api.get(`/purchase-orders/${id}`),
  create: (data: any) => api.post('/purchase-orders', data),
};

export const financeService = {
  getInvoices: () => api.get('/finance/invoices'),
  createInvoice: (data: any) => api.post('/finance/invoices', data),
  getJobCostings: () => api.get('/finance/job-costing'),
  createJobCosting: (data: any) => api.post('/finance/job-costing', data),
};

export const logisticsService = {
  getInward: () => api.get('/logistics/inward'),
  createInward: (data: any) => api.post('/logistics/inward', data),
  getDispatch: () => api.get('/logistics/dispatch'),
  createDispatch: (data: any) => api.post('/logistics/dispatch', data),
};

export default api;
