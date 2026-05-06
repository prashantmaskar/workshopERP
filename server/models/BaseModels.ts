import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  gstNumber: { type: String, required: true },
  category: { type: String, enum: ['Raw Material', 'Hardware', 'Services', 'Tools'], default: 'Raw Material' },
  status: { type: String, enum: ['Active', 'Blacklisted', 'Inactive'], default: 'Active' },
}, { timestamps: true });

export const Supplier = mongoose.model('Supplier', SupplierSchema);

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  gstNumber: { type: String, required: true },
  segment: { type: String, enum: ['Automotive', 'Aerospace', 'General Engineering', 'Industrial'], default: 'Automotive' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

export const Customer = mongoose.model('Customer', CustomerSchema);
