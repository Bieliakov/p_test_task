import { calculatePercentage, applyMaxLimit, roundUp } from '../utils/math-utils.js';

/**
 * Calculate commission for cash in operations
 * @param {Object} operation - The operation data
 * @param {Object} config - Configuration for cash in commission
 * @returns {number} Calculated commission
 */
export const calculateCashInCommission = (operation, config) => {
  const { amount } = operation.operation;
  const { percents, max } = config;

  // Calculate commission as percentage of the amount
  const commission = calculatePercentage(amount, percents);

  // Apply max limit if defined
  const limitedCommission = max ? applyMaxLimit(commission, max.amount) : commission;

  // Round up to the smallest currency unit (cents)
  return roundUp(limitedCommission);
};
