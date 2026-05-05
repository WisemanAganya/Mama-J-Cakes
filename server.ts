import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3008;

  app.use(express.json());

  // Simulation of M-Pesa Callback
  app.post('/api/mpesa/callback', (req, res) => {
    console.log('M-Pesa Callback received:', req.body);
    // In a real app, you'd verify the signature and update Firestore
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mama J's Cakes Server running on http://localhost:${PORT}`);
  });
}

startServer();
