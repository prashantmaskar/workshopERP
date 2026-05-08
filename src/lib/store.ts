import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import inventoryReducer from './slices/inventorySlice';
import salesReducer from './slices/salesSlice';
import usersReducer from './slices/usersSlice';
import uiReducer from './slices/uiSlice';
import customerReducer from './slices/customerSlice';
import quotationReducer from './slices/quotationSlice';
import purchaseOrderReducer from './slices/purchaseOrderSlice';
import materialInwardReducer from './slices/materialInwardSlice';
import materialDispatchReducer from './slices/materialDispatchSlice';
import jobCostingReducer from './slices/jobCostingSlice';
import invoiceReducer from './slices/invoiceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    sales: salesReducer,
    users: usersReducer,
    ui: uiReducer,
    customer: customerReducer,
    quotation: quotationReducer,
    purchaseOrder: purchaseOrderReducer,
    materialInward: materialInwardReducer,
    materialDispatch: materialDispatchReducer,
    jobCosting: jobCostingReducer,
    invoice: invoiceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
