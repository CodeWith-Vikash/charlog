import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://charlog-server.vercel.app',
        changeOrigin: true,
        secure: false, // Add this if you are dealing with self-signed certificates
      },
    },
  },
  plugins: [react()],
})
