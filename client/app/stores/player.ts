export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrackId: null as string | null,
    isVisible: false,
  }),

  getters: {
    embedUrl: (state) => {
      if (!state.currentTrackId) return '';
      return `https://open.spotify.com/embed/track/${state.currentTrackId}?utm_source=generator&theme=0`;
    }
  },

  actions: {
    play(trackId: string) {
      if (this.currentTrackId === trackId && !this.isVisible) {
        this.isVisible = true;
        return;
      }

      this.currentTrackId = trackId;
      this.isVisible = true;
    },

    close() {
      this.isVisible = false;
      this.currentTrackId = null;
    }
  }
});