/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 현재 실행 모드(development, production)에 맞는 환경 변수 로드
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/summary': {
          target: env.VITE_PROXY_TARGET, // 환경 변수 사용
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/summary/, '/summary'),
        },
      },
    },
  };
});
