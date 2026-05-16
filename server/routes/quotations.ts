import { Router } from 'express';
import { Quotation } from '../models/Quotation.ts';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const quotation = new Quotation(req.body);
  try {
    const saved = await quotation.save();
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
