const mongoose = require('mongoose');

// CUSTOMER MASTER: Based on your Image 1
const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  gstNo: String,
  state: { type: String, default: 'Maharashtra' }, // Determines 9+9 vs 18% GST
  email: String,
  contactNo: String
});

const QuotationSchema = new mongoose.Schema({
  quoteNo: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  // CHANGE THIS: Array of items
  items: [{
    partNo: String,
    partName: String,
    hsnCode: { type: String, default: '8708' },
    unitRate: Number,
    qty: { type: Number, default: 1 } // Optional: if you want to show total
  }],
  notes: String,
  status: { type: String, default: 'Pending' }
});

// MATERIAL INWARD: Based on your Image 4 logic
const InwardSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  partNo: String,
  challanNo: String,
  challanQty: Number,
  receivedQty: Number,
  shortQty: Number, // Challan - Received
  vehicleNo: String,
  driverName: String,
  date: { type: Date, default: Date.now }
});
// Add this to your existing models file
const POSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  poDate: { type: Date, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  quotationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation', required: true },
  // This must match the structure of the items in Quotation
  items: [{
    partNo: String,
    partName: String,
    unitRate: Number,
    hsnCode: { type: String, default: '8708' }
  }],
  status: { type: String, default: 'Open' }
});

module.exports = {
  Client: mongoose.model('Client', ClientSchema),
  Quotation: mongoose.model('Quotation', QuotationSchema),
  Inward: mongoose.model('Inward', InwardSchema),
  PO: mongoose.model('PO', POSchema)
};