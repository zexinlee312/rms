import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true, // 允许改变源
        // 如果后端不需要 /api 前缀，可以开启 rewrite
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
