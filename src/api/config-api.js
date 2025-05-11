import { API_ENDPOINTS, DEFAULT_COMMISSION_CONFIG, CURRENCY } from '../constants.js';

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
 * Fetches commission configuration from API
 * @param {string} endpoint - API endpoint path
 * @returns {Promise<Object>} Configuration object
 */
export const fetchConfig = async (endpoint) => {
  try {
    const apiBaseUrl = process.env.API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/${endpoint}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching config from ${endpoint}: ${error.message}`);
    // Return default config in case API is unavailable
    return getDefaultConfig(endpoint);
  }
};
