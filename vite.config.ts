import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ukraine-war/',
  plugins: [react()],
  server: {
    port: 8081,
  },
});
