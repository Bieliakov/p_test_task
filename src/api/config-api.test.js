import { fetchConfig } from './config-api.js';
import { API_ENDPOINTS, DEFAULT_COMMISSION_CONFIG, CURRENCY } from '../constants.js';

describe('Config API', () => {
  test('fetchConfig should return default cash-in config when API is unavailable', async () => { // This test makes no actual API calls but tests the fallback mechanism
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
});
