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

// ========================================
// Exportar Historial Completo TXT
// ========================================

interface HistoryItem {
  originalPrice: number;
  discountLabels?: string;
  results?: DiscountResult;
  clientCode?: string;
  clientName?: string;
  observation?: string;
  targetPrice?: number | null;
  hasTargetPrice?: boolean;
  timestamp: string;
  fromWSP?: boolean;
}

interface PricingHistoryItem {
  cost: number;
  sellingPrice: number;
  results: PricingResult;
  clientCode?: string;
  clientName?: string;
  observation?: string;
  mode?: string;
  inputModeIGV?: boolean;
  timestamp: string;
  fromWSP?: boolean;
}

/**
 * Genera texto de historial de descuentos formateado
 */
export function generateDiscountHistoryText(history: HistoryItem[]): string {
  if (history.length === 0) {
    return '📋 G360 - Historial de Descuentos\n\nNo hay registros guardados.';
  }

  const now = new Date();
  const exportDate = now.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let text = `📋 G360 - Historial de Descuentos\n`;
  text += `Exportado: ${exportDate}\n`;
  text += `══════════════════════════════════════\n\n`;

  history.forEach((item, index) => {
    const date = new Date(item.timestamp);
    const dateStr = date.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const code = item.clientCode ? `${item.clientCode} | ` : '';
    const client = item.clientName || '';
    const finalPrice = item.targetPrice 
      ? item.targetPrice.toFixed(2)
      : item.results?.finalPrice?.toFixed(2) || '0.00';
    const original = item.originalPrice.toFixed(2);
    const obs = item.observation ? `\n📝 ${item.observation}` : '';

    text += `[${dateStr}] ${code}${client}\n`;
    text += `💰 ${original} → ${finalPrice}\n${obs}\n`;
    
    if (index < history.length - 1) {
      text += `────────────────────────────────\n\n`;
    }
  });

  text += `\n────────────────────────────────\n`;
  text += `Total: ${history.length} registros\n`;
  text += `G360 | g360-discount-calculator`;

  return text;
}

/**
 * Genera texto de historial de pricing formateado
 */
export function generatePricingHistoryText(history: PricingHistoryItem[]): string {
  if (history.length === 0) {
    return '📋 G360 - Historial de Pricing\n\nNo hay registros guardados.';
  }

  const now = new Date();
  const exportDate = now.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let text = `📋 G360 - Historial de Pricing\n`;
  text += `Exportado: ${exportDate}\n`;
  text += `══════════════════════════════════════\n\n`;

  history.forEach((item, index) => {
    const date = new Date(item.timestamp);
    const dateStr = date.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const code = item.clientCode ? `${item.clientCode} | ` : '';
    const client = item.clientName || '';
    const cost = item.cost.toFixed(2);
    const price = item.results.sellingPrice.toFixed(2);
    const obs = item.observation ? `\n📝 ${item.observation}` : '';

    text += `[${dateStr}] ${code}${client}\n`;
    text += `💰 Costo: ${cost} → 💵 Venta: ${price}\n${obs}\n`;
    
    if (index < history.length - 1) {
      text += `────────────────────────────────\n\n`;
    }
  });

  text += `\n────────────────────────────────\n`;
  text += `Total: ${history.length} registros\n`;
  text += `G360 | g360-discount-calculator`;

  return text;
}

/**
 * Comparte historial de descuentos por WhatsApp
 */
export function shareDiscountHistory(history: HistoryItem[]): void {
  const text = generateDiscountHistoryText(history);
  const url = generateWhatsAppURL(text);
  window.open(url, '_blank');
}

/**
 * Comparte historial de pricing por WhatsApp
 */
export function sharePricingHistory(history: PricingHistoryItem[]): void {
  const text = generatePricingHistoryText(history);
  const url = generateWhatsAppURL(text);
  window.open(url, '_blank');
}

/**
 * Copia historial al portapapeles
 */
export async function copyHistoryToClipboard(history: HistoryItem[]): Promise<boolean> {
  const text = generateDiscountHistoryText(history);
  return copyToClipboard(text);
}