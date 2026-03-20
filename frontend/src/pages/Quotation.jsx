import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quotation = () => {
    const [clients, setClients] = useState([]);
    const [items, setItems] = useState([{ partNo: '', partName: '', hsnCode: '8708', unitRate: 0 }]);
    const [formData, setFormData] = useState({
        quoteNo: `PI/QTN/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
        clientId: '',
        clientName: ''
    });
    // FETCH CLIENTS ON COMPONENT LOAD
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('https://workshoperpbakend.onrender.com/api/clients');
                setClients(response.data);
            } catch (err) {
                console.error("Error fetching clients:", err);
            }
        };
        fetchClients();
    }, []);

    const handleClientChange = (e) => {
        const selectedId = e.target.value;
        const selectedClient = clients.find(c => c._id === selectedId);

        setFormData({
            ...formData,
            clientId: selectedId,
            clientName: selectedClient ? selectedClient.name : ''
        });
    };
    // Add a new blank row
    const addRow = () => {
        setItems([...items, { partNo: '', partName: '', hsnCode: '8708', unitRate: 0 }]);
    };

    // Remove a specific row
    const removeRow = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    // Handle changes for a specific row
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const saveQuotation = async () => {
        try {
            await axios.post('http://localhost:5000/api/quotations', { ...formData, items });
            alert("Quotation with multiple parts saved!");
        } catch (err) { alert("Error saving quotation"); }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 bg-slate-100">

            {/* FORM SECTION */}
            <div className="lg:w-2/5 bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-600">
                <h2 className="text-xl font-black mb-4">ITEM DETAILS</h2>

                <div className="mb-4">
                    <label className="text-xs font-bold text-gray-400">SELECT CUSTOMER</label>
                    <select
                        className="w-full border-b-2 p-2 outline-none mb-6"
                        value={formData.clientId}
                        onChange={handleClientChange}
                    >
                        <option value="">Choose Client</option>
                        {clients.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {items.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg mb-4 bg-slate-50 relative">
                        <button onClick={() => removeRow(index)} className="absolute top-2 right-2 text-red-500 font-bold">✕</button>
                        <div className="grid grid-cols-2 gap-2">
                            <input placeholder="Part No" className="p-2 border rounded" value={item.partNo} onChange={e => handleItemChange(index, 'partNo', e.target.value)} />
                            <input placeholder="HSN" className="p-2 border rounded" value={item.hsnCode} onChange={e => handleItemChange(index, 'hsnCode', e.target.value)} />
                            <input placeholder="Description" className="col-span-2 p-2 border rounded" value={item.partName} onChange={e => handleItemChange(index, 'partName', e.target.value)} />
                            <input type="number" placeholder="Unit Rate ₹" className="col-span-2 p-2 border rounded font-bold text-blue-700" value={item.unitRate} onChange={e => handleItemChange(index, 'unitRate', e.target.value)} />
                        </div>
                    </div>
                ))}

                <button onClick={addRow} className="w-full border-2 border-dashed border-blue-300 text-blue-600 py-2 rounded-lg font-bold mb-4 hover:bg-blue-50">
                    + Add Another Part
                </button>

                <button onClick={saveQuotation} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg">
                    Save All Items
                </button>
            </div>

            {/* DOCUMENT PREVIEW */}
            <div className="lg:w-3/5 bg-white p-10 shadow-2xl border min-h-screen font-serif">
                <div className="text-center border-b-2 pb-4 mb-6">
                    <h1 className="text-2xl font-bold">PHOENIX INDUSTRIES</h1>
                    <p className="text-sm">OFFICIAL QUOTATION: {formData.quoteNo}</p>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-bold">To: {formData.clientName || '---'}</p>
                </div>

                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-slate-100 text-xs">
                            <th className="border p-2">Sr.</th>
                            <th className="border p-2 text-left">Part Details</th>
                            <th className="border p-2">HSN</th>
                            <th className="border p-2 text-right">Rate (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={i} className="text-sm">
                                <td className="border p-2 text-center">{i + 1}</td>
                                <td className="border p-2">
                                    <p className="font-bold">{item.partNo}</p>
                                    <p className="text-xs text-gray-500">{item.partName}</p>
                                </td>
                                <td className="border p-2 text-center">{item.hsnCode}</td>
                                <td className="border p-2 text-right font-bold">{item.unitRate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Quotation;
