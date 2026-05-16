import mongoose from 'mongoose';

const MaterialInwardSchema = new mongoose.Schema({
  inwardNumber: { type: String, required: true, unique: true },
  poNumber: String,
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  partName: { type: String, required: true },
  inwardType: { type: String, enum: ['Forging', 'Rework', 'Direct', 'Other'], default: 'Forging' },
  challanQuantity: { type: Number, required: true },
  receivedDate: { type: Date, default: Date.now },
  receivedQuantity: { type: Number, required: true },
  shortageQuantity: { type: Number, default: 0 },
  warehouseLocation: { type: String, enum: ['Main', 'Secondary', 'Vault', 'Staging'], default: 'Main' },
  qcStatus: { type: String, enum: ['Pass', 'Fail', 'On Hold'], default: 'Pass' },
  qcRemarks: String,
  receivedBy: String,
  qcInspectedBy: String,
  driverName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  availableBalance: { type: Number, required: true } // For FIFO tracking
}, { timestamps: true });

export const MaterialInward = mongoose.model('MaterialInward', MaterialInwardSchema);

const MaterialDispatchSchema = new mongoose.Schema({
  dispatchNumber: { type: String, required: true, unique: true },
  dispatchType: { type: String, enum: ['Invoice', 'Delivery'], default: 'Invoice' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: String,
  itemDescription: { type: String, required: true },
  dispatchQuantity: { type: Number, required: true },
  dispatchDate: { type: Date, default: Date.now },
  rate: Number,
  gstAmount: Number,
  transportMode: { type: String, enum: ['Road', 'Rail', 'Air', 'Sea'], default: 'Road' },
  vehicleNumber: String,
  driverName: String,
  driverPhone: String,
  trackingNumber: String,
  status: { type: String, default: 'Pending' },
  specialInstructions: String
}, { timestamps: true });

export const MaterialDispatch = mongoose.model('MaterialDispatch', MaterialDispatchSchema);
