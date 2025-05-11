// Jest configuration for ES modules
export default {
  // Tell Jest to handle ESM modules
  transform: {},
  // Setup Jest globals for testing environment
  testEnvironment: 'node',
  // Match test files
  testMatch: ['**/*.test.js'],
  // Setup Jest globals
  injectGlobals: true,
  // Set timeout for tests
  testTimeout: 5000,
  // Setup file for Jest globals in ES modules
  setupFilesAfterEnv: ['./jest.setup.js'],
};
