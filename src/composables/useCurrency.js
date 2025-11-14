/**
 * Composable pour la gestion de la devise (Franc Congolais)
 */

import { formatCurrency, formatCurrencyShort, parseCurrency, CURRENCY_SYMBOL, CURRENCY_NAME, CURRENCY_CODE } from '@/utils/currency';

export function useCurrency() {
  return {
    // Fonctions de formatage
    formatCurrency,
    formatCurrencyShort,
    parseCurrency,
    
    // Constantes
    CURRENCY_SYMBOL,
    CURRENCY_NAME,
    CURRENCY_CODE
  };
}


