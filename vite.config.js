import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { miniDb } from './server/vite-stats.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), miniDb()],
})
