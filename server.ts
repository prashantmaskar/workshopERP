import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import poRoutes from './server/routes/purchaseOrders.js';
import supplierRoutes from './server/routes/suppliers.js';
import logisticsRoutes from './server/routes/logistics.js';
import financeRoutes from './server/routes/finance.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  let dbConnected = false;
  if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
      .then(() => {
        console.log('Connected to MongoDB');
        dbConnected = true;
      })
      .catch(err => {
        console.error('MongoDB connection error:', err);
        console.error('CRITICAL: Please ensure your MongoDB Atlas IP Access List (Network Access) is set to 0.0.0.0/0 or contains the current environment IP.');
      });
  } else {
    console.warn('MONGODB_URI not found in environment variables. Database features will be disabled.');
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      database: dbConnected ? 'connected' : 'error',
      timestamp: new Date().toISOString() 
    });
  });

  app.use('/api/purchase-orders', poRoutes);
  app.use('/api/suppliers', supplierRoutes);
  app.use('/api/logistics', logisticsRoutes);
  app.use('/api/finance', financeRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
