import { Router } from 'express';
import { Customer } from '../models/BaseModels.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ customerName: 1 });
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const customer = new Customer(req.body);
  try {
    const saved = await customer.save();
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
