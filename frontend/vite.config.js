import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/problems': 'http://localhost:4001',
      '/api/submissions': 'http://localhost:4002',
    },
  },
  build: {
    // Monaco is large on its own; it is lazy-loaded, so its chunk size is expected.
    chunkSizeWarningLimit: 5000,
  },
});
