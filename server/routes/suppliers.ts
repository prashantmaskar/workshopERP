import { Router } from 'express';
import { Supplier } from '../models/BaseModels.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const supplier = new Supplier(req.body);
  try {
    const newSupplier = await supplier.save();
    res.status(201).json(newSupplier);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
