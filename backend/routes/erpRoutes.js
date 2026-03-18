const express = require('express');
const router = express.Router();
const { Client, Quotation, Inward,PO } = require('../models/ERPModels');

// 1. ADD NEW CLIENT (Image 1)
router.post('/clients', async (req, res) => {
  try {
    const client = new Client(req.body);
    const savedClient = await client.save();
    res.status(201).json(savedClient);
  } catch (err) {
    res.status(500).json({ error: "Could not save client", details: err });
  }
});

// 2. CALCULATE COSTING & GST (Image 2 & Invoice Example)
router.post('/calculate-quotation', async (req, res) => {
  try {
    const { operations, material, profitPercent, isInterState } = req.body;
    
    // Calculate Machine Operation Amounts: (Rate per Hour / 3600) * Time in Sec
    let opTotal = 0;
    const processedOps = operations.map(op => {
      const amt = (op.ratePerHour / 3600) * op.timeInSec;
      opTotal += amt;
      return { ...op, amount: amt.toFixed(2) };
    });

    // Calculate Scrap Value: (Input - Finish Weight) in KG * Scrap Rate
    const scrapWeightKG = (material.inputWeight - material.finishWeight) / 1000;
    const scrapValue = scrapWeightKG * material.scrapRate;
    
    // Sub-total and Profit Calculation
    const subTotal = opTotal - scrapValue;
    const profitAmount = (subTotal * profitPercent) / 100;
    const taxableValue = subTotal + profitAmount;

    // GST Logic: 9% CGST + 9% SGST (Local) or 18% IGST (Inter-state)
    let cgst = 0, sgst = 0, igst = 0;
    const GST_RATE = 0.18;

    if (isInterState) {
      igst = taxableValue * GST_RATE;
    } else {
      cgst = taxableValue * (GST_RATE / 2);
      sgst = taxableValue * (GST_RATE / 2);
    }

    const grandTotal = taxableValue + cgst + sgst + igst;

    res.json({
      processedOps,
      taxableValue: taxableValue.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      igst: igst.toFixed(2),
      grandTotal: Math.round(grandTotal)
    });
  } catch (err) {
    res.status(500).json({ error: "Calculation failed", details: err });
  }
});
// 1. GET ALL QUOTATIONS (Fixes the 404 Error)
router.get('/quotations', async (req, res) => {
  try {
    // .populate('clientId') is essential to get the Customer Name
    const quotations = await Quotation.find().populate('clientId').sort({ date: -1 });
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching quotations", error: err.message });
  }
});

// 2. POST NEW QUOTATION (Saves the data)
router.post('/quotations', async (req, res) => {
  try {
    const newQuotation = new Quotation(req.body);
    const saved = await newQuotation.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Error saving quotation", error: err.message });
  }
});

// 3. INWARD MATERIAL & SHORTAGE (Image 4)
router.post('/inward-entry', async (req, res) => {
  try {
    const { challanQty, receivedQty } = req.body;
    // Automatic Shortage Calculation: Challan - Received
    const shortQty = challanQty - receivedQty;
    
    const newInward = new Inward({ ...req.body, shortQty });
    const savedInward = await newInward.save();
    res.status(201).json(savedInward);
  } catch (err) {
    res.status(500).json({ error: "Could not log inward entry", details: err });
  }
});
router.get('/clients', async (req, res) => {
  try {
    const clients = await Client.find(); // This fetches everything from your 'clients' collection
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch clients", details: err });
  }
});
router.get('/inward-list', async (req, res) => {
  try {
    // .populate('clientId') is the magic—it pulls the Customer Name/Address 
    // from the Clients table into the Inward record.
    const inwards = await Inward.find().populate('clientId');
    res.json(inwards);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch inward list", details: err });
  }
});

router.get('/purchase-orders', async (req, res) => {
  const pos = await PO.find().populate('clientId').populate('quotationId');
  res.json(pos);
});
router.post('/invoices', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) { res.status(500).json(err); }
});

// Fetch all invoices for the History tab
router.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('clientId').sort({ date: -1 });
    res.json(invoices);
  } catch (err) { res.status(500).json(err); }
});
router.post('/purchase-orders', async (req, res) => {
  try {
    const newPO = new PO(req.body); // This saves poNumber, clientId, quotationId, and items[]
    await newPO.save();
    res.status(201).json(newPO);
  } catch (err) {
    console.error("Mongoose Save Error:", err.message); 
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;