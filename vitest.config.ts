/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    // Test environment
    environment: 'node',
    
    // Global setup
    globals: true,
    
    // Root directory
    root: './src',
    
    // Test files pattern
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.git', '.cache'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: '../coverage',
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/index.ts',
        'main.ts',
        'health-check.ts',
        '**/*.interface.ts',
        '**/*.module.ts',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    
    // Setup files
    setupFiles: ['../test/setup.ts'],
    
    // Test timeout
    testTimeout: 10000,
    
    // Hooks timeout
    hookTimeout: 10000,
    
    // Clear mocks between tests
    clearMocks: true,
    
    // Restore mocks after each test
    restoreMocks: true,
    
    // Mock reset
    mockReset: true,
    
    // Watch options
    watch: false,
    
    // Reporter
    reporter: ['verbose', 'json', 'html'],
    
    // Output file for reporters
    outputFile: {
      json: '../test-results.json',
      html: '../test-results.html',
    },
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
      '@core': resolve(import.meta.dirname, './src/core'),
      '@domain': resolve(import.meta.dirname, './src/domain'),
      '@application': resolve(import.meta.dirname, './src/application'),
      '@infra': resolve(import.meta.dirname, './src/infra'),
    },
  },
  
  // Define global variables
  define: {
    'import.meta.vitest': undefined,
  },
})
