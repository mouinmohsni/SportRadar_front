import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Ajoutez ces alias pour les imports courants
      '@': '/src',
    }
  }
});

