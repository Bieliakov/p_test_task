/**
 * Rounds up a number to the specified number of decimal places
 * @param {number} value - The value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded value
 */
export const roundUp = (value, decimals = 2) => {
  const multiplier = 10 ** decimals;
  return Math.ceil(value * multiplier) / multiplier;
};

/**
 * Calculates the percentage of a given amount
 * @param {number} amount - The amount to calculate percentage of
 * @param {number} percentage - The percentage to apply
 * @returns {number} The calculated percentage
 */
export const calculatePercentage = (amount, percentage) => {
  return amount * (percentage / 100);
};

/**
 * Applies the maximum limit to a value
 * @param {number} value - The value to check
 * @param {number} maxLimit - The maximum limit
 * @returns {number} The value capped at the maximum limit
 */
export const applyMaxLimit = (value, maxLimit) => {
  return value > maxLimit ? maxLimit : value;
};

/**
 * Applies the minimum limit to a value
 * @param {number} value - The value to check
 * @param {number} minLimit - The minimum limit
 * @returns {number} The value or the minimum limit, whichever is greater
 */
export const applyMinLimit = (value, minLimit) => {
  return value < minLimit ? minLimit : value;
};
