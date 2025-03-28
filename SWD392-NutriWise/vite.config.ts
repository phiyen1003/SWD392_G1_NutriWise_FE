import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Proxy hiện tại cho API của bạn
      '/api': {
        target: 'https://nutriwise.azurewebsites.net',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Thêm proxy cho Google OAuth
      '/google': {
        target: 'https://accounts.google.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/google/, ''),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
  base: process.env.VITE_APP_BASE_URL || '/',
});