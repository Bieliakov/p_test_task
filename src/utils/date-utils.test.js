import { getWeekStartDate, getWeekKey } from './date-utils.js';

describe('Date Utilities', () => {
  describe('getWeekStartDate', () => {
    test('should return same date if it is Monday', () => {
      expect(getWeekStartDate('2023-05-01')).toBe('2023-05-01'); // Monday
    });

    test('should return previous Monday for other weekdays', () => {
      expect(getWeekStartDate('2023-05-02')).toBe('2023-05-01'); // Tuesday -> Monday
      expect(getWeekStartDate('2023-05-03')).toBe('2023-05-01'); // Wednesday -> Monday
      expect(getWeekStartDate('2023-05-04')).toBe('2023-05-01'); // Thursday -> Monday
      expect(getWeekStartDate('2023-05-05')).toBe('2023-05-01'); // Friday -> Monday
      expect(getWeekStartDate('2023-05-06')).toBe('2023-05-01'); // Saturday -> Monday
      expect(getWeekStartDate('2023-05-07')).toBe('2023-05-01'); // Sunday -> Monday
    });

    test('should handle month boundaries', () => {
      expect(getWeekStartDate('2023-06-01')).toBe('2023-05-29'); // Thursday in June -> Monday in May
    });

    test('should handle year boundaries', () => {
      expect(getWeekStartDate('2023-01-01')).toBe('2022-12-26'); // Sunday in Jan -> Monday in Dec
    });
  });

  describe('getWeekKey', () => {
    test('should generate correct week key', () => {
      expect(getWeekKey('2023-05-04', 1)).toBe('1-2023-05-01');
      expect(getWeekKey('2023-05-07', 2)).toBe('2-2023-05-01');
    });

    test('should generate different keys for the same date but different users', () => {
      const date = '2023-05-04';
      expect(getWeekKey(date, 1)).not.toBe(getWeekKey(date, 2));
    });

    test('should generate same key for different dates in the same week and same user', () => {
      const userId = 1;
      expect(getWeekKey('2023-05-01', userId)).toBe(getWeekKey('2023-05-07', userId));
    });
  });
});
