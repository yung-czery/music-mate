import axios from 'axios';
import qs from 'querystring';

type SpotifyTokenResponse = { access_token: string; token_type: string; expires_in: number; }

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_URL = 'https://api.spotify.com/v1';

let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

const getAccessToken = async (): Promise<string> => {
  if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
    return cachedToken;
  }

  console.log('Refreshing Spotify Access Token...');

  const authBuffer = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post<SpotifyTokenResponse>(
      TOKEN_URL,
      qs.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization: `Basic ${authBuffer}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, expires_in } = response.data;

    cachedToken = access_token;
    tokenExpiration = Date.now() + expires_in * 1000 - 60000;

    return access_token;
  } catch (error) {
    console.error('❌ Failed to get Spotify token', error);
    throw new Error('Spotify authentication failed');
  }
};

export const searchTracks = async (query: string) => {
  const token = await getAccessToken();

  try {
    const response = await axios.get(`${API_URL}/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: query,
        type: 'track,album',
        limit: 10,
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Spotify Search Error', error);
    throw new Error('Failed to fetch data from Spotify');
  }
};