import { calculatePercentage, applyMinLimit, roundUp } from '../utils/math-utils.js';

/**
 * Calculate commission for legal person cash out operations
 * @param {Object} operation - The operation data
 * @param {Object} config - Configuration for legal person cash out
 * @returns {number} Calculated commission
 */
export const calculateLegalPersonCashOutCommission = (operation, config) => {
  const { amount } = operation.operation;
  const { percents, min } = config;
  
  // Calculate commission as percentage of the amount
  const commission = calculatePercentage(amount, percents);
  
  // Apply minimum limit if defined
  const limitedCommission = min ? applyMinLimit(commission, min.amount) : commission;
  
  // Round up to the smallest currency unit (cents)
  return roundUp(limitedCommission);
};
