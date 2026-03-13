import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    cors: true, // 允许基座应用跨域获取资源
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  // 如果子应用部署在子路径，或者为了微前端静态资源加载，需要配置 base
  // base: '/rms/', 
})
