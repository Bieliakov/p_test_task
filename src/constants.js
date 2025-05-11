export const API_ENDPOINTS = {
  CASH_IN: 'cash-in',
  CASH_OUT_NATURAL: 'cash-out-natural',
  CASH_OUT_JURIDICAL: 'cash-out-juridical',
};

export const DEFAULT_COMMISSION_CONFIG = {
  CASH_IN: {
    PERCENT: 0.03,
    MAX_AMOUNT: 5,
  },
  CASH_OUT_NATURAL: {
    PERCENT: 0.3,
    WEEKLY_FREE_LIMIT: 1000,
  },
  CASH_OUT_JURIDICAL: {
    PERCENT: 0.3,
    MIN_AMOUNT: 0.5,
  },
};

export const CURRENCY = {
  EUR: 'EUR',
};

export const OPERATION_TYPES = {
  CASH_IN: 'cash_in',
  CASH_OUT: 'cash_out',
};

export const USER_TYPES = {
  NATURAL: 'natural',
  JURIDICAL: 'juridical',
};

export const CACHE_SETTINGS = {
  // Cache expiration time in milliseconds (default: 1 hour)
  EXPIRATION: 60 * 60 * 1000,
};
