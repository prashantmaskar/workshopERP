import mongoose from 'mongoose';

const InvoiceLineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  taxPercent: { type: Number, default: 18 },
  total: { type: Number, required: true }
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: String,
  invoiceDate: { type: Date, default: Date.now },
  dueDate: Date,
  poReference: String,
  lineItems: [InvoiceLineItemSchema],
  paymentMethod: { type: String, enum: ['Bank Transfer', 'Cheque', 'Cash'], default: 'Bank Transfer' },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  paidAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Paid', 'Partial', 'Overdue'], default: 'Draft' },
  notes: String
}, { timestamps: true });

export const Invoice = mongoose.model('Invoice', InvoiceSchema);

const JobCostingSchema = new mongoose.Schema({
  jobCode: { type: String, required: true, unique: true },
  jobDescription: String,
  startDate: Date,
  endDate: Date,
  department: String,
  resources: {
    laborHours: Number,
    laborRate: Number,
    laborCost: Number,
    materialCost: Number,
    overheadCost: Number
  },
  estimatedRevenue: Number,
  calculations: {
    totalCost: Number,
    profit: Number,
    profitMargin: Number
  },
  status: { type: String, enum: ['Open', 'Completed', 'Cancelled'], default: 'Open' },
  notes: String
}, { timestamps: true });

export const JobCosting = mongoose.model('JobCosting', JobCostingSchema);
