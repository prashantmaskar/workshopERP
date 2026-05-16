import mongoose from 'mongoose';

const OperationSchema = new mongoose.Schema({
  operationName: { type: String, required: true },
  rate: { type: Number, required: true },
  timeSeconds: { type: Number, required: true },
  amount: { type: Number } // Added for Change 1 of Quotation module
});

const QuotationSchema = new mongoose.Schema({
  quoteNo: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: String,
  attainedName: { type: String, required: true },
  mobile: String,
  partName: { type: String, required: true },
  partNumber: String,
  operations: [OperationSchema],
  materialDetails: {
    inputWeight: { type: Number, default: 0 },
    finishWeight: { type: Number, default: 0 },
    totalWeight: { type: Number, default: 0 },
    scrapRecovery: { type: Number, default: 0 },
    scrapRate: { type: Number, default: 0 },
    profitPercent: { type: Number, default: 15 },
    showScrapInReport: { type: Boolean, default: false } // Added for Change 2 of Quotation module
  },
  total: { type: Number, required: true },
  status: { type: String, enum: ['Draft', 'Sent', 'Accepted', 'Rejected'], default: 'Draft' }
}, { timestamps: true });

export const Quotation = mongoose.model('Quotation', QuotationSchema);
