/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    // Test environment
    environment: 'node',

    // Global setup
    globals: true,

    // Root directory
    root: './test',

    // Test files pattern
    include: ['**/*.e2e-spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.git', '.cache'],

    // Setup files
    setupFiles: ['./setup-e2e.ts'],

    // Test timeout (longer for E2E)
    testTimeout: 30000,

    // Hooks timeout
    hookTimeout: 30000,

    // Clear mocks between tests
    clearMocks: true,

    // Restore mocks after each test
    restoreMocks: true,

    // Sequential execution for E2E tests
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },

    // Reporter
    reporter: ['verbose'],
  },

  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '@core': resolve(__dirname, '../src/core'),
      '@domain': resolve(__dirname, '../src/domain'),
      '@application': resolve(__dirname, '../src/application'),
      '@infra': resolve(__dirname, '../src/infra'),
    },
  },
})
