import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const autoBase = process.env.NODE_ENV === 'production' && repo ? `/${repo}/` : '/'

export default defineConfig({
  plugins: [vue()],
  base: process.env.VITE_BASE_PATH || autoBase,
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
