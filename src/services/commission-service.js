import { fetchConfig } from '../api/config-api.js';
import { calculateCashInCommission } from './cash-in-service.js';
import { calculateNaturalPersonCashOutCommission } from './natural-cash-out-service.js';
import { calculateLegalPersonCashOutCommission } from './legal-cash-out-service.js';
import { API_ENDPOINTS, OPERATION_TYPES, USER_TYPES } from '../constants.js';

/**
 * Calculate commissions for all operations
 * @param {Array<Object>} operations - Array of operations
 * @returns {Promise<Array<number>>} Array of calculated commissions
 */
export const calculateCommissions = async (operations) => {
  try {
    // Parallelize API calls to fetch all configs at once
    const [cashInConfig, cashOutNaturalConfig, cashOutJuridicalConfig] = await Promise.all([
      fetchConfig(API_ENDPOINTS.CASH_IN),
      fetchConfig(API_ENDPOINTS.CASH_OUT_NATURAL),
      fetchConfig(API_ENDPOINTS.CASH_OUT_JURIDICAL),
    ]);

    // Calculate commissions for all operations
    return operations.map((operation) => {
      const { type, user_type } = operation;

      if (type === OPERATION_TYPES.CASH_IN) {
        return calculateCashInCommission(operation, cashInConfig);
      }

      if (type === OPERATION_TYPES.CASH_OUT) {
        if (user_type === USER_TYPES.NATURAL) {
          return calculateNaturalPersonCashOutCommission(operation, cashOutNaturalConfig);
        }

        if (user_type === USER_TYPES.JURIDICAL) {
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
