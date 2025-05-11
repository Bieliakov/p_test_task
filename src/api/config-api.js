import {
  API_ENDPOINTS, DEFAULT_COMMISSION_CONFIG, CURRENCY, CACHE_SETTINGS,
} from '../constants.js';

// Configuration cache with expiration times
const configCache = {};

/**
 * Returns default configuration in case API is unavailable
 * @param {string} endpoint - API endpoint path
 * @returns {Object} Default configuration
 */
const getDefaultConfig = (endpoint) => {
  switch (endpoint) {
    case API_ENDPOINTS.CASH_IN:
      return {
        percents: DEFAULT_COMMISSION_CONFIG.CASH_IN.PERCENT,
        max: {
          amount: DEFAULT_COMMISSION_CONFIG.CASH_IN.MAX_AMOUNT,
          currency: CURRENCY.EUR,
        },
      };
    case API_ENDPOINTS.CASH_OUT_NATURAL:
      return {
        percents: DEFAULT_COMMISSION_CONFIG.CASH_OUT_NATURAL.PERCENT,
        week_limit: {
          amount: DEFAULT_COMMISSION_CONFIG.CASH_OUT_NATURAL.WEEKLY_FREE_LIMIT,
          currency: CURRENCY.EUR,
        },
      };
    case API_ENDPOINTS.CASH_OUT_JURIDICAL:
      return {
        percents: DEFAULT_COMMISSION_CONFIG.CASH_OUT_JURIDICAL.PERCENT,
        min: {
          amount: DEFAULT_COMMISSION_CONFIG.CASH_OUT_JURIDICAL.MIN_AMOUNT,
          currency: CURRENCY.EUR,
        },
      };
    default:
      return {};
  }
};

/**
 * Fetches commission configuration from API with caching
 * @param {string} endpoint - API endpoint path
 * @returns {Promise<Object>} Configuration object
 */
export const fetchConfig = async (endpoint) => {
  try {
    // Check if we have a valid cached config
    const cachedConfig = configCache[endpoint];
    if (cachedConfig && Date.now() < cachedConfig.expiresAt) {
      console.log(`Using cached config for ${endpoint}`);
      return cachedConfig.data;
    }

    const apiBaseUrl = process.env.API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/${endpoint}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const config = await response.json();

    // Cache the successful response with expiration timestamp
    configCache[endpoint] = {
      data: config,
      expiresAt: Date.now() + CACHE_SETTINGS.EXPIRATION,
      timestamp: new Date().toISOString(),
    };

    return config;
  } catch (error) {
    console.error(`Error fetching config from ${endpoint}: ${error.message}`);

    // Try to use expired cache before falling back to defaults
    const cachedConfig = configCache[endpoint];
    if (cachedConfig) {
      console.warn(`Using expired cached config for ${endpoint} from ${cachedConfig.timestamp}`);
      return cachedConfig.data;
    }

    // Return default config as last resort
    console.warn(`Using default config for ${endpoint}`);
    return getDefaultConfig(endpoint);
  }
};
