import { formatOutput } from './output-formatter.js';

describe('Output Formatter', () => {
  test('should format commission amounts correctly', () => {
    const commissions = [0.06, 0.9, 87, 3, 0.3, 0.3, 5, 0];
    const expected = '0.06\n0.90\n87.00\n3.00\n0.30\n0.30\n5.00\n0.00';
    
    expect(formatOutput(commissions)).toBe(expected);
  });

  test('should handle empty array', () => {
    expect(formatOutput([])).toBe('');
  });

  test('should format decimals correctly', () => {
    const commissions = [0.023, 0.1, 1];
    const expected = '0.02\n0.10\n1.00';
    
    expect(formatOutput(commissions)).toBe(expected);
  });
});
