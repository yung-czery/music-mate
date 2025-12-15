import { Request, Response } from 'express';
import prisma from '../utils/prisma';

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