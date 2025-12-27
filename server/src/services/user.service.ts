import prisma from '../utils/prisma';
import { fetchUserSpotifyPlaylists } from './spotify.service';
import { Playlist } from '../generated/prisma/client';

export const importSpotifyPlaylists = async (userId: string, accessToken: string): Promise<Playlist[]> => {
  const spotifyPlaylists = await fetchUserSpotifyPlaylists(accessToken);

  if (spotifyPlaylists.length === 0) {
    return [];
  }

  return prisma.$transaction(async (tx) => {

    const operations = spotifyPlaylists.map((sp: any) => {

      return tx.playlist.upsert({
        where: {
          userId_spotifyId: {
            userId: userId,
            spotifyId: sp.id
          }
        },

        update: {
          name: sp.name,
          description: sp.description || 'Zaimportowano ze Spotify',
          isPublic: sp.public || false,
        },

        create: {
          userId: userId,
          spotifyId: sp.id,
          name: sp.name,
          description: sp.description || 'Zaimportowano ze Spotify',
          isPublic: sp.public || false,
        },
      });
    });

    return await Promise.all(operations);
  }, {
    maxWait: 5000,
    timeout: 10000
  });
};