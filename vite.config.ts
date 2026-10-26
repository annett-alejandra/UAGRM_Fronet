import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/shared/ui/button': resolve(import.meta.dirname, 'src/shared/ui/Button'),
      '@/shared/ui/input': resolve(import.meta.dirname, 'src/shared/ui/Input'),
      '@/shared/ui/card': resolve(import.meta.dirname, 'src/shared/ui/Card'),
      '@/shared/ui/badge': resolve(import.meta.dirname, 'src/shared/ui/Badge'),
      '@': resolve(import.meta.dirname, 'src'),
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
    fs: {
      strict: false,
    },
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
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const normalizedId = id.replace(/\\/g, '/');
            if (normalizedId.includes('/lucide-react/')) {
              return 'vendor-icons';
            }
            if (
              normalizedId.includes('/react/') ||
              normalizedId.includes('/react-dom/') ||
              normalizedId.includes('/react-router/') ||
              normalizedId.includes('/react-router-dom/') ||
              normalizedId.includes('/scheduler/')
            ) {
              return 'vendor-react';
            }
            if (
              normalizedId.includes('/class-variance-authority/') ||
              normalizedId.includes('/clsx/') ||
              normalizedId.includes('/tailwind-merge/') ||
              normalizedId.includes('/@radix-ui/')
            ) {
              return 'vendor-ui-primitives';
            }
            if (normalizedId.includes('/xlsx/')) {
              return 'vendor-xlsx';
            }
          }
        },
      },
    },
  },
});
