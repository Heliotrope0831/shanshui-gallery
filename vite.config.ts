import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // 修正点：加上 plugin-

// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: '/', // Netlify 喜欢这种简单的
})