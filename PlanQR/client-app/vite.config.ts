/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname,'../certs/planqr.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../certs/qrplan.pem')),
    },
    port: 443,
    host: true,
    proxy: {
      '/schedule_student.php': {
        target: 'https://plan.zut.edu.pl',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/schedule_student.php/, '/schedule_student.php')
      },
      '/api': {
        target: 'https://192.168.203.248', // Twój backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // Usuwa prefix `/api` (jeśli nie jest potrzebny)
      },
    },
    hmr: {
      host: 'planqr.wi.zut.edu.pl', // Ustaw hosta na domenę aplikacji
      protocol: 'wss', // Użyj WebSocket Secure (wss) dla HTTPS
    },
  },
  plugins: [react()],
});