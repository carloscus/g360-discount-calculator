/**
 * @module Utilidades de la Aplicación
 * @description Exportación centralizada de todas las utilidades
 *
 * @author Carlos Cusi (CCUSI)
 * @created 2026-03-25
 * @version 1.0.0
 */

// ========================================
// Exportar Utilidades de Cálculo
// ========================================
export {
  calculateConsecutiveDiscounts,
  calculateSingleDiscount,
  calculatePriceFromMargin,
  calculatePriceFromMarkup,
  calculateMargin,
  calculateMarkup,
  addIVA,
  calculateIVAAmount,
  calculatePricingResults,
  isValidPercentage,
  roundToDecimals,
  calculatePercentage
} from './calculations';

// ========================================
// Exportar Utilidades de Formato
// ========================================
export {
  formatCurrency,
  formatCurrencyCompact,
  formatPercentage,
  formatPercentageCompact,
  formatNumber,
  formatInteger,
  cleanNumericInput,
  parseNumber,
  parsePercentage,
  formatInputCurrency,
  formatInputPercentage,
  formatSavingsText,
  formatEffectiveDiscountText,
  formatFinalPriceText
} from './formatting';

// ========================================
// Exportar Utilidades de Compartir
// ========================================
export {
  generateDiscountText,
  generatePricingText,
  copyToClipboard,
  copyDiscountResults,
  copyPricingResults,
  generateWhatsAppURL,
  shareDiscountViaWhatsApp,
  sharePricingViaWhatsApp,
  shareNative,
  shareDiscountNative,
  sharePricingNative,
  saveToHistory,
  getHistory
} from './sharing';