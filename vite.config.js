import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration Vite pour Vercel - FORCE DEPLOY
// Mis à jour à 17h00 pour relancer le build
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});