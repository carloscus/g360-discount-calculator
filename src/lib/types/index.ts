/**
 * @module Tipos de Calculadora de Descuentos G360
 * @description Definiciones de tipos para la aplicación
 *
 * @author Carlos Cusi (CCUSI)
 * @created 2026-03-25
 * @version 1.0.0
 */

// ========================================
// Tipos para Descuentos
// ========================================

export interface Discount {
  id: number;
  percentage: number;
  isActive: boolean;
}

export interface DiscountState {
  originalPrice: number;
  discounts: Discount[];
}

// ========================================
// Tipos para Resultados
// ========================================

export interface DiscountResult {
  originalPrice: number;
  effectiveDiscount: number;
  exactEffectiveDiscount: number;
  finalPrice: number;
  savings: number;
}

// ========================================
// Tipos para Pricing (Costo → Precio)
// ========================================

export type PricingMode = 'margin' | 'markup' | 'cost-price';

export interface PricingState {
  mode: PricingMode;
  cost: number;
  margin: number;
  markup: number;
  price: number;
  includeIVA: boolean;
}

export interface PricingResult {
  sellingPrice: number;
  grossMargin: number;
  markup: number;
  ivaAmount: number;
  finalPrice: number;
  grossProfit: number;
}

// ========================================
// Tipos para Tema
// ========================================

export type Theme = 'light' | 'dark';

export interface ThemeState {
  current: Theme;
  isDark: boolean;
}

// ========================================
// Tipos para Toast/Notificaciones
// ========================================

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// ========================================
// Tipos para Navegación
// ========================================

export type Page = 'home' | 'pricing';

export interface NavigationState {
  currentPage: Page;
}

// ========================================
// Tipos para Exportar/Compartir
// ========================================

export interface ShareData {
  title: string;
  text: string;
  url?: string;
}

// ========================================
// Tipos para Historial
// ========================================

export interface HistoryItem {
  id?: string;
  originalPrice: number;
  discounts: Discount[];
  discountLabels?: string;
  results: DiscountResult;
  clientCode?: string;
  clientName?: string;
  observation?: string;
  targetPrice?: number | null;
  requiredDiscount?: number | null;
  hasTargetPrice?: boolean;
  timestamp: string;
}

// ========================================
// Constantes
// ========================================

export const MAX_DISCOUNTS = 8;
export const IVA_RATE = 0.18; // 18% IVA (IGV en Perú)
export const CURRENCY_SYMBOL = 'S/';
export const CURRENCY_CODE = 'PEN';

// ========================================
// Utilidades de Formato
// ========================================

export interface FormatOptions {
  currency?: boolean;
  decimals?: number;
  locale?: string;
}