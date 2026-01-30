import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      // Stub this package which pulls an ESM-only implementation via require
      'html-encoding-sniffer': path.resolve(__dirname, 'test-stubs/html-encoding-sniffer.cjs'),
    },
  },
  test: {
    environment: 'jsdom',
    threads: false,
  },
})
