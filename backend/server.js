const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import the Routes you just created
const erpRoutes = require('./routes/erpRoutes');

const app = express();

// --- MIDDLEWARE ---
// Allows your React frontend to talk to this backend
app.use(cors()); 
// Allows the server to understand JSON data sent in requests
app.use(express.json()); 

// --- DATABASE CONNECTION ---
// Connects to MongoDB Atlas (using the link in your .env file)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/workshop_erp';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to Workshop Database (MongoDB)'))
  .catch(err => console.error('❌ Database connection error:', err));

// --- API ROUTES ---
// This tells the server to use your ERP logic whenever a request 
// starts with "/api" (e.g., http://localhost:5000/api/calculate-quotation)
app.use('/api', erpRoutes);

// --- START THE SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Workshop ERP Backend is running on port ${PORT}`);
});