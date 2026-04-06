import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { refreshAccessToken } from '../controllers/refreshController';

// Add this line after your other routes


const router = Router();
router.post('/refresh', refreshAccessToken);
router.post('/register', register);
router.post('/login', login);

export default router;
