import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/summary': {
        target: 'http://localhost:8000', // 서버 주소
        changeOrigin: true,            // 호스트 헤더 변경
        secure: false                  // HTTPS가 아니더라도 허용
      },
    },
  },
})
