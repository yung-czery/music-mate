export default defineEventHandler((event) => {
  const config = useRuntimeConfig();

  const token = getCookie(event, 'jwt');

  if (!token) {
    return sendRedirect(event, '/?import=error', 302);
  }

  const backendUrl = `${config.public.apiUrl}/api/spotify/login?token=${token}`;

  return sendRedirect(event, backendUrl, 302);
})