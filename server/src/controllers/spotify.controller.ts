import { Request, Response } from 'express';
import * as spotifyService from '../services/spotify.service';
import * as userService from '../services/user.service';
import * as playlistService from '../services/playlist.service';
import prisma from '../utils/prisma';
import { SpotifyRequest } from '../middlewares/spotify.middleware';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!query) {
      res.status(400).json({ error: 'Query parameter "q" is required' });
      return;
    }

    const rawData: any = await spotifyService.searchTracks(query, limit, offset);

    const tracks = rawData.tracks.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      artist: item.artists.map((a: any) => a.name).join(', '),
      album: item.album.name,
      image: item.album.images[0]?.url || '',
      uri: item.uri,
      duration_ms: item.duration_ms,
    }));

    res.json({
      tracks,
      total: rawData.tracks.total,
    });
  } catch (error) {
    res.status(500).json({ error: 'Spotify API error' });
  }
};

export const loginToSpotify = (req: Request, res: Response) => {
  const userId = req.user?.userId as string;

  const url = spotifyService.getAuthorizationUrl(userId);

  res.redirect(url);
};

export const spotifyCallback = async (req: Request, res: Response): Promise<void> => {
  const { code, state, error } = req.query;

  if (error) {
    res.status(400).send(`Spotify Error: ${error}`);
    return;
  }

  if (!code || !state) {
    res.status(400).send('Missing code or state');
    return;
  }

  const userId = state as string;

  try {
    const tokenData: any = await spotifyService.exchangeCodeForToken(code as string);

    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
    await prisma.user.update({
      where: { id: userId },
      data: {
        isSpotifyConnected: true,
        spotifyAccessToken: tokenData.access_token,
        spotifyRefreshToken: tokenData.refresh_token,
        spotifyTokenExpiresAt: expiresAt
      }
    });

    await userService.importSpotifyPlaylists(userId, tokenData.access_token);

    res.redirect(`${FRONTEND_URL}?import=success`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong during import');
  }
};

export const syncTracks = async (req: SpotifyRequest, res: Response): Promise<void> => {
  try {
    const { internalPlaylistId, spotifyPlaylistId } = req.body;
    const userId = req.user?.userId as string;

    const accessToken = req.spotifyAccessToken!;

    if (!internalPlaylistId || !spotifyPlaylistId) {
      res.status(400).json({ error: 'Missing playlist IDs' });
      return;
    }

    const rawTracks = await spotifyService.fetchPlaylistTracks(accessToken, spotifyPlaylistId);

    const result = await playlistService.syncSpotifyTracksToPlaylist(
      userId,
      internalPlaylistId,
      rawTracks,
    );

    res.json({
      message: 'Tracks imported successfully',
      totalTracksProcessed: result.count,
    });

  } catch (error: any) {
    console.error('Sync Error:', error);
    res.status(500).json({ error: error.message || 'Failed to sync tracks' });
  }
};

export const importPlaylists = async (req: SpotifyRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const accessToken = req.spotifyAccessToken!;

    await userService.importSpotifyPlaylists(userId, accessToken);

    res.json({ message: 'Playlists imported successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong during import');
  }
}