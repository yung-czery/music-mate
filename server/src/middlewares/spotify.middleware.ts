import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import * as spotifyService from '../services/spotify.service';

export interface SpotifyRequest extends Request {
  spotifyAccessToken?: string;
}

export const ensureSpotifyAuth = async (req: SpotifyRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        spotifyAccessToken: true,
        spotifyRefreshToken: true,
        spotifyTokenExpiresAt: true
      }
    });

    if (!user || !user.spotifyAccessToken || !user.spotifyRefreshToken) {
      return res.status(401).json({ error: 'Spotify account not connected' });
    }

    const isExpired = user.spotifyTokenExpiresAt
      ? new Date(user.spotifyTokenExpiresAt).getTime() - 300000 < Date.now()
      : true;

    if (isExpired) {
      console.log('🔄 Token wygasł (lub zaraz wygaśnie). Odświeżam...');

      try {
        const data: any = await spotifyService.refreshAccessToken(user.spotifyRefreshToken);

        const newExpiresAt = new Date(Date.now() + (data.expires_in * 1000));

        await prisma.user.update({
          where: { id: userId },
          data: {
            spotifyAccessToken: data.access_token,
            spotifyTokenExpiresAt: newExpiresAt,
            ...(data.refresh_token && { spotifyRefreshToken: data.refresh_token })
          }
        });

        req.spotifyAccessToken = data.access_token;

      } catch (refreshError) {
        await prisma.user.update({
          where: { id: userId },
          data: { spotifyAccessToken: null, spotifyRefreshToken: null, spotifyTokenExpiresAt: null }
        });
        return res.status(401).json({ error: 'Spotify session expired. Please reconnect.' });
      }
    } else {
      req.spotifyAccessToken = user.spotifyAccessToken;
    }

    next();
  } catch (error) {
    console.error('Spotify Auth Middleware Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};