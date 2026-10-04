import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'node:path';
import { existsSync } from 'node:fs';

import { config } from './config.js';
import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/userRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // middleware
  app.use(cors({ origin: config.corsOrigin }));
  app.use(morgan(config.isProd ? 'combined' : 'dev'));
  app.use(express.json());

  // API ทั้งหมดอยู่ใต้ /api
  app.get('/api', (req, res) => {
    res.json({
      message: 'Campus Service API is running',
      version: '3.0.0',
      env: config.env,
    });
  });

  app.use('/api/health', healthRoutes);
  app.use('/api/requests', requestRoutes);
  app.use('/api/users', userRoutes);

  // production: Express เสิร์ฟ React build ด้วยพอร์ตเดียว
  if (config.isProd && existsSync(config.staticDir)) {
    app.use(express.static(config.staticDir));

    // React Router จัดการทุก path ที่ไม่ใช่ /api ต่อเอง
    app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(path.join(config.staticDir, 'index.html'));
    });
  } else {
    // development: frontend ทำงานแยกที่ Vite :5173
    app.get('/', (req, res) => {
      res.json({
        message: 'API (dev) — หน้าเว็บอยู่ที่พอร์ต 5173',
        api: '/api',
        health: '/api/health',
      });
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
