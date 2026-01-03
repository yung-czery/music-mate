import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import cookieParser from 'cookie-parser';
import playlistRoutes from './routes/playlist.routes';
import spotifyRoutes from './routes/spotify.routes';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/spotify', spotifyRoutes);

export default app;