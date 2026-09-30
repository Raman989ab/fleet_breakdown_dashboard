import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' => the built /dist folder works from any static host (Netlify, GitHub Pages, file server)
export default defineConfig({
  base: './',
  plugins: [react()],
});
