import { calculateLegalPersonCashOutCommission } from './legal-cash-out-service.js';
import { CURRENCY } from '../constants.js';

describe('Legal Person Cash Out Service', () => {
  const mockConfig = {
    percents: 0.3,
    min: {
      amount: 0.5,
      currency: CURRENCY.EUR,
    },
  };

  test('should calculate commission correctly for large amounts', () => {
    const operation = {
      operation: { amount: 300, currency: CURRENCY.EUR },
    };

    // 300 * 0.3% = 0.9
    expect(calculateLegalPersonCashOutCommission(operation, mockConfig)).toBe(0.9);
  });

  test('should apply minimum amount for small transactions', () => {
    const operation = {
      operation: { amount: 100, currency: CURRENCY.EUR },
    };

    // 100 * 0.3% = 0.3, but min is 0.5
    expect(calculateLegalPersonCashOutCommission(operation, mockConfig)).toBe(0.5);
  });

  test('should round up to cents', () => {
    const operation = {
      operation: { amount: 333.33, currency: CURRENCY.EUR },
    };

    // 333.33 * 0.3% = 0.999999, should round up to 1.00
    expect(calculateLegalPersonCashOutCommission(operation, mockConfig)).toBe(1);
  });
});
