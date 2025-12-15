import { Request, Response } from 'express';
import { searchTracks } from '../services/spotify.service';

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