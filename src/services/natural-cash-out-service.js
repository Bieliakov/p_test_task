import { calculatePercentage, roundUp } from '../utils/math-utils.js';
import { getWeekKey } from '../utils/date-utils.js';

// Maintain a cache of weekly withdrawals
const weeklyWithdrawals = new Map();

/**
 * Calculate commission for natural person cash out operations
 * @param {Object} operation - The operation data
 * @param {Object} config - Configuration for natural person cash out
 * @returns {number} Calculated commission
 */
export const calculateNaturalPersonCashOutCommission = (operation, config) => {
  const { date, user_id } = operation;
  const { amount } = operation.operation;
  const { percents, week_limit } = config;
  
  const weekKey = getWeekKey(date, user_id);
  const weeklyTotal = weeklyWithdrawals.get(weekKey) || 0;
  
  // Update weekly total
  weeklyWithdrawals.set(weekKey, weeklyTotal + amount);
  
  // Calculate amount exceeding the free limit
  const freeLimit = week_limit.amount;
  const remainingFreeAmount = Math.max(0, freeLimit - weeklyTotal);
  const chargeableAmount = Math.max(0, amount - remainingFreeAmount);
  
  // Calculate commission as percentage of the chargeable amount
  const commission = calculatePercentage(chargeableAmount, percents);
  
  // Round up to the smallest currency unit (cents)
  return roundUp(commission);
};

/**
 * Reset the weekly withdrawals cache (for testing purposes)
 */
export const resetWeeklyWithdrawals = () => {
  weeklyWithdrawals.clear();
};
