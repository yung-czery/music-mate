import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { search } from '../controllers/spotify.controller';

const router = Router();

router.use(authenticateToken);

router.get('/search', search);

export default router;