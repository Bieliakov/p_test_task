import { calculateCommissions } from './commission-service.js';
import { resetWeeklyWithdrawals } from './natural-cash-out-service.js';
import { OPERATION_TYPES, USER_TYPES, CURRENCY } from '../constants.js';

const testOperations = [
  {
    date: '2016-01-05',
    user_id: 1,
    user_type: USER_TYPES.NATURAL,
    type: OPERATION_TYPES.CASH_IN,
    operation: { amount: 200.00, currency: CURRENCY.EUR },
  },
  {
    date: '2016-01-06',
    user_id: 2,
    user_type: USER_TYPES.JURIDICAL,
    type: OPERATION_TYPES.CASH_OUT,
    operation: { amount: 300.00, currency: CURRENCY.EUR },
  },
  {
    date: '2016-01-06',
    user_id: 1,
    user_type: USER_TYPES.NATURAL,
    type: OPERATION_TYPES.CASH_OUT,
    operation: { amount: 30000, currency: CURRENCY.EUR },
  },
  {
    date: '2016-01-07',
    user_id: 1,
    user_type: USER_TYPES.NATURAL,
    type: OPERATION_TYPES.CASH_OUT,
    operation: { amount: 1000.00, currency: CURRENCY.EUR },
  },
  {
    date: '2016-01-07',
    user_id: 1,
    user_type: USER_TYPES.NATURAL,
    type: OPERATION_TYPES.CASH_OUT,
    operation: { amount: 100.00, currency: CURRENCY.EUR },
  },
  {
    date: '2016-01-10',
    user_id: 1,
    user_type: USER_TYPES.NATURAL,
    type: OPERATION_TYPES.CASH_OUT,
    operation: { amount: 100.00, currency: CURRENCY.EUR },
  },
  {
    date: '2016-01-10',
    user_id: 2,
    user_type: USER_TYPES.JURIDICAL,
    type: OPERATION_TYPES.CASH_IN,
    operation: { amount: 1000000.00, currency: CURRENCY.EUR },
  },
  {
    date: '2016-01-10',
    user_id: 3,
    user_type: USER_TYPES.NATURAL,
    type: OPERATION_TYPES.CASH_OUT,
    operation: { amount: 1000.00, currency: CURRENCY.EUR },
  },
  {
    date: '2016-02-15',
    user_id: 1,
    user_type: USER_TYPES.NATURAL,
    type: OPERATION_TYPES.CASH_OUT,
    operation: { amount: 300.00, currency: CURRENCY.EUR },
  },
];

describe('Commission Service', () => {
  beforeEach(() => {
    resetWeeklyWithdrawals();
  });

  test('should calculate commissions for example operations', async () => {
    const expectedCommissions = [0.06, 0.90, 87.00, 3.00, 0.30, 0.30, 5.00, 0.00, 0.00];

    const result = await calculateCommissions(testOperations);

    expect(result).toEqual(expectedCommissions);
  });

  test('should handle empty operations array', async () => {
    const result = await calculateCommissions([]);
    expect(result).toEqual([]);
  });
});
