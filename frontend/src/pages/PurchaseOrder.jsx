import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PurchaseOrder = () => {
  // State for dropdowns
  const [clients, setClients] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [selectedClientId, setSelectedClientId] = useState('');
  const [formData, setFormData] = useState({
    poNumber: '',
    poDate: new Date().toISOString().split('T')[0], // Default to today
    quotationId: '',
    items: [],
    notes: ''
  });

  // 1. Fetch Clients on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/clients')
      .then(res => setClients(res.data))
      .catch(err => console.error("Error fetching clients:", err));
  }, []);

  // 2. Fetch Quotations whenever the selected Client changes
  useEffect(() => {
    if (selectedClientId) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/quotations?clientId=${selectedClientId}`)
        .then(res => {
          // Filter to ensure we only show quotes for this specific client
          const clientQuotes = res.data.filter(q => 
            q.clientId?._id === selectedClientId || q.clientId === selectedClientId
          );
          setQuotations(clientQuotes);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching quotations:", err);
          setLoading(false);
        });
    } else {
      setQuotations([]);
    }
  }, [selectedClientId]);

  // 3. Handle Quotation Selection (Auto-fill Parts)
  const handleQuoteChange = (e) => {
    const quoteId = e.target.value;
    const selectedQuote = quotations.find(q => q._id === quoteId);
    
    if (selectedQuote) {
      setFormData({
        ...formData,
        quotationId: quoteId,
        items: selectedQuote.items || [] // Link all parts from that quote
      });
    } else {
      setFormData({ ...formData, quotationId: '', items: [] });
    }
  };

  // 4. Save the Purchase Order to Database
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.poNumber || !formData.quotationId) {
      alert("Please enter PO Number and select a Quotation!");
      return;
    }

    try {
      const payload = {
        ...formData,
        clientId: selectedClientId
      };

      const response = await axios.post('http://localhost:5000/api/purchase-orders', payload);
      
      if (response.status === 201) {
        alert("✅ PO Saved Successfully! You can now proceed to Material Inward.");
        // Reset Form
        setFormData({
          poNumber: '',
          poDate: new Date().toISOString().split('T')[0],
          quotationId: '',
          items: [],
          notes: ''
        });
        setSelectedClientId('');
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("❌ Error: " + (err.response?.data?.message || "Internal Server Error"));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">
            3. Purchase Order Entry (पी.ओ. नोंदणी)
          </h2>
          <p className="text-slate-400 text-xs mt-1 uppercase">Link customer PO with approved Quotations</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Client Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Select Customer</label>
              <select 
                className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all bg-slate-50 font-bold"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                required
              >
                <option value="">-- Choose Client --</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            {/* Quotation Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Link Quotation</label>
              <select 
                className={`w-full border-2 p-3 rounded-xl outline-none transition-all font-bold ${!selectedClientId ? 'bg-gray-100' : 'bg-indigo-50 border-indigo-100 focus:border-indigo-500'}`}
                value={formData.quotationId}
                onChange={handleQuoteChange}
                disabled={!selectedClientId}
                required
              >
                <option value="">{loading ? "Loading..." : "-- Select Quotation --"}</option>
                {quotations.map(q => (
                  <option key={q._id} value={q._id}>{q.quoteNo} ({q.items?.length} Items)</option>
                ))}
              </select>
            </div>

            {/* PO Details */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Customer PO Number</label>
              <input 
                type="text" 
                className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none"
                placeholder="e.g. PO/ABC/2026/001"
                value={formData.poNumber}
                onChange={e => setFormData({...formData, poNumber: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">PO Date</label>
              <input 
                type="date" 
                className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none"
                value={formData.poDate}
                onChange={e => setFormData({...formData, poDate: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Parts Table */}
          <div className="mb-8">
            <h3 className="text-sm font-black text-slate-800 mb-4 border-l-4 border-indigo-600 pl-3">
              PARTS & RATES (FROM QUOTATION)
            </h3>
            <div className="overflow-hidden border border-slate-100 rounded-xl shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="text-xs font-black text-slate-500 uppercase tracking-tighter">
                    <th className="p-4">Sr.</th>
                    <th className="p-4">Part No / Drawing</th>
                    <th className="p-4">Part Description</th>
                    <th className="p-4 text-right">Quoted Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {formData.items.length > 0 ? (
                    formData.items.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition">
                        <td className="p-4 text-sm text-slate-400 font-bold">{index + 1}</td>
                        <td className="p-4 text-sm font-black text-slate-700 uppercase">{item.partNo}</td>
                        <td className="p-4 text-sm text-slate-500">{item.partName}</td>
                        <td className="p-4 text-right font-black text-indigo-600">₹{parseFloat(item.unitRate).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-slate-400 italic text-sm">
                        No items found. Please select an approved quotation above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 italic max-w-sm">
              * By saving this PO, you are authorizing the system to accept material inwards for the above listed parts.
            </p>
            <button 
              type="submit" 
              className="bg-green-600 text-white px-12 py-4 rounded-xl font-black shadow-lg hover:bg-green-700 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest"
            >
              Finalize & Save Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseOrder;