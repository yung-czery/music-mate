import axios from 'axios';
import qs from 'querystring';

type SpotifyTokenResponse = { access_token: string; token_type: string; expires_in: number; }

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
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

export const getAuthorizationUrl = (userId: string) => {
  const scopes = [
    'playlist-read-private',
    'playlist-read-collaborative'
  ];

  const params = qs.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scopes.join(' '),
    redirect_uri: REDIRECT_URI,
    state: userId,
    show_dialog: true
  });

  return `https://accounts.spotify.com/authorize?${params}`;
};

export const exchangeCodeForToken = async (code: string) => {
  const authBuffer = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          Authorization: `Basic ${authBuffer}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error exchanging code for token', error);
    throw new Error('Could not authenticate with Spotify');
  }
};

export const fetchUserSpotifyPlaylists = async (accessToken: string) => {
  try {
    const response = await axios.get<{items: any[];}>('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit: 50 }
    });

    return response.data.items;
  } catch (error) {
    console.error('❌ Error fetching playlists', error);
    throw new Error('Could not fetch playlists');
  }
};

export const fetchPlaylistTracks = async (accessToken: string, spotifyPlaylistId: string) => {
  let allTracks: any[] = [];
  let url: string | null = `https://api.spotify.com/v1/playlists/${spotifyPlaylistId}/tracks?limit=50`;

  console.log(`📥 Rozpoczynam pobieranie utworów dla playlisty: ${spotifyPlaylistId}`);

  while (url) {
    try {
      const response: any = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const { items, next } = response.data;

      const validItems = items.filter((item: any) => item.track && item.track.id);

      allTracks = [...allTracks, ...validItems];

      url = next;
    } catch (error) {
      console.error('❌ Błąd podczas pobierania strony utworów:', error);
      throw new Error('Failed to fetch playlist tracks from Spotify');
    }
  }

  console.log(`✅ Pobrano łącznie ${allTracks.length} utworów.`);
  return allTracks;
};