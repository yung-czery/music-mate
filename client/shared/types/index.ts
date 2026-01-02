export type User = {
  id: string;
  email: string;
  name?: string;
}

export type Playlist = {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  userId: string;
  spotifyId?: string;
  createdAt: Date;
  updatedAt: Date;
  tracks: Track[] | {
    coverUrl?: string | null;
  }[];
  _count?: {
    tracks: number;
  };
  user?: User;
}

export type Track = {
  id: string;
  spotifyId: string;
  title: string;
  artist: string;
  album: string;
  coverUrl?: string;
  durationMs: number;
  playlistId: string;
  createdAt: Date;
}

export type SpotifyTrack = {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  uri: string;
  duration_ms: number;
}