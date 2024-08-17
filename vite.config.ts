import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@ui': path.resolve(__dirname, './src/shared/ui'),
      '@assets': path.resolve(__dirname, './src/shared/assets'),
      '@helpers': path.resolve(__dirname, './src/shared/helpers'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@models': path.resolve(__dirname, './src/shared/api/models'),
      '@services': path.resolve(__dirname, './src/shared/api/services'),
    },
  },

  plugins: [react()],
})
