import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// IMPORTANT: 'base' must match your GitHub repo name exactly.
// If your repo is github.com/yourusername/app, keep '/app/'.
export default defineConfig({
  plugins: [react()],
  base: '/app/',
})
