import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 生产环境使用 /rms-app-service/ 前缀，开发环境使用 /
const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  base: isProd ? '/rms-app-service/' : '/',
  plugins: [react()],
  server: {
    port: 5174,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
