import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Để truy cập từ mạng LAN, đổi `true` thay vì 'localhost'
    port: 3000,
    open: true, // Tự động mở trình duyệt khi chạy server
    strictPort: true, // Nếu port 3000 bận, Vite báo lỗi thay vì tự động đổi
    cors: true, // Cho phép CORS (nếu cần API từ nguồn khác)
  },
  build: {
    sourcemap: true, // Debug dễ hơn trong môi trường production
    chunkSizeWarningLimit: 1000, // Giới hạn chunk size để tránh cảnh báo
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react'; // Nhóm React vào 1 file
            if (id.includes('lodash')) return 'vendor-lodash'; // Nhóm lodash riêng
            return 'vendor'; // Các thư viện khác
          }
          if (id.includes('src/pages/')) {
            return 'pages'; // Nhóm tất cả pages vào 1 chunk
          }
        },
      },
    },
    minify: 'esbuild', // Dùng esbuild để tối ưu tốc độ build
  },
});
