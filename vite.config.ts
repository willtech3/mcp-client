import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve'
  return {
    plugins: [react()],
    define: {
      'process.env.VITE_DEV_SERVER_URL': isDev ? JSON.stringify('http://localhost:5173') : 'undefined',
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
      },
    },
  }
})
