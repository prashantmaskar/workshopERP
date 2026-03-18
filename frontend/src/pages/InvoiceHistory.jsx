import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/invoices')
      .then(res => setInvoices(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.clientId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-xl border">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-800 uppercase italic">Invoice History (विक्री इतिहास)</h2>
        <input 
          type="text" 
          placeholder="Search Customer or Inv No..." 
          className="border p-2 rounded-lg w-64 shadow-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-900 text-white text-sm">
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Inv No.</th>
            <th className="p-3 border">Customer</th>
            <th className="p-3 border">Amount</th>
            <th className="p-3 border text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((inv) => (
            <tr key={inv._id} className="hover:bg-slate-50 border-b">
              <td className="p-3">{new Date(inv.date).toLocaleDateString()}</td>
              <td className="p-3 font-bold">{inv.invoiceNo}</td>
              <td className="p-3">{inv.clientId?.name}</td>
              <td className="p-3 font-mono font-bold text-green-700">₹{inv.total.toLocaleString()}</td>
              <td className="p-3 text-center">
                <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs font-bold hover:bg-blue-200">
                  View & Re-Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredInvoices.length === 0 && (
        <p className="text-center p-10 text-slate-400">No invoices found. Generate your first dispatch to see records here!</p>
      )}
    </div>
  );
};

export default InvoiceHistory;