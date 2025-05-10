import { fetchConfig } from '../api/config-api.js';
import { calculateCashInCommission } from './cash-in-service.js';
import { calculateNaturalPersonCashOutCommission } from './natural-cash-out-service.js';
import { calculateLegalPersonCashOutCommission } from './legal-cash-out-service.js';

/**
 * Calculate commissions for all operations
 * @param {Array<Object>} operations - Array of operations
 * @returns {Promise<Array<number>>} Array of calculated commissions
 */
export const calculateCommissions = async (operations) => {
  try {
    // Parallelize API calls to fetch all configs at once
    const [cashInConfig, cashOutNaturalConfig, cashOutJuridicalConfig] = await Promise.all([
      fetchConfig('cash-in'),
      fetchConfig('cash-out-natural'),
      fetchConfig('cash-out-juridical'),
    ]);

    // Calculate commissions for all operations
    return operations.map((operation) => {
      const { type, user_type } = operation;

      if (type === 'cash_in') {
        return calculateCashInCommission(operation, cashInConfig);
      }

      if (type === 'cash_out') {
        if (user_type === 'natural') {
          return calculateNaturalPersonCashOutCommission(operation, cashOutNaturalConfig);
        }

        if (user_type === 'juridical') {
          return calculateLegalPersonCashOutCommission(operation, cashOutJuridicalConfig);
        }
      }

      throw new Error(`Unsupported operation: type=${type}, user_type=${user_type}`);
    });
  } catch (error) {
    console.error('Error calculating commissions:', error);
    throw error;
  }
};
