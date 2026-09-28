import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Must match the GitHub repository name
export default defineConfig({ base: '/german-learning-platform/', plugins: [react()] })
