export const BASE_URL = 'https://workshoperpbakend.onrender.com/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    ME: `${BASE_URL}/auth/me`,
    LOGOUT: `${BASE_URL}/auth/logout`
  },
  INVENTORY: {
    LIST: `${BASE_URL}/inventory`,
    CREATE: `${BASE_URL}/inventory`,
    UPDATE: `${BASE_URL}/inventory`,
    DELETE: (id: string) => `${BASE_URL}/inventory/${id}`
  },
  SALES: {
    LIST: `${BASE_URL}/sales`,
    STATS: `${BASE_URL}/sales/stats`
  },
  USERS: {
    LIST: `${BASE_URL}/users`,
    CREATE: `${BASE_URL}/users`,
    UPDATE: (id: string) => `${BASE_URL}/users/${id}`,
    DELETE: (id: string) => `${BASE_URL}/users/${id}`
  },
  CUSTOMER: {
    LIST: `${BASE_URL}/customers`,
    CREATE: `${BASE_URL}/customers`,
    UPDATE: (id: string) => `${BASE_URL}/customers/${id}`,
    DELETE: (id: string) => `${BASE_URL}/customers/${id}`
  },
  QUOTATION: {
    LIST: `${BASE_URL}/quotations`,
    CREATE: `${BASE_URL}/quotations`,
    UPDATE: (id: string) => `${BASE_URL}/quotations/${id}`,
    DELETE: (id: string) => `${BASE_URL}/quotations/${id}`,
    GENERATE_PDF: (id: string) => `${BASE_URL}/quotations/${id}/pdf`
  },
  PURCHASE_ORDER: {
    LIST: `${BASE_URL}/purchase-orders`,
    CREATE: `${BASE_URL}/purchase-orders`,
    UPDATE: (id: string) => `${BASE_URL}/purchase-orders/${id}`,
    DELETE: (id: string) => `${BASE_URL}/purchase-orders/${id}`
  },
  MATERIAL_INWARD: {
    LIST: `${BASE_URL}/material-inward`,
    CREATE: `${BASE_URL}/material-inward`,
    UPDATE: (id: string) => `${BASE_URL}/material-inward/${id}`,
    DELETE: (id: string) => `${BASE_URL}/material-inward/${id}`
  },
  MATERIAL_DISPATCH: {
    LIST: `${BASE_URL}/material-dispatch`,
    CREATE: `${BASE_URL}/material-dispatch`,
    UPDATE: (id: string) => `${BASE_URL}/material-dispatch/${id}`,
    DELETE: (id: string) => `${BASE_URL}/material-dispatch/${id}`
  },
  JOB_COSTING: {
    LIST: `${BASE_URL}/job-costing`,
    CREATE: `${BASE_URL}/job-costing`,
    UPDATE: (id: string) => `${BASE_URL}/job-costing/${id}`,
    DELETE: (id: string) => `${BASE_URL}/job-costing/${id}`,
    CALCULATE: `${BASE_URL}/job-costing/calculate`
  },
  INVOICE: {
    LIST: `${BASE_URL}/invoices`,
    CREATE: `${BASE_URL}/invoices`,
    UPDATE: (id: string) => `${BASE_URL}/invoices/${id}`,
    DELETE: (id: string) => `${BASE_URL}/invoices/${id}`,
    GENERATE_PDF: (id: string) => `${BASE_URL}/invoices/${id}/pdf`,
    SEND_EMAIL: (id: string) => `${BASE_URL}/invoices/${id}/send-email`
  }
};
