import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MaterialDispatch = () => {
    const [inwards, setInwards] = useState([]);
    const [selectedInward, setSelectedInward] = useState(null);
    const [dispatchData, setDispatchData] = useState({ qty: 0, rate: 0, vehicleNo: '', driverName: '' });

    useEffect(() => {
        // Fetch inward logs to select what to dispatch
        axios.get('https://workshoperpbakend.onrender.com/api/inward-list').then(res => setInwards(res.data));
    }, []);

    const taxableValue = dispatchData.qty * dispatchData.rate;
    const cgst = taxableValue * 0.09;
    const sgst = taxableValue * 0.09;
    const total = taxableValue + cgst + sgst;

    return (
        <div className="max-w-5xl mx-auto bg-white p-10 rounded-xl shadow-2xl border">
            <div className="flex justify-between border-b-2 pb-6 mb-6">
                <h2 className="text-3xl font-black text-indigo-900 italic">TAX INVOICE</h2>
                <div className="text-right text-sm">
                    {/* Update the Client Name Display */}
                    <p className="font-black text-lg text-indigo-900">
                        {selectedInward?.clientId?.name || "Client Name"}
                    </p>

                    {/* Update the Client Address Display */}
                    <p className="whitespace-pre-line text-xs">
                        {selectedInward?.clientId?.address || "Address Not Available"}
                    </p>

                    {/* Update the Client GST Display */}
                    <p className="mt-2 font-bold text-xs">
                        GSTIN: {selectedInward?.clientId?.gstNo || "N/A"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <label className="font-bold text-gray-500 uppercase text-xs">Select Inward Challan</label>
                    <select className="w-full border p-2 rounded" onChange={(e) => setSelectedInward(inwards.find(i => i._id === e.target.value))}>
                        <option>-- Select Linked Inward --</option>
                        {inwards.map(i => <option key={i._id} value={i._id}>{i.challanNo} - {i.partNo}</option>)}
                    </select>
                </div>
                <div className="text-right">
                    <p className="font-bold">Invoice No: PI/INV/25-26/001</p>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <table className="w-full border mb-6">
                <thead className="bg-gray-100 text-xs">
                    <tr><th className="border p-2">Description</th><th className="border p-2">HSN</th><th className="border p-2">Qty</th><th className="border p-2">Rate</th><th className="border p-2">Amount</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border p-2">{selectedInward?.partNo || 'Select Part'}</td>
                        <td className="border p-2 text-center">87084000</td>
                        <td className="border p-2"><input type="number" className="w-16 border" onChange={e => setDispatchData({ ...dispatchData, qty: e.target.value })} /></td>
                        <td className="border p-2"><input type="number" className="w-16 border" onChange={e => setDispatchData({ ...dispatchData, rate: e.target.value })} /></td>
                        <td className="border p-2 font-bold">₹{taxableValue}</td>
                    </tr>
                </tbody>
            </table>

            <div className="flex justify-end">
                <div className="w-64 space-y-2 border-t pt-4">
                    <div className="flex justify-between"><span>Taxable Value:</span> <span>₹{taxableValue}</span></div>
                    <div className="flex justify-between text-gray-500"><span>CGST (9%):</span> <span>₹{cgst}</span></div>
                    <div className="flex justify-between text-gray-500"><span>SGST (9%):</span> <span>₹{sgst}</span></div>
                    <div className="flex justify-between font-black text-xl border-t pt-2 text-indigo-950">
                        <span>GRAND TOTAL:</span> <span>₹{total}</span>
                    </div>
                </div>
            </div>

            <div className="mt-10 pt-6 border-t grid grid-cols-2 text-xs">
                <div>
                    <p className="font-bold">Bank Details:</p>
                    <p>Bank: Janaseva Sahkari Bank</p>
                    <p>A/c No: 26021000109</p>
                    <p>IFSC: JANA0000026</p>
                </div>
                <div className="text-right flex flex-col justify-end italic text-gray-400">
                    <p>For Phoenix Industries</p>
                    <p className="mt-10 underline">Authorized Signatory</p>
                </div>
            </div>
        </div>
    );
};

export default MaterialDispatch;
