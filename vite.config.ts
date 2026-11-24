import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'r3f-stack': ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'postprocessing'],
          'motion-ui': ['framer-motion', 'lenis', 'lucide-react'],
        },
      },
    },
  },
});
