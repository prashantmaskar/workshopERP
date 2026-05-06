import mongoose from 'mongoose';

const POLineItemSchema = new mongoose.Schema({
  itemCode: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true, default: 'pcs' },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true }
});

const PurchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  supplierName: String,
  orderDate: { type: Date, default: Date.now },
  expectedDeliveryDate: Date,
  lineItems: [POLineItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentTerms: { type: String, enum: ['COD', '15 Days', '30 Days', '45 Days', 'Advance'], default: '30 Days' },
  status: { type: String, enum: ['Draft', 'Sent', 'Received', 'Cancelled'], default: 'Draft' },
  notes: String
}, { timestamps: true });

export const PurchaseOrder = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
