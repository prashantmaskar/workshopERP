import { Router } from 'express';
import { PurchaseOrder } from '../models/PurchaseOrder.js';

const router = Router();

// Get all Purchase Orders
router.get('/', async (req, res) => {
  try {
    const pos = await PurchaseOrder.find().sort({ createdAt: -1 });
    res.json(pos);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Create a Purchase Order
router.post('/', async (req, res) => {
  const po = new PurchaseOrder(req.body);
  try {
    const newPO = await po.save();
    res.status(201).json(newPO);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Get single PO
router.get('/:id', async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) return res.status(404).json({ message: 'PO not found' });
    res.json(po);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
