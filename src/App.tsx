import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './lib/store';

// Pages - placeholder imports for now, I will create files next
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import InventoryPage from './pages/dashboard/InventoryPage';
import SalesPage from './pages/dashboard/SalesPage';
import UsersPage from './pages/dashboard/UsersPage';
import CustomerListPage from './pages/dashboard/modules/customer/CustomerListPage';
import CustomerFormPage from './pages/dashboard/modules/customer/CustomerFormPage';
import QuotationListPage from './pages/dashboard/modules/quotation/QuotationListPage';
import QuotationFormPage from './pages/dashboard/modules/quotation/QuotationFormPage';
import QuotationViewPage from './pages/dashboard/modules/quotation/QuotationViewPage';
import PurchaseOrderListPage from './pages/dashboard/modules/purchase-order/PurchaseOrderListPage';
import PurchaseOrderFormPage from './pages/dashboard/modules/purchase-order/PurchaseOrderFormPage';
import MaterialInwardListPage from './pages/dashboard/modules/material-inward/MaterialInwardListPage';
import MaterialInwardFormPage from './pages/dashboard/modules/material-inward/MaterialInwardFormPage';
import MaterialDispatchListPage from './pages/dashboard/modules/material-dispatch/MaterialDispatchListPage';
import MaterialDispatchFormPage from './pages/dashboard/modules/material-dispatch/MaterialDispatchFormPage';
import JobCostingListPage from './pages/dashboard/modules/job-costing/JobCostingListPage';
import JobCostingFormPage from './pages/dashboard/modules/job-costing/JobCostingFormPage';
import InvoiceListPage from './pages/dashboard/modules/invoice/InvoiceListPage';
import InvoiceFormPage from './pages/dashboard/modules/invoice/InvoiceFormPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardHome />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="users" element={<UsersPage />} />
        
        {/* Customer Module */}
        <Route path="modules/customer" element={<CustomerListPage />} />
        <Route path="modules/customer/new" element={<CustomerFormPage />} />
        <Route path="modules/customer/:id/edit" element={<CustomerFormPage />} />

        {/* Quotation Module */}
        <Route path="modules/quotation" element={<QuotationListPage />} />
        <Route path="modules/quotation/new" element={<QuotationFormPage />} />
        <Route path="modules/quotation/:id/view" element={<QuotationViewPage />} />
        
        {/* Purchase Order Module */}
        <Route path="modules/purchase-order" element={<PurchaseOrderListPage />} />
        <Route path="modules/purchase-order/new" element={<PurchaseOrderFormPage />} />

        {/* Material Modules */}
        <Route path="modules/material-inward" element={<MaterialInwardListPage />} />
        <Route path="modules/material-inward/new" element={<MaterialInwardFormPage />} />
        <Route path="modules/material-dispatch" element={<MaterialDispatchListPage />} />
        <Route path="modules/material-dispatch/new" element={<MaterialDispatchFormPage />} />

        {/* Job Costing Module */}
        <Route path="modules/job-costing" element={<JobCostingListPage />} />
        <Route path="modules/job-costing/new" element={<JobCostingFormPage />} />

        {/* Invoice Module */}
        <Route path="modules/invoice" element={<InvoiceListPage />} />
        <Route path="modules/invoice/new" element={<InvoiceFormPage />} />
        
        {/* Other dashboard routes will be added here */}
      </Route>
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
