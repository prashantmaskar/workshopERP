import { Router } from 'express';
import { Invoice, JobCosting } from '../models/Finance.js';

const router = Router();

router.get('/invoices', async (req, res) => {
  try {
    const records = await Invoice.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/invoices', async (req, res) => {
  const record = new Invoice(req.body);
  try {
    const saved = await record.save();
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/job-costing', async (req, res) => {
  try {
    const records = await JobCosting.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/job-costing', async (req, res) => {
  const record = new JobCosting(req.body);
  try {
    const saved = await record.save();
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
