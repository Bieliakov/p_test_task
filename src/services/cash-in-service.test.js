import { calculateCashInCommission } from './cash-in-service.js';
import { CURRENCY } from '../constants.js';

describe('Cash In Service', () => {
  const mockConfig = {
    percents: 0.03,
    max: {
      amount: 5,
      currency: CURRENCY.EUR,
    },
  };

  test('should calculate commission correctly for small amounts', () => {
    const operation = {
      operation: { amount: 200, currency: CURRENCY.EUR },
    };

    // 200 * 0.03% = 0.06
    expect(calculateCashInCommission(operation, mockConfig)).toBe(0.06);
  });

  test('should apply maximum limit for large amounts', () => {
    const operation = {
      operation: { amount: 20000, currency: CURRENCY.EUR },
    };

    // 20000 * 0.03% = 6, but max is 5
    expect(calculateCashInCommission(operation, mockConfig)).toBe(5);
  });

  test('should round up to cents', () => {
    const operation = {
      operation: { amount: 50, currency: CURRENCY.EUR },
    };

    // 50 * 0.03% = 0.015, should round up to 0.02
    expect(calculateCashInCommission(operation, mockConfig)).toBe(0.02);
  });
});
