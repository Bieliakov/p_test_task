import {
  API_ENDPOINTS, DEFAULT_COMMISSION_CONFIG, CURRENCY,
} from '../constants.js';

/**
 * Returns default configuration in case API is unavailable
 * @param {string} endpoint - API endpoint path
 * @returns {Object} Default configuration
 */
export const getDefaultConfig = (endpoint) => {
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
