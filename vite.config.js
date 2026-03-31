import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/GolfOlympic/', // これを追加！必ずフォルダ名と合わせる
  plugins: [react()],
  // ...その他の設定
})