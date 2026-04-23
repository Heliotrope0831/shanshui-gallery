import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // 修正点：加上 plugin-

// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: '/shanshui-gallery/', // 必须和你的 GitHub 仓库名完全一致，前后都要有斜杠
})