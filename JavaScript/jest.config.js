/**
 * Jest configuration for ES modules support
 * Configures test environment for Node.js with ES6 module syntax
 * Uses experimental VM modules for proper import/export handling
 */
export default {
  testEnvironment: 'node',        // Run tests in Node.js environment
  transform: {},                   // Disable transformation (use native ES modules)
  testMatch: ['**/tests/**/*.test.js'],  // Pattern to find test files
  verbose: true                    // Display individual test results
};
