import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import poRoutes from './server/routes/purchaseOrders.js';
import supplierRoutes from './server/routes/suppliers.js';
import logisticsRoutes from './server/routes/logistics.js';
import financeRoutes from './server/routes/finance.js';
import customerRoutes from './server/routes/customers.js';
import quotationRoutes from './server/routes/quotations.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(cors());

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  let dbConnected = false;
  if (MONGODB_URI) {
    console.log('Attempting to connect to MongoDB...');
    mongoose.connect(MONGODB_URI)
      .then(() => {
        console.log('✅ Connected to MongoDB Successfully');
        dbConnected = true;
      })
      .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        if (err.name === 'MongooseServerSelectionError') {
          console.error('\n' + '='.repeat(60));
          console.error('DIAGNOSTIC: IP WHITELIST ISSUE DETECTED');
          console.error('Your environment IP is not allowed to access your MongoDB Atlas cluster.');
          console.error('FIX: Log in to MongoDB Atlas -> Network Access -> Add IP Address -> Allow Access From Anywhere (0.0.0.0/0).');
          console.error('='.repeat(60) + '\n');
        }
        dbConnected = false;
      });
  } else {
    console.warn('⚠️ MONGODB_URI not found in environment variables. Database features will be disabled.');
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
  app.use('/api/customers', customerRoutes);
  app.use('/api/quotations', quotationRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    // Explicit SPA fallback for development
    app.use('*', async (req, res, next) => {
      // Skip API routes
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }

      try {
        const fs = await import('fs');
        const templatePath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(templatePath, 'utf8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Catch-all route for production SPA
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
