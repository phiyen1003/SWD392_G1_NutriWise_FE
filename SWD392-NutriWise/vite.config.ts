import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase the warning limit to 1000KB (or a suitable value)
  },
  base: process.env.VITE_APP_BASE_URL || '/', // Use environment variable to set base path
});
