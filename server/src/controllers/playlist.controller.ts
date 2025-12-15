import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import * as playlistService from '../services/playlist.service';

export const createPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, isPublic } = req.body;

    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        isPublic: isPublic || false,
        userId: userId,
      },
    });

    res.status(201).json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create playlist' });
  }
};

export const getUserPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const playlists = await prisma.playlist.findMany({
      where: { userId },
      include: { tracks: true },
    });

    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch playlists' });
  }
};

export const addTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: playlistId } = req.params;
    const { spotifyId, title, artist, album, coverUrl, durationMs } = req.body;

    const userId = req.user?.userId;

    const result = await playlistService.addTrackToPlaylist(<string>userId, playlistId, {
      spotifyId,
      title,
      artist,
      album,
      coverUrl,
      durationMs,
    });

    res.status(201).json(result);
  } catch (error: any) {
    if (error.message.includes('Forbidden')) {
      res.status(403).json({ error: error.message });
      return;
    }
    if (error.message.includes('Playlist not found')) {
      res.status(404).json({ error: error.message });
      return;
    }
    // Gdy utwór już jest na playliście
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Track already exists in this playlist' });
      return;
    }

    console.error(error);
    res.status(500).json({ error: 'Could not add track to playlist' });
  }
};