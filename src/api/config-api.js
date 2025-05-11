import { CACHE_SETTINGS } from '../constants.js';
import { getDefaultConfig } from './config-default.js';

// Configuration cache with expiration times
export const configCache = {};

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
