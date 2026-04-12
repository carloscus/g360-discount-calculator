/**
 * @module Utilidades de Cálculo
 * @description Funciones para cálculos de descuentos y precios
 *
 * @author Carlos Cusi (CCUSI)
 * @created 2026-03-25
 * @version 1.0.0
 */

import type { Discount, DiscountResult, PricingResult } from '../types';
import { IVA_RATE } from '../types';

// ========================================
// Cálculos de Descuentos Sin Precio Original
// ========================================

/**
 * Calcula el descuento efectivo total usando precio original
 * Ejemplo: 8.33 con 15%+10%+3% = final 6.18, descuento 39.98%
 * @param discounts - Array de descuentos (porcentajes)
 * @param originalPrice - Precio original (si es 0 o no existe, usa 100)
 * @returns Descuento efectivo en porcentaje
 */
export function calculateEffectiveDiscount(discounts: Discount[], originalPrice: number = 100): number {
  const activeDiscounts = discounts.filter(d => d.isActive && d.percentage > 0);
  
  if (activeDiscounts.length === 0 || originalPrice <= 0) {
    return 0;
  }

  // Calcular precio final aplicando descuentos consecutivamente
  let finalPrice = originalPrice;
  for (const discount of activeDiscounts) {
    finalPrice *= (1 - discount.percentage / 100);
  }
  
  // Descuento efectivo = (original - final) / original * 100
  const savings = originalPrice - finalPrice;
  const effectiveDiscount = (savings / originalPrice) * 100;
  
  return Math.round(effectiveDiscount * 100) / 100;
}

/**
 * Calcula el descuento efectivo para un solo descuento o array de descuentos
 * @param discountPercentages - Un número o array de porcentajes
 * @returns Descuento efectivo total
 */
export function calculateTotalEffectiveDiscount(discountPercentages: number | number[]): number {
  const discounts = Array.isArray(discountPercentages) 
    ? discountPercentages 
    : [discountPercentages];
  
  if (discounts.length === 0 || discounts.every(d => d <= 0)) {
    return 0;
  }

  // Usar precio base de 100
  const basePrice = 100;
  let finalPrice = basePrice;
  
  for (const discount of discounts) {
    if (discount > 0) {
      finalPrice *= (1 - discount / 100);
    }
  }
  
  const effectiveDiscount = basePrice - finalPrice;
  
  return Math.round(effectiveDiscount * 100) / 100;
}

// ========================================
// Cálculos de Descuentos Consecutivos
// ========================================

/**
 * Calcula el descuento efectivo aplicando descuentos consecutivos
 * @param originalPrice - Precio original
 * @param discounts - Array de descuentos (porcentajes)
 * @returns Resultado con descuento efectivo, precio final y ahorro
 */
export function calculateConsecutiveDiscounts(
  originalPrice: number,
  discounts: Discount[]
): DiscountResult {
  if (originalPrice <= 0) {
    return {
      originalPrice: 0,
      effectiveDiscount: 0,
      exactEffectiveDiscount: 0,
      finalPrice: 0,
      savings: 0
    };
  }

  let currentPrice = originalPrice;
  
  // Aplicar cada descuento consecutivamente
  for (const discount of discounts) {
    if (discount.isActive && discount.percentage > 0) {
      currentPrice *= (1 - discount.percentage / 100);
    }
  }

  const savings = originalPrice - currentPrice;
  const effectiveDiscount = (savings / originalPrice) * 100;

  return {
    originalPrice,
    effectiveDiscount: Math.round(effectiveDiscount * 100) / 100,
    exactEffectiveDiscount: effectiveDiscount,
    finalPrice: Math.round(currentPrice * 100) / 100,
    savings: Math.round(savings * 100) / 100
  };
}

/**
 * Calcula el precio final aplicando un solo descuento
 * @param price - Precio original
 * @param discountPercentage - Porcentaje de descuento
 * @returns Precio final después del descuento
 */
export function calculateSingleDiscount(price: number, discountPercentage: number): number {
  return price * (1 - discountPercentage / 100);
}

// ========================================
// Cálculos de Pricing (Costo → Precio)
// ========================================

/**
 * Calcula el precio de venta basado en margen bruto
 * Fórmula: Precio = Costo / (1 - Margen/100)
 * @param cost - Costo del producto
 * @param margin - Margen deseado (porcentaje)
 * @returns Precio de venta
 */
export function calculatePriceFromMargin(cost: number, margin: number): number {
  if (margin >= 100) {
    throw new Error('El margen no puede ser 100% o más');
  }
  return cost / (1 - margin / 100);
}

/**
 * Calcula el precio de venta basado en markup
 * Fórmula: Precio = Costo * (1 + Markup/100)
 * @param cost - Costo del producto
 * @param markup - Markup deseado (porcentaje)
 * @returns Precio de venta
 */
export function calculatePriceFromMarkup(cost: number, markup: number): number {
  return cost * (1 + markup / 100);
}

/**
 * Calcula el margen bruto dado un costo y precio
 * Fórmula: Margen = ((Precio - Costo) / Precio) * 100
 * @param cost - Costo del producto
 * @param price - Precio de venta
 * @returns Margen bruto (porcentaje)
 */
export function calculateMargin(cost: number, price: number): number {
  if (price === 0) return 0;
  return ((price - cost) / price) * 100;
}

/**
 * Calcula el markup dado un costo y precio
 * Fórmula: Markup = ((Precio - Costo) / Costo) * 100
 * @param cost - Costo del producto
 * @param price - Precio de venta
 * @returns Markup (porcentaje)
 */
export function calculateMarkup(cost: number, price: number): number {
  if (cost === 0) return 0;
  return ((price - cost) / cost) * 100;
}

/**
 * Calcula el precio final con IVA
 * @param price - Precio sin IVA
 * @returns Precio con IVA incluido
 */
export function addIVA(price: number): number {
  return price * (1 + IVA_RATE);
}

/**
 * Calcula el monto de IVA
 * @param price - Precio sin IVA
 * @returns Monto del IVA
 */
export function calculateIVAAmount(price: number): number {
  return price * IVA_RATE;
}

/**
 * Calcula resultados completos de pricing
 * @param cost - Costo del producto
 * @param sellingPrice - Precio de venta
 * @param includeIVA - Si incluir IVA en el resultado
 * @returns Resultado completo de pricing
 */
export function calculatePricingResults(
  cost: number,
  sellingPrice: number,
  includeIVA: boolean = false
): PricingResult {
  const grossMargin = calculateMargin(cost, sellingPrice);
  const markup = calculateMarkup(cost, sellingPrice);
  const ivaAmount = calculateIVAAmount(sellingPrice);
  const finalPrice = includeIVA ? addIVA(sellingPrice) : sellingPrice;
  const grossProfit = sellingPrice - cost;

  return {
    sellingPrice: Math.round(sellingPrice * 100) / 100,
    grossMargin: Math.round(grossMargin * 100) / 100,
    markup: Math.round(markup * 100) / 100,
    ivaAmount: Math.round(ivaAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
    grossProfit: Math.round(grossProfit * 100) / 100
  };
}

// ========================================
// Utilidades Generales
// ========================================

/**
 * Valida que un porcentaje esté en el rango correcto
 * @param percentage - Porcentaje a validar
 * @param min - Valor mínimo (por defecto 0)
 * @param max - Valor máximo (por defecto 100)
 * @returns true si es válido
 */
export function isValidPercentage(
  percentage: number,
  min: number = 0,
  max: number = 100
): boolean {
  return percentage >= min && percentage <= max;
}

/**
 * Redondea un número a decimales específicos
 * @param value - Valor a redondear
 * @param decimals - Número de decimales
 * @returns Valor redondeado
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calcula el porcentaje de un valor
 * @param value - Valor base
 * @param percentage - Porcentaje a calcular
 * @returns Resultado del porcentaje
 */
export function calculatePercentage(value: number, percentage: number): number {
  return (value * percentage) / 100;
}