/**
 * @module Store de Descuentos
 * @description Manejo del estado de descuentos y precio original
 *
 * @author Carlos Cusi (CCUSI)
 * @created 2026-03-25
 * @version 1.0.0
 */

import { writable, derived, get } from 'svelte/store';
import type { Discount, DiscountResult } from '../types';
import { MAX_DISCOUNTS } from '../types';
import { calculateConsecutiveDiscounts, calculateSimpleDiscountSum } from '../utils/calculations';
import { browser } from '$app/environment';

// ========================================
// Store Principal de Descuentos
// ========================================

/**
 * Crea el store de descuentos con funcionalidades completas
 */
function createDiscountStore() {
  // Estado inicial
  const initialState = loadFromStorage() || {
    originalPrice: 0,
    discounts: []
  };

  const { subscribe, set, update } = writable<{
    originalPrice: number;
    discounts: Discount[];
  }>(initialState);

  // Guardar en localStorage cuando cambie el estado
  let currentState = initialState;
  
  return {
    subscribe,
    
    /**
     * Establece el precio original
     */
    setOriginalPrice: (price: number) => {
      update(state => {
        const newState = { ...state, originalPrice: price };
        saveToStorage(newState);
        return newState;
      });
    },
    
    /**
     * Agrega un nuevo descuento
     */
    addDiscount: (percentage: number = 0) => {
      update(state => {
        if (state.discounts.length >= MAX_DISCOUNTS) {
          return state; // No agregar si se alcanzó el máximo
        }
        
        const newDiscount: Discount = {
          id: Date.now(),
          percentage,
          isActive: true
        };
        
        const newState = {
          ...state,
          discounts: [...state.discounts, newDiscount]
        };
        saveToStorage(newState);
        return newState;
      });
    },
    
    /**
     * Actualiza el porcentaje de un descuento
     */
    updateDiscount: (id: number, percentage: number) => {
      update(state => {
        const newState = {
          ...state,
          discounts: state.discounts.map(d => 
            d.id === id ? { ...d, percentage } : d
          )
        };
        saveToStorage(newState);
        return newState;
      });
    },
    
    /**
     * Elimina un descuento
     */
    removeDiscount: (id: number) => {
      update(state => {
        const newState = {
          ...state,
          discounts: state.discounts.filter(d => d.id !== id)
        };
        saveToStorage(newState);
        return newState;
      });
    },
    
    /**
     * Alterna el estado activo de un descuento
     */
    toggleDiscount: (id: number) => {
      update(state => {
        const newState = {
          ...state,
          discounts: state.discounts.map(d => 
            d.id === id ? { ...d, isActive: !d.isActive } : d
          )
        };
        saveToStorage(newState);
        return newState;
      });
    },
    
    /**
     * Limpia todos los descuentos
     */
    clearAll: () => {
      const newState = { originalPrice: 0, discounts: [] };
      set(newState);
      saveToStorage(newState);
    },
    
    /**
     * Reinicia solo los descuentos (mantiene precio original)
     */
    clearDiscounts: () => {
      update(state => {
        const newState = { ...state, discounts: [] };
        saveToStorage(newState);
        return newState;
      });
    },
    
    /**
     * Verifica si se puede agregar más descuentos
     */
    canAddMore: () => {
      const state = get({ subscribe });
      return state.discounts.length < MAX_DISCOUNTS;
    },

    /**
     * Establece los descuentos directamente (para cargar desde historial)
     */
    setDiscounts: (discounts: Discount[]) => {
      update(state => {
        const newState = { ...state, discounts };
        saveToStorage(newState);
        return newState;
      });
    }
  };
}

// ========================================
// Funciones de Persistencia
// ========================================

/**
 * Guarda el estado en localStorage
 */
function saveToStorage(state: { originalPrice: number; discounts: Discount[] }): void {
  if (!browser) return;
  
  try {
    localStorage.setItem('g360-discounts', JSON.stringify(state));
  } catch (e) {
    console.warn('Error saving discounts to localStorage:', e);
  }
}

/**
 * Carga el estado desde localStorage
 */
function loadFromStorage(): { originalPrice: number; discounts: Discount[] } | null {
  if (!browser) return null;
  
  try {
    const saved = localStorage.getItem('g360-discounts');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.originalPrice === 'number' && Array.isArray(parsed.discounts)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading discounts from localStorage:', e);
  }
  
  return null;
}

// ========================================
// Store Principal Exportado
// ========================================

export const discountStore = createDiscountStore();

// ========================================
// Stores Derivados
// ========================================

/**
 * Store derivado con los resultados del cálculo
 */
export const discountResults = derived(
  discountStore,
  ($store): DiscountResult => {
    const activeDiscounts = $store.discounts.filter(d => d.isActive && d.percentage > 0);
    return calculateConsecutiveDiscounts($store.originalPrice, activeDiscounts);
  }
);

/**
 * Store derivado que indica si hay descuentos activos
 */
export const hasActiveDiscounts = derived(
  discountStore,
  ($store) => $store.discounts.some(d => d.isActive && d.percentage > 0)
);

/**
 * Store derivado con el número de descuentos activos
 */
export const activeDiscountCount = derived(
  discountStore,
  ($store) => $store.discounts.filter(d => d.isActive && d.percentage > 0).length
);

/**
 * Store derivado que indica si se puede agregar más descuentos
 */
export const canAddMoreDiscounts = derived(
  discountStore,
  ($store) => $store.discounts.length < MAX_DISCOUNTS
);

/**
 * Store derivado con la suma simple de descuentos (25% + 4% + 2% = 29.44%)
 */
export const simpleDiscountSum = derived(
  discountStore,
  ($store) => {
    const activeDiscounts = $store.discounts.filter(d => d.isActive && d.percentage > 0);
    return calculateSimpleDiscountSum(activeDiscounts);
  }
);

// ========================================
// Funciones de Conveniencia
// ========================================

/**
 * Establece el precio original
 */
export function setOriginalPrice(price: number): void {
  discountStore.setOriginalPrice(price);
}

/**
 * Agrega un descuento
 */
export function addDiscount(percentage: number = 0): void {
  discountStore.addDiscount(percentage);
}

/**
 * Actualiza un descuento
 */
export function updateDiscount(id: number, percentage: number): void {
  discountStore.updateDiscount(id, percentage);
}

/**
 * Elimina un descuento
 */
export function removeDiscount(id: number): void {
  discountStore.removeDiscount(id);
}

/**
 * Alterna un descuento
 */
export function toggleDiscount(id: number): void {
  discountStore.toggleDiscount(id);
}

/**
 * Limpia todo
 */
export function clearAllDiscounts(): void {
  discountStore.clearAll();
}

/**
 * Limpia solo descuentos
 */
export function clearDiscounts(): void {
  discountStore.clearDiscounts();
}