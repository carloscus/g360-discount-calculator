/**
 * @module Utilidades de Formato
 * @description Funciones para formateo de números y monedas
 *
 * @author Carlos Cusi (CCUSI)
 * @created 2026-03-25
 * @version 1.0.0
 */

import { CURRENCY_SYMBOL, CURRENCY_CODE } from '../types';

// ========================================
// Formateo de Moneda Peruana (Soles)
// ========================================

/**
 * Formatea un número como moneda peruana (S/)
 * @param value - Valor numérico
 * @param showSymbol - Si mostrar el símbolo de moneda (por defecto true)
 * @returns String formateado (ej: "S/ 1,000.00")
 */
export function formatCurrency(value: number, showSymbol: boolean = true): string {
  const formatted = new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);

  return showSymbol ? `${CURRENCY_SYMBOL} ${formatted}` : formatted;
}

/**
 * Formatea un número como moneda peruana compacta
 * @param value - Valor numérico
 * @returns String formateado compacto (ej: "S/ 1.2K")
 */
export function formatCurrencyCompact(value: number): string {
  if (value >= 1000000) {
    return `${CURRENCY_SYMBOL} ${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${CURRENCY_SYMBOL} ${(value / 1000).toFixed(1)}K`;
  }
  return formatCurrency(value);
}

// ========================================
// Formateo de Porcentajes
// ========================================

/**
 * Formatea un porcentaje con símbolo %
 * @param value - Valor del porcentaje
 * @param decimals - Número de decimales (por defecto 2)
 * @returns String formateado (ej: "25.80%")
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formatea un porcentaje compacto (sin decimales si es entero)
 * @param value - Valor del porcentaje
 * @returns String formateado (ej: "25%" o "25.5%")
 */
export function formatPercentageCompact(value: number): string {
  if (Number.isInteger(value)) {
    return `${value}%`;
  }
  return `${value.toFixed(1)}%`;
}

// ========================================
// Formateo de Números
// ========================================

/**
 * Formatea un número con separadores de miles
 * @param value - Valor numérico
 * @param decimals - Número de decimales (por defecto 2)
 * @returns String formateado (ej: "1,000.00")
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Formatea un número entero con separadores de miles
 * @param value - Valor numérico
 * @returns String formateado (ej: "1,000")
 */
export function formatInteger(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(value));
}

// ========================================
// Parseo de Entradas
// ========================================

/**
 * Limpia un string de entrada para obtener solo números y punto decimal
 * @param input - String de entrada
 * @returns String limpio (ej: "1,000.50" -> "1000.50")
 */
export function cleanNumericInput(input: string): string {
  // Remover todo excepto números y punto decimal
  let cleaned = input.replace(/[^\d.]/g, '');
  
  // Asegurar que solo haya un punto decimal
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  return cleaned;
}

/**
 * Parsea un string a número, retornando 0 si es inválido
 * @param input - String de entrada
 * @returns Número parseado
 */
export function parseNumber(input: string): number {
  const cleaned = cleanNumericInput(input);
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Parsea un porcentaje (removiendo el símbolo % si existe)
 * @param input - String de entrada
 * @returns Número del porcentaje
 */
export function parsePercentage(input: string): number {
  const cleaned = input.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// ========================================
// Formateo de Input para Display
// ========================================

/**
 * Formatea un valor para mostrar en un input (con prefijo S/)
 * @param value - Valor numérico
 * @returns String formateado para input (ej: "S/ 1,000.00")
 */
export function formatInputCurrency(value: number): string {
  if (value === 0) return '';
  return formatCurrency(value);
}

/**
 * Formatea un porcentaje para mostrar en input
 * @param value - Valor del porcentaje
 * @returns String formateado para input (ej: "15")
 */
export function formatInputPercentage(value: number): string {
  if (value === 0) return '';
  return value.toString();
}

// ========================================
// Utilidades de Visualización
// ========================================

/**
 * Genera texto de ahorro formateado
 * @param savings - Cantidad ahorrada
 * @returns Texto descriptivo (ej: "Ahorras S/ 257.95")
 */
export function formatSavingsText(savings: number): string {
  return `Ahorras ${formatCurrency(savings)}`;
}

/**
 * Genera texto de descuento efectivo
 * @param effectiveDiscount - Porcentaje de descuento efectivo
 * @param exactValue - Valor exacto (opcional)
 * @returns Texto descriptivo
 */
export function formatEffectiveDiscountText(
  effectiveDiscount: number,
  exactValue?: number
): string {
  const mainText = `Descuento efectivo: ${formatPercentage(effectiveDiscount)}`;
  
  if (exactValue !== undefined && exactValue !== effectiveDiscount) {
    return `${mainText} (${formatPercentage(exactValue, 3)} exacto)`;
  }
  
  return mainText;
}

/**
 * Genera texto de precio final destacado
 * @param finalPrice - Precio final
 * @returns Texto formateado para display grande
 */
export function formatFinalPriceText(finalPrice: number): string {
  return formatCurrency(finalPrice);
}

// ========================================
// Constantes de Formato
// ========================================

export const LOCALE = 'es-PE';
export const DECIMAL_PLACES = 2;
export const COMPACT_THRESHOLD = 1000;