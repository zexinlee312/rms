import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 使用 Vite 内置环境变量判断，这在 vite build 时更可靠
export default defineConfig(({ mode }) => {
  return {
    // 如果是生产构建，强制使用子应用服务路径作为基准，解决静态资源 text/html 错误
    base: mode === 'production' ? '/rms-app-service/' : '/',
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
  }
})
