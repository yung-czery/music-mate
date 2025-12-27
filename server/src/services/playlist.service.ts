import prisma from '../utils/prisma';

type SpotifyTrackData = {
  spotifyId: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  durationMs: number;
}

export const addTrackToPlaylist = async (
  userId: string,
  playlistId: string,
  trackData: SpotifyTrackData
) => {
  return prisma.$transaction(async (tx) => {
    const playlist = await tx.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    if (playlist.userId !== userId) {
      throw new Error('Forbidden: You do not own this playlist');
    }

    const track = await tx.track.upsert({
      where: { spotifyId: trackData.spotifyId },
      update: {},
      create: {
        spotifyId: trackData.spotifyId,
        title: trackData.title,
        artist: trackData.artist,
        album: trackData.album,
        coverUrl: trackData.coverUrl,
        durationMs: trackData.durationMs,
      },
    });

    return tx.playlistTrack.create({
      data: {
        playlistId: playlist.id,
        trackId: track.id,
      },
    });
  });
};

export const removeTrackFromPlaylist = async (userId: string, playlistId: string, trackId: string) => {
  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
  });

  if (!playlist || playlist.userId !== userId) {
    throw new Error('Forbidden: You do not own this playlist');
  }

  return prisma.playlistTrack.deleteMany({
    where: {
      playlistId: playlistId,
      trackId: trackId
    }
  });
};

export const syncSpotifyTracksToPlaylist = async (
  userId: string,
  internalPlaylistId: string,
  spotifyTracks: any[]
) => {
  return prisma.$transaction(async (tx) => {
    const playlist = await tx.playlist.findUnique({
      where: { id: internalPlaylistId },
    });

    if (!playlist || playlist.userId !== userId) {
      throw new Error('Forbidden: You do not own this playlist');
    }

    const operations = spotifyTracks.map(async (item) => {
      const track = item.track;

      const artistName = track.artists.map((a: any) => a.name).join(', ');
      const coverUrl = track.album.images?.[0]?.url || null;

      const dbTrack = await tx.track.upsert({
        where: { spotifyId: track.id },
        update: {
          title: track.name,
          coverUrl: coverUrl,
        },
        create: {
          spotifyId: track.id,
          title: track.name,
          artist: artistName,
          album: track.album.name,
          coverUrl: coverUrl,
          durationMs: track.duration_ms,
        },
      });

      try {
        await tx.playlistTrack.create({
          data: {
            playlistId: internalPlaylistId,
            trackId: dbTrack.id,
            addedAt: item.added_at
          },
        });
      } catch (error: any) {
        if (error.code !== 'P2002') {
          throw error;
        }
      }
    });

    await Promise.all(operations);

    return { count: spotifyTracks.length };
  }, {
    timeout: 20000
  });
};