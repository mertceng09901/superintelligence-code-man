import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Docker konteynerinde dış erişim için gerekli
    port: 3000,        // Docker compose ile eşleşen port
    strictPort: true,  // Port kullanılıyorsa hata ver (çakışma önleme)
  }
})
