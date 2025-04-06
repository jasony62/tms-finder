import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const BASE_URL = process.env.VITE_BASE_URL
  ? process.env.VITE_BASE_URL
  : '/plugin/'

// https://vitejs.dev/config/
export default defineConfig({
  base: BASE_URL,
  build: {
    outDir: `dist${BASE_URL}`,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: parseInt(process.env.DEV_SERVER_PORT) || 9001
  },
})
