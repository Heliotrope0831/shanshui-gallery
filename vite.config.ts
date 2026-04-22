import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // 确保资源路径正确，防止部署后白屏
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // 允许你用 @ 代替 src 目录，代码更简洁
    },
  },
})