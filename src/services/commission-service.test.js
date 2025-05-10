import { calculateCommissions } from './commission-service.js';
import { resetWeeklyWithdrawals } from './natural-cash-out-service.js';

describe('Commission Service', () => {
  beforeEach(() => {
    resetWeeklyWithdrawals();
  });
  test('should calculate commissions for example operations', async () => {
    // This test uses the same data as the example in the requirements
    const operations = [
      { date: '2016-01-05', user_id: 1, user_type: 'natural', type: 'cash_in', operation: { amount: 200.00, currency: 'EUR' } },
      { date: '2016-01-06', user_id: 2, user_type: 'juridical', type: 'cash_out', operation: { amount: 300.00, currency: 'EUR' } },
      { date: '2016-01-06', user_id: 1, user_type: 'natural', type: 'cash_out', operation: { amount: 30000, currency: 'EUR' } },
      { date: '2016-01-07', user_id: 1, user_type: 'natural', type: 'cash_out', operation: { amount: 1000.00, currency: 'EUR' } },
      { date: '2016-01-07', user_id: 1, user_type: 'natural', type: 'cash_out', operation: { amount: 100.00, currency: 'EUR' } },
      { date: '2016-01-10', user_id: 1, user_type: 'natural', type: 'cash_out', operation: { amount: 100.00, currency: 'EUR' } },
      { date: '2016-01-10', user_id: 2, user_type: 'juridical', type: 'cash_in', operation: { amount: 1000000.00, currency: 'EUR' } },
      { date: '2016-01-10', user_id: 3, user_type: 'natural', type: 'cash_out', operation: { amount: 1000.00, currency: 'EUR' } },
      { date: '2016-02-15', user_id: 1, user_type: 'natural', type: 'cash_out', operation: { amount: 300.00, currency: 'EUR' } }
    ];

    const expectedCommissions = [0.06, 0.90, 87.00, 3.00, 0.30, 0.30, 5.00, 0.00, 0.00];
    
    const result = await calculateCommissions(operations);
    
    // Verify the results match the expected output
    expect(result).toEqual(expectedCommissions);
  });
  
  test('should handle empty operations array', async () => {
    const result = await calculateCommissions([]);
    expect(result).toEqual([]);
  });
});
