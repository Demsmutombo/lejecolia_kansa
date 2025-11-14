/**
 * Utilitaires pour le formatage de la devise (Franc Congolais)
 */

/**
 * Formate un montant en Franc Congolais
 * @param {number} amount - Le montant à formater
 * @param {boolean} showSymbol - Afficher le symbole FC (par défaut: true)
 * @param {number} decimals - Nombre de décimales (par défaut: 2)
 * @returns {string} - Le montant formaté
 * 
 * @example
 * formatCurrency(1500.50) // "1 500,50 FC"
 * formatCurrency(1500.50, false) // "1 500,50"
 * formatCurrency(1500) // "1 500,00 FC"
 */
export function formatCurrency(amount, showSymbol = true, decimals = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '0,00 FC' : '0,00';
  }

  const num = parseFloat(amount);
  
  // Formater avec espaces comme séparateurs de milliers et virgule pour les décimales
  const formatted = num.toFixed(decimals)
    .replace('.', ',') // Virgule pour les décimales
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Espace pour les milliers

  return showSymbol ? `${formatted} FC` : formatted;
}

/**
 * Formate un montant en Franc Congolais (version courte sans décimales)
 * @param {number} amount - Le montant à formater
 * @returns {string} - Le montant formaté
 * 
 * @example
 * formatCurrencyShort(1500.50) // "1 501 FC"
 */
export function formatCurrencyShort(amount) {
  return formatCurrency(amount, true, 0);
}

/**
 * Parse une chaîne formatée en nombre
 * @param {string} formattedAmount - Le montant formaté
 * @returns {number} - Le montant en nombre
 * 
 * @example
 * parseCurrency("1 500,50 FC") // 1500.5
 * parseCurrency("1 500,50") // 1500.5
 */
export function parseCurrency(formattedAmount) {
  if (!formattedAmount) return 0;
  
  const cleaned = formattedAmount
    .replace(/FC/gi, '') // Enlever le symbole
    .replace(/\s/g, '') // Enlever les espaces
    .replace(',', '.') // Virgule vers point
    .trim();
  
  return parseFloat(cleaned) || 0;
}

/**
 * Symbole de la devise
 */
export const CURRENCY_SYMBOL = 'FC';
export const CURRENCY_NAME = 'Franc Congolais';
export const CURRENCY_CODE = 'CDF';


