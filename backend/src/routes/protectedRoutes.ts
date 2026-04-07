import { Router } from 'express';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middlewares/authMiddleware';
import  User  from '../models/User';
import { promoteToAdmin } from '../controllers/adminController';

// Add this route (must be after authenticateToken and requireRole)

const router = Router();
router.post('/admin/promote', authenticateToken, requireRole('admin'), promoteToAdmin);
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const user = await User.findByPk(req.user?.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  return res.json({
    id: user.id,
    email: user.email,
    role: user.role
  });
});

router.get('/admin', authenticateToken, requireRole('admin'), (_req, res) => {
  return res.json({
    message: 'Admin-only content'
  });
});

export default router;
