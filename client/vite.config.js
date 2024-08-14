import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    Proxy:{
      '/api':'https://charlog-server.vercel.app'
    }
  },
  plugins: [react()],
})
