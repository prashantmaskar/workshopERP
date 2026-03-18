import React, { useState } from 'react';
import { clientService } from '../services/api';

const CustomerEntry = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    gstNo: '',
    state: 'Maharashtra', // Default to your local state
    email: '',
    contactNo: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving...');
    try {
      await clientService.createClient(formData);
      setStatus('✅ Success! Customer saved to MongoDB Atlas.');
      // Clear form after success
      setFormData({ name: '', address: '', gstNo: '', state: 'Maharashtra', email: '', contactNo: '' });
    } catch (err) {
      setStatus('❌ Error: Could not save customer. Check your backend/Atlas.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-2xl font-black text-slate-800 mb-6 border-b pb-4">1. Customer Entry</h2>
      
      {status && <div className={`mb-4 p-3 rounded ${status.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{status}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700">Customer Name (कस्टमर नाव)</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">GST No.</label>
            <input type="text" name="gstNo" value={formData.gstNo} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="27XXXXX..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">State</label>
            <select name="state" value={formData.state} onChange={handleChange} className="w-full border p-3 rounded-lg bg-white">
              <option value="Maharashtra">Maharashtra</option>
              <option value="Outside Maharashtra">Outside Maharashtra (IGST)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Address (पता)</label>
          <textarea name="address" value={formData.address} onChange={handleChange} className="w-full border p-3 rounded-lg" rows="2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">Contact No.</label>
            <input type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} className="w-full border p-3 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Email (ई-मेल)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-3 rounded-lg" />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
          Save Customer & Initialize Database
        </button>
      </form>
    </div>
  );
};

export default CustomerEntry;