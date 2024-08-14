import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://charlog-server.vercel.app/',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [react()],
})
