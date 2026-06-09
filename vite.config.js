import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use the project's own public folder (where your frames live)
  publicDir: 'public',
  server: { port: 5175 }
})
