import React, { useState } from 'react';
import CustomerEntry from './pages/CustomerEntry';
import JobCosting from './pages/JobCosting';
import MaterialInward from './pages/MaterialInward';
import MaterialDispatch from './pages/MaterialDispatch';
import Quotation from './pages/Quotation'; // The combined Job Costing/Quotation page
import PurchaseOrder from './pages/PurchaseOrder';
import InvoiceHistory from './pages/InvoiceHistory';
import './index.css';

function App() {
  const [activeModule, setActiveModule] = useState('customer');

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Top Navbar */}
      <nav className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black tracking-widest">WORKSHOP ERP</h1>
          <div className="space-x-2">
            <button onClick={() => setActiveModule('customer')} className="nav-btn">1. Customer</button>
            <button onClick={() => setActiveModule('quotation')} className="nav-btn">2. Quotation</button>
            <button onClick={() => setActiveModule('po')} className="nav-btn">3. Purchase Order</button>
            <button onClick={() => setActiveModule('inward')} className="nav-btn">4. Material Inward</button>
            <button onClick={() => setActiveModule('dispatch')} className="nav-btn">5. Dispatch</button>
            <button onClick={() => setActiveModule('history')} className="nav-btn">History</button>
          </div>
        </div>
      </nav>

      {/* Dynamic Module Rendering */}
      <main className="container mx-auto py-10 px-4">
        {activeModule === 'customer' && <CustomerEntry />}
        {activeModule === 'quotation' && <Quotation />}
        {activeModule === 'po' && <PurchaseOrder />}
        {activeModule === 'inward' && <MaterialInward />}
        {activeModule === 'dispatch' && <MaterialDispatch />}
        {activeModule === 'history' && <InvoiceHistory />}
      </main>

      <footer className="fixed bottom-0 w-full p-2 bg-white text-center text-xs text-gray-400 border-t">
        User: Prashant Maskar | Dev Mode: React + MongoDB Atlas
      </footer>
    </div>
  );
}

export default App;