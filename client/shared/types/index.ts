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
  createdAt: Date;
  updatedAt: Date;
  tracks: {
    coverUrl?: string | null;
  }[];
  user?: User;
}