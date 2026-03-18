import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MaterialInward = () => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    clientId: '',
    partNo: '',
    challanNo: '',
    challanQty: 0,
    receivedQty: 0,
    vehicleNo: '',
    driverName: ''
  });
  const [status, setStatus] = useState('');

  // 1. Fetch saved clients for the dropdown
  useEffect(() => {
    axios.get('http://localhost:5000/api/clients')
      .then(res => setClients(res.data))
      .catch(err => console.error("Error fetching clients", err));
  }, []);

  // 2. Automated calculation for Shortage
  const shortQty = formData.challanQty - formData.receivedQty;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving...');
    try {
      // Post the data including the calculated shortage
      await axios.post('http://localhost:5000/api/inward-entry', { ...formData, shortQty });
      setStatus('✅ Inward Material logged successfully!');
      setFormData({ clientId: '', partNo: '', challanNo: '', challanQty: 0, receivedQty: 0, vehicleNo: '', driverName: '' });
    } catch (err) {
      setStatus('❌ Error: Could not log inward entry.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-black text-slate-800 mb-6 border-b pb-4 uppercase tracking-tighter">
        3. Material Inward (Raw Material Receipt)
      </h2>

      {status && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg font-bold">{status}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Selection */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">Select Customer</label>
          <select 
            name="clientId" 
            value={formData.clientId} 
            onChange={handleChange} 
            className="w-full border p-3 rounded-lg bg-gray-50" 
            required
          >
            <option value="">-- Choose Customer --</option>
            {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        {/* Part & Challan Details */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Part Number (पार्ट नं.)</label>
          <input type="text" name="partNo" value={formData.partNo} onChange={handleChange} className="w-full border p-3 rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Challan No. (चलान नं.)</label>
          <input type="text" name="challanNo" value={formData.challanNo} onChange={handleChange} className="w-full border p-3 rounded-lg" required />
        </div>

        {/* Quantities & Automated Shortage */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Challan Qty</label>
          <input type="number" name="challanQty" value={formData.challanQty} onChange={handleChange} className="w-full border p-3 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Received Qty</label>
          <input type="number" name="receivedQty" value={formData.receivedQty} onChange={handleChange} className="w-full border p-3 rounded-lg" />
        </div>

        <div className="md:col-span-2 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700 font-black flex justify-between">
            <span>SHORTAGE QUANTITY (शॉर्टेज):</span>
            <span className="text-xl">{shortQty}</span>
          </p>
        </div>

        {/* Logistics */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Vehicle No. (गाडी नं.)</label>
          <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="MH-12-..." />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Driver Name (ड्रायव्हर नाव)</label>
          <input type="text" name="driverName" value={formData.driverName} onChange={handleChange} className="w-full border p-3 rounded-lg" />
        </div>

        <button type="submit" className="md:col-span-2 bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg hover:bg-black transition uppercase">
          Save Inward Record to Atlas
        </button>
      </form>
    </div>
  );
};

export default MaterialInward;