import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Configuración para PWA
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['idb']
        }
      }
    }
  },
  server: {
    // Para desarrollo con Service Worker
    host: true,
    port: 3000
  }
})