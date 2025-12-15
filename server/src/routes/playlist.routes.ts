import { Router } from 'express';
import { createPlaylist, getUserPlaylists } from '../controllers/playlist.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/', createPlaylist);
router.get('/', getUserPlaylists);

export default router;
