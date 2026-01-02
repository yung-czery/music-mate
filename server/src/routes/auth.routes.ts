import { Router } from 'express';
import { register, login, getMe, logout, updateUser, deleteUser } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/me', authenticateToken, getMe);
router.put('/', authenticateToken, updateUser);
router.delete('/', authenticateToken, deleteUser);

export default router;