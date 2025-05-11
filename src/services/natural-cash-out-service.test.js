import { calculateNaturalPersonCashOutCommission, resetWeeklyWithdrawals } from './natural-cash-out-service.js';
import { CURRENCY } from '../constants.js';

describe('Natural Person Cash Out Service', () => {
  const mockConfig = {
    percents: 0.3,
    week_limit: {
      amount: 1000,
      currency: CURRENCY.EUR,
    },
  };

  beforeEach(() => {
    resetWeeklyWithdrawals();
  });

  test('should not charge commission for amounts within weekly free limit', () => {
    const operation = {
      date: '2023-05-01',
      user_id: 1,
      operation: { amount: 1000, currency: CURRENCY.EUR },
    };

    expect(calculateNaturalPersonCashOutCommission(operation, mockConfig)).toBe(0);
  });

  test('should charge commission only on amount exceeding weekly limit', () => {
    const operation = {
      date: '2023-05-01',
      user_id: 1,
      operation: { amount: 1200, currency: CURRENCY.EUR },
    };

    // 200 EUR exceeds the limit, so 200 * 0.3% = 0.6
    expect(calculateNaturalPersonCashOutCommission(operation, mockConfig)).toBe(0.6);
  });

  test('should track withdrawals across multiple operations in same week', () => {
    const op1 = {
      date: '2023-05-01',
      user_id: 1,
      operation: { amount: 800, currency: CURRENCY.EUR },
    };

    const op2 = {
      date: '2023-05-03',
      user_id: 1,
      operation: { amount: 300, currency: CURRENCY.EUR },
    };

    // First withdrawal under limit
    expect(calculateNaturalPersonCashOutCommission(op1, mockConfig)).toBe(0);

    // Second withdrawal: 100 EUR exceeds the limit, so 100 * 0.3% = 0.3
    expect(calculateNaturalPersonCashOutCommission(op2, mockConfig)).toBe(0.3);
  });

  test('should keep track of different weeks separately', () => {
    const op1 = {
      date: '2023-05-01',
      user_id: 1,
      operation: { amount: 1000, currency: CURRENCY.EUR },
    };

    const op2 = {
      date: '2023-05-08', // Next week (Monday)
      user_id: 1,
      operation: { amount: 1000, currency: CURRENCY.EUR },
    };

    // First withdrawal under limit
    expect(calculateNaturalPersonCashOutCommission(op1, mockConfig)).toBe(0);

    // Second withdrawal in different week, still under limit
    expect(calculateNaturalPersonCashOutCommission(op2, mockConfig)).toBe(0);
  });

  test('should keep track of different users separately', () => {
    const op1 = {
      date: '2023-05-01',
      user_id: 1,
      operation: { amount: 1000, currency: CURRENCY.EUR },
    };

    const op2 = {
      date: '2023-05-01',
      user_id: 2,
      operation: { amount: 1000, currency: CURRENCY.EUR },
    };

    // First user's withdrawal under limit
    expect(calculateNaturalPersonCashOutCommission(op1, mockConfig)).toBe(0);

    // Second user's withdrawal, also under limit
    expect(calculateNaturalPersonCashOutCommission(op2, mockConfig)).toBe(0);
  });
});
