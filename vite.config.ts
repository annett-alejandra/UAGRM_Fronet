import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': resolve(import.meta.dirname, 'src/app'),
      '@shared': resolve(import.meta.dirname, 'src/shared'),
      '@entities': resolve(import.meta.dirname, 'src/entities'),
      '@features': resolve(import.meta.dirname, 'src/features'),
      '@widgets': resolve(import.meta.dirname, 'src/widgets'),
      '@pages': resolve(import.meta.dirname, 'src/pages'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/graphql': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2023',
    sourcemap: true,
  },
});
