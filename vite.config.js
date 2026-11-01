import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' membuat build jalan di GitHub Pages dengan nama repo apa pun
export default defineConfig({ plugins: [react()], base: './' })
