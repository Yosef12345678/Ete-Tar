import { Router } from 'express';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middlewares/authMiddleware';

const router = Router();

router.get('/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  return res.json({
    message: 'Protected profile data',
    user: req.user
  });
});

router.get('/admin', authenticateToken, requireRole('admin'), (_req, res) => {
  return res.json({
    message: 'Admin-only content'
  });
});

export default router;
