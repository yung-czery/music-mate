import { Router } from 'express';
import {
  addTrack,
  createPlaylist,
  deletePlaylist,
  getPlaylistDetails,
  getPublicPlaylists,
  getUserPlaylists,
  removeTrack,
  updatePlaylist,
} from '../controllers/playlist.controller';
import { authenticateToken, optionalAuthenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/public', getPublicPlaylists);
router.get('/:id', optionalAuthenticateToken, getPlaylistDetails);

router.use(authenticateToken);

router.post('/', createPlaylist);
router.get('/', getUserPlaylists);
router.delete('/:id', deletePlaylist);
router.patch('/:id', updatePlaylist);

router.post('/:id/tracks', addTrack);
router.delete('/:id/tracks/:trackId', removeTrack);


export default router;
