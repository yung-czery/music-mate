import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  importPlaylists,
  loginToSpotify,
  search,
  spotifyCallback,
  syncTracks,
} from '../controllers/spotify.controller';
import { ensureSpotifyAuth } from '../middlewares/spotify.middleware';

const router = Router();

router.get('/search', authenticateToken, search);

router.get('/login', authenticateToken, loginToSpotify);
router.get('/callback', spotifyCallback);

router.post('/sync', authenticateToken, ensureSpotifyAuth, syncTracks);
router.post('/import', authenticateToken, ensureSpotifyAuth, importPlaylists);

export default router;