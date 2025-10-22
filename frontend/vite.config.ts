import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react()],
    build: {
      outDir: 'build',  // Bu satırı ekleyin
    },
    server: {
      port: 8083,
      proxy: {
        ...(env.VITE_STRUCTER_URL && {
          '/api': {
            target: `${env.VITE_STRUCTER_URL}/api`,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          },
        }),
      },
    },
  }
})