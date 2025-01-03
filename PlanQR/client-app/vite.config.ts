import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: true,
    port: 3000,
    proxy: {
      '/schedule_student.php': {
        target: 'https://plan.zut.edu.pl',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/schedule_student.php/, '/schedule_student.php')
      }
    }
  },
  plugins: [react(), mkcert()],
});