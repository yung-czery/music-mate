import { Router } from 'express';
import {
  addTrack,
  createPlaylist,
  deletePlaylist,
  getPlaylistDetails,
  getUserPlaylists,
  removeTrack,
  updatePlaylist,
} from '../controllers/playlist.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/', createPlaylist);
router.get('/', getUserPlaylists);
router.delete('/:id', deletePlaylist);
router.patch('/:id', updatePlaylist);
router.get('/:id', getPlaylistDetails);

router.post('/:id/tracks', addTrack);
router.delete('/:id/tracks/:trackId', removeTrack);


export default router;
