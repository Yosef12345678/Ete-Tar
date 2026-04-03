import { Router } from 'express';
import { testDatabaseConnection } from '../config/database';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

router.get('/env-test', (_req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasJwtSecret: !!process.env.JWT_SECRET
  });
});

router.get('/db-test', async (_req, res) => {
  const connected = await testDatabaseConnection();

  if (connected) {
    return res.json({
      status: 'ok',
      message: 'Successfully connected to PostgreSQL',
      timestamp: new Date().toISOString()
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Database connection failed',
    timestamp: new Date().toISOString()
  });
});

export default router;
