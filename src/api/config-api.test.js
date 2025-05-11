import { fetchConfig, configCache } from './config-api.js';
import {
  API_ENDPOINTS, DEFAULT_COMMISSION_CONFIG, CURRENCY, CACHE_SETTINGS,
} from '../constants.js';

// Mock the global fetch function
global.fetch = jest.fn();

// Helper function to create a successful mock response
const mockSuccessResponse = (data) => Promise.resolve({
  ok: true,
  json: () => Promise.resolve(data),
});

// Helper function to create a failed mock response
const mockErrorResponse = () => Promise.resolve({
  ok: false,
  status: 500,
  statusText: 'Internal Server Error',
});

describe('Config API', () => {
  let originalConsoleLog;
  let originalConsoleWarn;
  let originalConsoleError;
  let originalDateNow;

  beforeEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();

    // Clear the cache between tests
    Object.keys(configCache).forEach((key) => delete configCache[key]);

    // Set API base URL for tests
    process.env.API_BASE_URL = 'https://test-api.example.com';

    // Mock console methods to prevent test output pollution
    originalConsoleLog = console.log;
    originalConsoleWarn = console.warn;
    originalConsoleError = console.error;
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();

    // Save original Date.now for restoration
    originalDateNow = Date.now;
  });

  afterEach(() => {
    // Restore console methods
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;

    // Restore Date.now if it was mocked
    Date.now = originalDateNow;
  });

  // Original tests for fallback behavior
  test('fetchConfig should return default cash-in config when API is unavailable', async () => {
    // Mock fetch to simulate API failure
    fetch.mockImplementation(() => Promise.reject(new Error('Network error')));

    const endpoint = API_ENDPOINTS.CASH_IN;
    const result = await fetchConfig(endpoint);

    expect(result).toEqual({
      percents: DEFAULT_COMMISSION_CONFIG.CASH_IN.PERCENT,
      max: {
        amount: DEFAULT_COMMISSION_CONFIG.CASH_IN.MAX_AMOUNT,
        currency: CURRENCY.EUR,
      },
    });
  });

  test('fetchConfig should return default cash-out-natural config when API is unavailable', async () => {
    // Mock fetch to simulate API failure
    fetch.mockImplementation(() => Promise.reject(new Error('Network error')));

    const endpoint = API_ENDPOINTS.CASH_OUT_NATURAL;
    const result = await fetchConfig(endpoint);

    expect(result).toEqual({
      percents: DEFAULT_COMMISSION_CONFIG.CASH_OUT_NATURAL.PERCENT,
      week_limit: {
        amount: DEFAULT_COMMISSION_CONFIG.CASH_OUT_NATURAL.WEEKLY_FREE_LIMIT,
        currency: CURRENCY.EUR,
      },
    });
  });

  test('fetchConfig should return default cash-out-juridical config when API is unavailable', async () => {
    // Mock fetch to simulate API failure
    fetch.mockImplementation(() => Promise.reject(new Error('Network error')));

    const endpoint = API_ENDPOINTS.CASH_OUT_JURIDICAL;
    const result = await fetchConfig(endpoint);

    expect(result).toEqual({
      percents: DEFAULT_COMMISSION_CONFIG.CASH_OUT_JURIDICAL.PERCENT,
      min: {
        amount: DEFAULT_COMMISSION_CONFIG.CASH_OUT_JURIDICAL.MIN_AMOUNT,
        currency: CURRENCY.EUR,
      },
    });
  });

  // Tests for caching behavior
  test('fetchConfig should call API and cache the result', async () => {
    const mockConfig = {
      percents: 0.05,
      max: { amount: 10, currency: 'EUR' },
    };

    // Mock fetch to simulate successful API call
    fetch.mockImplementation(() => mockSuccessResponse(mockConfig));

    const endpoint = API_ENDPOINTS.CASH_IN;
    const result = await fetchConfig(endpoint);

    // Verify the correct API endpoint was called
    expect(fetch).toHaveBeenCalledWith(`https://test-api.example.com/${endpoint}`);
    expect(result).toEqual(mockConfig);
    expect(console.log).not.toHaveBeenCalled(); // First call shouldn't log cache hit
  });

  test('fetchConfig should use cached result on subsequent calls', async () => {
    const mockConfig = {
      percents: 0.05,
      max: { amount: 10, currency: 'EUR' },
    };

    // Mock fetch to simulate successful API call
    fetch.mockImplementation(() => mockSuccessResponse(mockConfig));

    const endpoint = API_ENDPOINTS.CASH_IN;

    // First call should make an API request
    const firstResult = await fetchConfig(endpoint);

    // Second call should use the cache
    const secondResult = await fetchConfig(endpoint);

    // Verify fetch was only called once
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(firstResult).toEqual(mockConfig);
    expect(secondResult).toEqual(mockConfig);

    // Verify we logged a cache hit message
    expect(console.log).toHaveBeenCalledWith(`Using cached config for ${endpoint}`);
  });

  test('fetchConfig should use expired cache when API fails', async () => {
    const mockConfig = {
      percents: 0.05,
      max: { amount: 10, currency: 'EUR' },
    };

    // First API call succeeds
    fetch.mockImplementationOnce(() => mockSuccessResponse(mockConfig));

    const endpoint = API_ENDPOINTS.CASH_IN;
    await fetchConfig(endpoint);

    // Manually make the cache expired by manipulating Date.now
    Date.now = jest.fn(() => originalDateNow() + CACHE_SETTINGS.EXPIRATION + 1000);

    // Second API call fails
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    // Should use expired cache instead of default config
    const result = await fetchConfig(endpoint);
    expect(result).toEqual(mockConfig);

    // Verify warning about expired cache
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(`Using expired cached config for ${endpoint}`));
  });

  test('fetchConfig should handle API error responses', async () => {
    // Create a mock for this test that returns the default config
    const mockDefaultConfig = {
      percents: DEFAULT_COMMISSION_CONFIG.CASH_IN.PERCENT,
      max: {
        amount: DEFAULT_COMMISSION_CONFIG.CASH_IN.MAX_AMOUNT,
        currency: CURRENCY.EUR,
      },
    };

    // Mock fetch to return an error response
    fetch.mockImplementation(() => mockErrorResponse());

    const endpoint = API_ENDPOINTS.CASH_IN;
    const result = await fetchConfig(endpoint);

    // Verify error and warning were logged
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`Error fetching config from ${endpoint}`));
    expect(console.warn).toHaveBeenCalledWith(`Using default config for ${endpoint}`);

    // Compare with the actual default config values from constants
    expect(result).toEqual(mockDefaultConfig);
  });

  // Additional edge case tests
  test('fetchConfig should refresh expired cache on successful API call', async () => {
    const initialConfig = {
      percents: 0.05,
      max: { amount: 10, currency: 'EUR' },
    };

    const updatedConfig = {
      percents: 0.06,
      max: { amount: 15, currency: 'EUR' },
    };

    // First API call succeeds with initialConfig
    fetch.mockImplementationOnce(() => mockSuccessResponse(initialConfig));

    const endpoint = API_ENDPOINTS.CASH_IN;
    const firstResult = await fetchConfig(endpoint);
    expect(firstResult).toEqual(initialConfig);

    // Manually make the cache expired
    Date.now = jest.fn(() => originalDateNow() + CACHE_SETTINGS.EXPIRATION + 1000);

    // Second API call succeeds with updatedConfig
    fetch.mockImplementationOnce(() => mockSuccessResponse(updatedConfig));

    // Should fetch new config from API
    const secondResult = await fetchConfig(endpoint);
    expect(secondResult).toEqual(updatedConfig);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test('fetchConfig should handle unknown endpoints with empty default config', async () => {
    // Mock fetch to simulate API failure
    fetch.mockImplementation(() => Promise.reject(new Error('Network error')));

    const unknownEndpoint = 'unknown-endpoint';
    const result = await fetchConfig(unknownEndpoint);

    // Should return an empty object for unknown endpoints
    expect(result).toEqual({});
    expect(console.warn).toHaveBeenCalledWith(`Using default config for ${unknownEndpoint}`);
  });

  test('fetchConfig should correctly handle API response that cannot be parsed as JSON', async () => {
    // Mock fetch to return a response with invalid JSON
    fetch.mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON')),
    }));

    const endpoint = API_ENDPOINTS.CASH_IN;
    const result = await fetchConfig(endpoint);

    // Should fallback to default config on JSON parse error
    expect(result).toEqual({
      percents: DEFAULT_COMMISSION_CONFIG.CASH_IN.PERCENT,
      max: {
        amount: DEFAULT_COMMISSION_CONFIG.CASH_IN.MAX_AMOUNT,
        currency: CURRENCY.EUR,
      },
    });

    // Verify error was logged
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error fetching config'));
  });

  test('fetchConfig should return the latest config when cache is refreshed', async () => {
    // Setup initial config
    const initialConfig = {
      percents: 0.03,
      max: { amount: 5, currency: 'EUR' },
    };

    // Setup updated config
    const updatedConfig = {
      percents: 0.04,
      max: { amount: 7, currency: 'EUR' },
    };

    // First call returns initial config
    fetch.mockImplementationOnce(() => mockSuccessResponse(initialConfig));

    const endpoint = API_ENDPOINTS.CASH_IN;
    const firstResult = await fetchConfig(endpoint);

    // Second call should still use cache (return initial config)
    fetch.mockImplementationOnce(() => mockSuccessResponse(updatedConfig));
    const cachedResult = await fetchConfig(endpoint);

    // Verify both results match initial config (due to caching)
    expect(firstResult).toEqual(initialConfig);
    expect(cachedResult).toEqual(initialConfig);
    expect(fetch).toHaveBeenCalledTimes(1);

    // Force cache expiration
    Date.now = jest.fn(() => originalDateNow() + CACHE_SETTINGS.EXPIRATION + 1000);

    // Third call with expired cache should fetch new config
    fetch.mockImplementationOnce(() => mockSuccessResponse(updatedConfig));
    const refreshedResult = await fetchConfig(endpoint);

    // Verify we got updated config after cache expired
    expect(refreshedResult).toEqual(updatedConfig);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
