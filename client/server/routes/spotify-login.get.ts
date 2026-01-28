export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt'); // Pobieranie tokenu JWT

  if (!token) {
    return sendRedirect(event, '/?import=error', 302);
  }

  try {
    // Nuxt pyta Backend o URL autoryzacji
    const response = await $fetch<{ url: string }>(`/api/spotify/login`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Token JWT jest wysyłany w nagłówku
      }
    });

    // Backend zwrócił URL, przekierowujemy tam użytkownika
    return sendRedirect(event, response.url, 302);

  } catch (error) {
    console.error('Błąd komunikacji z backendem:', error);
    return sendRedirect(event, '/?import=error', 302);
  }
})