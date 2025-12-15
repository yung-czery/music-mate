import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import cookieParser from 'cookie-parser';
import playlistRoutes from './routes/playlist.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);

export default app;