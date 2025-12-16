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
    });

    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch playlists' });
  }
};

export const updatePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, isPublic } = req.body;

    const userId = req.user?.userId;

    const existingPlaylist = await prisma.playlist.findUnique({
      where: { id },
    });

    if (!existingPlaylist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }

    if (existingPlaylist.userId !== userId) {
      res.status(403).json({ error: 'You do not have permission to edit this playlist' });
      return;
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    const updatedPlaylist = await prisma.playlist.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedPlaylist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update playlist' });
  }
};

export const deletePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const result = await prisma.playlist.deleteMany({
      where: {
        id: id,
        userId: userId
      }
    });

    if (result.count === 0) {
      res.status(404).json({ error: 'Playlist not found or access denied' });
      return;
    }

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete playlist' });
  }
};

export const addTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: playlistId } = req.params;
    const { spotifyId, title, artist, album, coverUrl, durationMs } = req.body;

    const userId = req.user?.userId as string;

    const result = await playlistService.addTrackToPlaylist(userId, playlistId, {
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

export const getPlaylistDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: {
        tracks: {
          orderBy: { addedAt: 'desc' },
          include: {
            track: true
          }
        }
      }
    });

    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }

    if (!playlist.isPublic && playlist.userId !== userId) {
      res.status(403).json({ error: 'Access denied to this private playlist' });
      return;
    }

    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch playlist details' });
  }
};

export const removeTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: playlistId, trackId } = req.params;
    const userId = req.user?.userId as string;

    await playlistService.removeTrackFromPlaylist(userId, playlistId, trackId);

    res.status(200).json({ message: 'Track removed from playlist' });
  } catch (error: any) {
    if (error.message.includes('Forbidden')) {
      res.status(403).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Could not remove track' });
  }
};