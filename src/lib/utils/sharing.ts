/**
 * @module Utilidades de Exportación y Compartir
 * @description Funciones para exportar y compartir resultados
 *
 * @author Carlos Cusi (CCUSI)
 * @created 2026-03-25
 * @version 1.0.0
 */

import type { Discount, DiscountResult, PricingResult } from '../types';
import { CURRENCY_SYMBOL } from '../types';
import { formatCurrency, formatPercentage } from './formatting';
import { browser } from '$app/environment';

// ========================================
// Exportar a Texto (para copiar)
// ========================================

/**
 * Genera texto formateado de resultados de descuentos
 */
export function generateDiscountText(
  originalPrice: number,
  discounts: Discount[],
  results: DiscountResult
): string {
  const activeDiscounts = discounts.filter(d => d.isActive && d.percentage > 0);
  
  let text = `📊 DESCUENTO REAL - Calculadora de Descuentos\n`;
  text += `═══════════════════════════════════════\n\n`;
  
  text += `💰 PRECIO ORIGINAL: ${formatCurrency(originalPrice)}\n\n`;
  
  if (activeDiscounts.length > 0) {
    text += `📋 DESCUENTOS APLICADOS:\n`;
    activeDiscounts.forEach((d, i) => {
      text += `   ${i + 1}. -${formatPercentage(d.percentage)}\n`;
    });
    text += `\n`;
  }
  
  text += `📈 RESULTADOS:\n`;
  text += `   • Descuento efectivo: ${formatPercentage(results.effectiveDiscount)}\n`;
  if (results.exactEffectiveDiscount !== results.effectiveDiscount) {
    text += `     (${formatPercentage(results.exactEffectiveDiscount, 3)} exacto)\n`;
  }
  text += `   • Precio final: ${formatCurrency(results.finalPrice)}\n`;
  text += `   • Ahorro: ${formatCurrency(results.savings)}\n\n`;
  
  text += `───────────────────────────────────────\n`;
  text += `Powered by G360 Ecosystem | CCUSI 2026`;
  
  return text;
}

/**
 * Genera texto formateado de resultados de pricing
 */
export function generatePricingText(
  cost: number,
  results: PricingResult,
  includeIVA: boolean
): string {
  let text = `📊 DESCUENTO REAL - Cálculo de Precio\n`;
  text += `═══════════════════════════════════════\n\n`;
  
  text += `💰 COSTO: ${formatCurrency(cost)}\n\n`;
  
  text += `📈 RESULTADOS:\n`;
  text += `   • Precio de venta: ${formatCurrency(results.sellingPrice)}\n`;
  text += `   • Margen bruto: ${formatPercentage(results.grossMargin)}\n`;
  text += `   • Markup: ${formatPercentage(results.markup)}\n`;
  
  if (includeIVA) {
    text += `   • IGV (18%): ${formatCurrency(results.ivaAmount)}\n`;
    text += `   • Precio final: ${formatCurrency(results.finalPrice)}\n`;
  }
  
  text += `\n───────────────────────────────────────\n`;
  text += `Powered by G360 Ecosystem | CCUSI 2026`;
  
  return text;
}

// ========================================
// Copiar al Portapapeles
// ========================================

/**
 * Copia texto al portapapeles
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!browser) return false;
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback para navegadores antiguos
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const result = document.execCommand('copy');
    document.body.removeChild(textArea);
    return result;
  } catch (e) {
    console.error('Error copying to clipboard:', e);
    return false;
  }
}

/**
 * Copia resultados de descuentos al portapapeles
 */
export async function copyDiscountResults(
  originalPrice: number,
  discounts: Discount[],
  results: DiscountResult
): Promise<boolean> {
  const text = generateDiscountText(originalPrice, discounts, results);
  return copyToClipboard(text);
}

/**
 * Copia resultados de pricing al portapapeles
 */
export async function copyPricingResults(
  cost: number,
  results: PricingResult,
  includeIVA: boolean
): Promise<boolean> {
  const text = generatePricingText(cost, results, includeIVA);
  return copyToClipboard(text);
}

// ========================================
// Compartir por WhatsApp
// ========================================

/**
 * Genera URL de WhatsApp con mensaje
 */
export function generateWhatsAppURL(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/?text=${encodedMessage}`;
}

/**
 * Comparte resultados de descuentos por WhatsApp
 */
export function shareDiscountViaWhatsApp(
  originalPrice: number,
  discounts: Discount[],
  results: DiscountResult,
  observation?: string
): void {
  if (!browser) return;
  
  const activeDiscounts = discounts.filter(d => d.isActive && d.percentage > 0);
  const discountLabels = activeDiscounts.map(d => `${d.percentage}%`).join(' - ');
  
  let text = `📊 *DESCUENTO REAL*\n`;
  text += `─────────────────────\n`;
  text += `💰 Precio: ${CURRENCY_SYMBOL} ${formatCurrency(originalPrice)}\n`;
  text += `📉 Descuentos: ${discountLabels || 'Sin descuento'}\n`;
  text += `💵 *Final: ${CURRENCY_SYMBOL} ${formatCurrency(results.finalPrice)}*\n`;
  
  if (observation) {
    text += `📝 *Obs:* ${observation}\n`;
  }
  
  text += `─────────────────────\n`;
  text += `_G360 Calculator_`;
  
  const url = generateWhatsAppURL(text);
  window.open(url, '_blank');
}

/**
 * Comparte resultados de pricing por WhatsApp
 */
export function sharePricingViaWhatsApp(
  cost: number,
  results: PricingResult,
  includeIVA: boolean
): void {
  if (!browser) return;
  
  const text = generatePricingText(cost, results, includeIVA);
  const url = generateWhatsAppURL(text);
  window.open(url, '_blank');
}

// ========================================
// Web Share API (para dispositivos compatibles)
// ========================================

/**
 * Comparte usando la Web Share API
 */
export async function shareNative(title: string, text: string, url?: string): Promise<boolean> {
  if (!browser) return false;
  
  try {
    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url: url || window.location.href
      });
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error sharing:', e);
    return false;
  }
}

/**
 * Comparte resultados de descuentos nativamente
 */
export async function shareDiscountNative(
  originalPrice: number,
  discounts: Discount[],
  results: DiscountResult
): Promise<boolean> {
  const text = generateDiscountText(originalPrice, discounts, results);
  return shareNative('Descuento Real - Resultados', text);
}

/**
 * Comparte resultados de pricing nativamente
 */
export async function sharePricingNative(
  cost: number,
  results: PricingResult,
  includeIVA: boolean
): Promise<boolean> {
  const text = generatePricingText(cost, results, includeIVA);
  return shareNative('Descuento Real - Cálculo de Precio', text);
}

// ========================================
// Guardar en localStorage
// ========================================

/**
 * Guarda resultado en historial
 */
export function saveToHistory(type: 'discount' | 'pricing', data: any): void {
  if (!browser) return;
  
  try {
    const historyKey = `g360-history-${type}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    history.unshift({
      ...data,
      timestamp: new Date().toISOString(),
      id: Date.now()
    });
    
    // Mantener solo los últimos 50 registros
    const trimmedHistory = history.slice(0, 50);
    localStorage.setItem(historyKey, JSON.stringify(trimmedHistory));
  } catch (e) {
    console.error('Error saving to history:', e);
  }
}

/**
 * Obtiene historial
 */
export function getHistory(type: 'discount' | 'pricing'): any[] {
  if (!browser) return [];
  
  try {
    const historyKey = `g360-history-${type}`;
    return JSON.parse(localStorage.getItem(historyKey) || '[]');
  } catch (e) {
    console.error('Error getting history:', e);
    return [];
  }
}