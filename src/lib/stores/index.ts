/**
 * @module Stores de la Aplicación
 * @description Exportación centralizada de todos los stores
 *
 * @author Carlos Cusi (CCUSI)
 * @created 2026-03-25
 * @version 1.0.0
 */

// ========================================
// Exportar Store de Tema
// ========================================
export {
  themeStore,
  isDarkMode,
  isLightMode,
  toggleTheme,
  setDarkTheme,
  setLightTheme,
  initTheme
} from './theme';

// ========================================
// Exportar Store de Descuentos
// ========================================
export {
  discountStore,
  discountResults,
  hasActiveDiscounts,
  activeDiscountCount,
  canAddMoreDiscounts,
  setOriginalPrice,
  addDiscount,
  updateDiscount,
  removeDiscount,
  toggleDiscount,
  clearAllDiscounts,
  clearDiscounts
} from './discounts';

// ========================================
// Exportar Store de Pricing
// ========================================
export {
  pricingStore,
  pricingResults,
  hasPricingData
} from './pricing';