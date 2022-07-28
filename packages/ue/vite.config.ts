import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const BASE_URL = env.VITE_BASE_URL ? env.VITE_BASE_URL : '/tmsfinder'

  return defineConfig({
    base: BASE_URL,
    build: {
      outDir: `dist${BASE_URL}`,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [vue()],
    server: {
      port: parseInt(process.env.SERVER_PORT) || 9010,
      fs: {
        strict: false,
        allow: [],
      },
    },
  })
}
