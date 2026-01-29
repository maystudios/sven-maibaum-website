import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const base = mode === 'production'
    ? (env.VITE_BASE_PATH || '/sven-maibaum-portfolio/')
    : '/'

  return {
    base,
    plugins: [react()],
  }
})
