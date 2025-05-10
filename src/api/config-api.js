import fetch from 'node-fetch';

/**
 * Fetches commission configuration from API
 * @param {string} endpoint - API endpoint path
 * @returns {Promise<Object>} Configuration object
 */
export const fetchConfig = async (endpoint) => {
  try {
    const response = await fetch(`https://developers.paysera.com/tasks/api/${endpoint}`);
    
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

/**
 * Returns default configuration in case API is unavailable
 * @param {string} endpoint - API endpoint path
 * @returns {Object} Default configuration
 */
const getDefaultConfig = (endpoint) => {
  switch (endpoint) {
    case 'cash-in':
      return {
        percents: 0.03,
        max: {
          amount: 5,
          currency: 'EUR',
        },
      };
    case 'cash-out-natural':
      return {
        percents: 0.3,
        week_limit: {
          amount: 1000,
          currency: 'EUR',
        },
      };
    case 'cash-out-juridical':
      return {
        percents: 0.3,
        min: {
          amount: 0.5,
          currency: 'EUR',
        },
      };
    default:
      return {};
  }
};
