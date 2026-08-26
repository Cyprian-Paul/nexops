import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This proxy setting means that when the frontend calls /backend/api/... during local
// development, requests actually get forwarded to your live Render backend, so you can
// test the whole app locally without running PHP on your own machine.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/backend': {
        target: 'https://nexops-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, '')
      }
    }
  }
});
