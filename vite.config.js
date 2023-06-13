import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import * as packageJson from './package.json'

export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'SlimplateFilesystem',
      formats: ['es', 'cjs'],
      fileName: (format) => `slimplate-filesystem.${format === 'es' ? 'mjs' : 'cjs'}`
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)]
    }
  }
})
