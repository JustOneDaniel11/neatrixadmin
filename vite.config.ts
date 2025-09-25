import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        admin: path.resolve(__dirname, 'admin.html')
      }
    }
  },
  server: {
    port: 8081,
    open: '/admin.html'
  },
  root: '.'
})