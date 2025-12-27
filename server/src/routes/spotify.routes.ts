import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { loginToSpotify, search, spotifyCallback } from '../controllers/spotify.controller';

const router = Router();

router.get('/search', authenticateToken, search);

router.get('/login', authenticateToken, loginToSpotify);
router.get('/callback', spotifyCallback);

export default router;