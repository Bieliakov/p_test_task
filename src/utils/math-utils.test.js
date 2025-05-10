import { 
  roundUp, 
  calculatePercentage, 
  applyMaxLimit, 
  applyMinLimit 
} from './math-utils.js';

describe('Math Utilities', () => {
  describe('roundUp', () => {
    test('should round up to 2 decimal places by default', () => {
      expect(roundUp(0.023)).toBe(0.03);
      expect(roundUp(1.045)).toBe(1.05);
      expect(roundUp(2.001)).toBe(2.01);
    });

    test('should round up to specified decimal places', () => {
      expect(roundUp(0.3333, 3)).toBe(0.334);
      expect(roundUp(2.55555, 4)).toBe(2.5556);
      expect(roundUp(1.1, 0)).toBe(2);
    });
  });

  describe('calculatePercentage', () => {
    test('should calculate correct percentage amount', () => {
      expect(calculatePercentage(100, 30)).toBe(30);
      expect(calculatePercentage(200, 0.03)).toBe(0.06);
      expect(calculatePercentage(1000, 0.3)).toBe(3);
    });
  });

  describe('applyMaxLimit', () => {
    test('should return value if it is less than or equal to max limit', () => {
      expect(applyMaxLimit(3, 5)).toBe(3);
      expect(applyMaxLimit(5, 5)).toBe(5);
    });

    test('should return max limit if value exceeds it', () => {
      expect(applyMaxLimit(10, 5)).toBe(5);
      expect(applyMaxLimit(100, 5)).toBe(5);
    });
  });

  describe('applyMinLimit', () => {
    test('should return value if it is greater than or equal to min limit', () => {
      expect(applyMinLimit(5, 3)).toBe(5);
      expect(applyMinLimit(3, 3)).toBe(3);
    });

    test('should return min limit if value is less than it', () => {
      expect(applyMinLimit(2, 3)).toBe(3);
      expect(applyMinLimit(0, 0.5)).toBe(0.5);
    });
  });
});
