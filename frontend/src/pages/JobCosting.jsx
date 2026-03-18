import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobCosting = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [operations, setOperations] = useState([{ name: '', ratePerHour: 0, timeInSec: 0 }]);
  const [material, setMaterial] = useState({ inputWeight: 0, finishWeight: 0, scrapRate: 0 });
  const [profitPercent, setProfitPercent] = useState(10);
  const [calculation, setCalculation] = useState(null);

  // 1. Fetch customers you saved in the first module
  useEffect(() => {
    axios.get('http://localhost:5000/api/clients')
      .then(res => setClients(res.data))
      .catch(err => console.error("Error fetching clients", err));
  }, []);

  const handleOpChange = (index, e) => {
    const newOps = [...operations];
    newOps[index][e.target.name] = e.target.value;
    setOperations(newOps);
  };

  const addRow = () => setOperations([...operations, { name: '', ratePerHour: 0, timeInSec: 0 }]);

  // 2. Calculate using the backend logic
  const handleCalculate = async () => {
    const client = clients.find(c => c._id === selectedClient);
    const isInterState = client?.state !== 'Maharashtra';

    try {
      const res = await axios.post('http://localhost:5000/api/calculate-quotation', {
        operations,
        material,
        profitPercent,
        isInterState
      });
      setCalculation(res.data);
    } catch (err) {
      alert("Calculation failed. Check backend connection.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-black text-slate-800 mb-6 border-b pb-4">2. Job Costing & Quotation</h2>

      {/* Client Selection */}
      <div className="mb-6">
        <label className="block text-sm font-bold mb-2">Select Customer</label>
        <select 
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <option value="">-- Choose Customer --</option>
          {clients.map(c => <option key={c._id} value={c._id}>{c.name} ({c.gstNo})</option>)}
        </select>
      </div>

      {/* Operations Table */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="border p-3 text-left">Operation Name</th>
              <th className="border p-3 text-left">Rate / Hr (₹)</th>
              <th className="border p-3 text-left">Time (Sec)</th>
              <th className="border p-3 text-left">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {operations.map((op, i) => (
              <tr key={i}>
                <td className="border p-2"><input name="name" onChange={(e) => handleOpChange(i, e)} className="w-full p-1" placeholder="e.g. CNC Turning" /></td>
                <td className="border p-2"><input name="ratePerHour" type="number" onChange={(e) => handleOpChange(i, e)} className="w-full p-1" /></td>
                <td className="border p-2"><input name="timeInSec" type="number" onChange={(e) => handleOpChange(i, e)} className="w-full p-1" /></td>
                <td className="border p-2 font-mono">₹{((op.ratePerHour / 3600) * op.timeInSec).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addRow} className="mt-2 text-blue-600 font-bold hover:underline">+ Add Operation</button>
      </div>

      {/* Action Button */}
      <button 
        onClick={handleCalculate}
        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition"
      >
        Calculate Final Job Rate with GST
      </button>

      {/* Result Summary */}
      {calculation && (
        <div className="mt-8 p-6 bg-slate-50 rounded-xl border-2 border-indigo-100 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Taxable Value:</p>
            <p className="text-xl font-bold">₹{calculation.taxableValue}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">GST Breakdown:</p>
            {calculation.igst > 0 ? (
              <p className="font-bold">IGST (18%): ₹{calculation.igst}</p>
            ) : (
              <p className="font-bold">CGST (9%): ₹{calculation.cgst} | SGST (9%): ₹{calculation.sgst}</p>
            )}
          </div>
          <div className="col-span-2 border-t pt-4 flex justify-between items-center">
            <span className="text-2xl font-black text-indigo-900">GRAND TOTAL:</span>
            <span className="text-3xl font-black text-indigo-900">₹{calculation.grandTotal}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCosting;