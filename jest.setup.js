// This file sets up the Jest test environment for ES modules

// Create a Jest global namespace for ES modules
// This is necessary because Jest doesn't provide its functions globally in ES modules
import { jest } from '@jest/globals';

// Expose Jest globals for tests
global.jest = jest;
global.expect = expect;
global.test = test;
global.describe = describe;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.beforeAll = beforeAll;
global.afterAll = afterAll;
