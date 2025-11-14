import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/lejcolia/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    host: 'localhost',
    port: 6600,
    strictPort: false, // Permet de changer de port si occupé
    https: false,
    open: true, // Ouvre automatiquement le navigateur
    hmr: {
      overlay: true // Affiche les erreurs en overlay
    },
    proxy: {
      '/api': {
        target: 'https://mombongov2.asdc-rdc.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  // Optimisation du build
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          bootstrap: ['bootstrap'],
          charts: ['chart.js']
        }
      }
    }
  }
})
