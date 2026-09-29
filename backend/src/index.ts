import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import cookieParser from 'cookie-parser';
import { config } from './config';

import authRoutes from './routes/auth';
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';

const app = express();

// Disable Cross-Origin-Resource-Policy restriction so frontend on port 40000 can display backend uploaded images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true, // Allow cookies across origins
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local uploads folder (supporting both backend/uploads and root/uploads)
const fs = require('fs');
const backendUploads = path.resolve(__dirname, '../uploads');
const rootUploads = path.resolve(__dirname, '../../uploads');

[backendUploads, rootUploads].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Sync existing files from backend/uploads to root/uploads and vice-versa
try {
  if (fs.existsSync(backendUploads)) {
    const files = fs.readdirSync(backendUploads);
    for (const f of files) {
      const src = path.join(backendUploads, f);
      const dst = path.join(rootUploads, f);
      if (fs.statSync(src).isFile() && !fs.existsSync(dst)) {
        fs.copyFileSync(src, dst);
      }
    }
  }
} catch (e) {
  console.warn('Upload sync error:', e);
}

// Enable CORS and serve static uploads
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use('/uploads', express.static(backendUploads));
app.use('/uploads', express.static(rootUploads));

// Mount Auth, Public, & Admin API
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, status: 'healthy', timestamp: new Date().toISOString() });
});

// Centralized 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Centralized error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`Portfolio REST API running on port ${config.port}`);
  });
}

export default app;
