/**
 * Gets the ISO week start date (Monday) for a given date
 * @param {string} dateStr - Date string in format YYYY-MM-DD
 * @returns {string} Start date of the week in format YYYY-MM-DD
 */
export const getWeekStartDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDay() || 7; // Convert Sunday (0) to 7
  
  // If it's Monday, return the date as is, otherwise go back to previous Monday
  if (day !== 1) {
    date.setDate(date.getDate() - (day - 1));
  }
  
  return date.toISOString().split('T')[0];
};

/**
 * Generates a unique week key from a date
 * @param {string} dateStr - Date string in format YYYY-MM-DD
 * @param {number} userId - User ID
 * @returns {string} A unique key for the week and user
 */
export const getWeekKey = (dateStr, userId) => {
  const weekStart = getWeekStartDate(dateStr);
  return `${userId}-${weekStart}`;
};
