import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@/components', replacement: path.resolve(__dirname, 'src/components') }
    ]
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-slot'
          ]
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
