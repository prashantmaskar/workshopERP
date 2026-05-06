import { Router } from 'express';
import { MaterialInward, MaterialDispatch } from '../models/Logistics.js';

const router = Router();

router.get('/inward', async (req, res) => {
  try {
    const records = await MaterialInward.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/inward', async (req, res) => {
  const record = new MaterialInward(req.body);
  try {
    const saved = await record.save();
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/dispatch', async (req, res) => {
  try {
    const records = await MaterialDispatch.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/dispatch', async (req, res) => {
  const record = new MaterialDispatch(req.body);
  try {
    const saved = await record.save();
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
