import { Request, Response } from 'express';
import { searchTracks } from '../services/spotify.service';
import * as spotifyService from '../services/spotify.service';
import * as userService from '../services/user.service';
import * as playlistService from '../services/playlist.service';

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;

    if (!query) {
      res.status(400).json({ error: 'Query parameter "q" is required' });
      return;
    }

    const results = await searchTracks(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Spotify API error' });
  }
};

export const loginToSpotify = (req: Request, res: Response) => {
  const userId = req.user?.userId as string;

  const url = spotifyService.getAuthorizationUrl(userId);

  // Albo res.redirect(url) albo zwracanie url i front przekieruje
  res.json({ url });
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
    const tokenData = await spotifyService.exchangeCodeForToken(code as string);

    // @ts-ignore
    const importedPlaylists = await userService.importSpotifyPlaylists(userId, tokenData.access_token);

    res.send(importedPlaylists);

  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong during import');
  }
};

export const syncTracks = async (req: Request, res: Response): Promise<void> => {
  try {
    // Frontend musi wysłać te 3 rzeczy
    const { internalPlaylistId, spotifyPlaylistId, accessToken } = req.body;

    const userId = req.user?.userId as string;

    if (!internalPlaylistId || !spotifyPlaylistId || !accessToken) {
      res.status(400).json({ error: 'Missing: internalPlaylistId, spotifyPlaylistId or accessToken' });
      return;
    }

    const rawTracks = await spotifyService.fetchPlaylistTracks(accessToken, spotifyPlaylistId);

    const result = await playlistService.syncSpotifyTracksToPlaylist(
      userId,
      internalPlaylistId,
      rawTracks
    );

    res.json({
      message: 'Tracks imported successfully',
      totalTracksProcessed: result.count
    });

  } catch (error: any) {
    console.error('Sync Error:', error);
    res.status(500).json({ error: error.message || 'Failed to sync tracks' });
  }
};