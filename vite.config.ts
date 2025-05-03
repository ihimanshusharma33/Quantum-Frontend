import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // Proxy API requests to the target backend
      '/api': {
        target: 'https://quantum-it-odx0.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'https://quantum-it-odx0.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
