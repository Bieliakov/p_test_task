/**
 * Formats commission outputs for display
 * @param {Array<number>} commissions - Array of calculated commission amounts
 * @returns {string} Formatted output string with one fee per line
 */
export const formatOutput = (commissions) => commissions.map((amount) => amount.toFixed(2)).join('\n');
