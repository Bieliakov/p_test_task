import { fetchConfig } from './config-api.js';

describe('Config API', () => {
  test('fetchConfig should return default cash-in config when API is unavailable', async () => {
    // This test makes no actual API calls but tests the fallback mechanism
    const endpoint = 'cash-in';
    const result = await fetchConfig(endpoint);
    
    expect(result).toEqual({
      percents: 0.03,
      max: {
        amount: 5,
        currency: 'EUR',
      },
    });
  });
  
  test('fetchConfig should return default cash-out-natural config when API is unavailable', async () => {
    const endpoint = 'cash-out-natural';
    const result = await fetchConfig(endpoint);
    
    expect(result).toEqual({
      percents: 0.3,
      week_limit: {
        amount: 1000,
        currency: 'EUR',
      },
    });
  });
  
  test('fetchConfig should return default cash-out-juridical config when API is unavailable', async () => {
    const endpoint = 'cash-out-juridical';
    const result = await fetchConfig(endpoint);
    
    expect(result).toEqual({
      percents: 0.3,
      min: {
        amount: 0.5,
        currency: 'EUR',
      },
    });
  });
});
