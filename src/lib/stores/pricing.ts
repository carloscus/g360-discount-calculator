/**
 * @module Store de Pricing
 * @description Manejo del estado de cálculo de precios (Costo → Precio)
 *
 * @author Carlos Cusi (CCUSI)
 * @created 2026-03-25
 * @version 1.0.3
 */

import { writable, derived } from 'svelte/store';
import type { PricingMode, PricingResult } from '../types';
import { 
  calculatePriceFromMargin, 
  calculatePriceFromMarkup,
  calculatePricingResults
} from '../utils/calculations';
import { browser } from '$app/environment';

function createPricingStore() {
  const savedState = loadFromStorage();
  const initialState = {
    mode: savedState?.mode || 'margin' as PricingMode,
    cost: savedState?.cost || 0,
    margin: savedState?.margin || 35,
    markup: savedState?.markup || 53.85,
    price: savedState?.price || 0,
    includeIGV: true,
    inputModeIGV: savedState?.inputModeIGV || false // NUEVO: Indica si los inputs incluyen IVA (IGV en Perú)
  };

  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    setMode: (mode: PricingMode) => update(state => {
      const s = { ...state, mode };
      saveToStorage(s);
      return s;
    }),
    setInputModeIGV: (enabled: boolean) => update(state => {
      const s = { ...state, inputModeIGV: enabled };
      saveToStorage(s);
      return s;
    }),
    setCost: (cost: number) => update(state => {
      const s = { ...state, cost };
      saveToStorage(s);
      return s;
    }),
    setMargin: (margin: number) => update(state => {
      const s = { ...state, margin };
      saveToStorage(s);
      return s;
    }),
    setMarkup: (markup: number) => update(state => {
      const s = { ...state, markup };
      saveToStorage(s);
      return s;
    }),
    setPrice: (price: number) => update(state => {
      const s = { ...state, price };
      saveToStorage(s);
      return s;
    }),
    clear: () => {
      const s = { mode: 'margin' as PricingMode, cost: 0, margin: 0, markup: 0, price: 0, includeIGV: true, inputModeIGV: false };
      set(s);
      saveToStorage(s);
    }
  };
}

function saveToStorage(state: any): void {
  if (browser) localStorage.setItem('g360-pricing', JSON.stringify(state));
}

function loadFromStorage(): any | null {
  if (!browser) return null;
  try {
    const saved = localStorage.getItem('g360-pricing');
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

export const pricingStore = createPricingStore();

export const pricingResults = derived(
  pricingStore,
  ($store): PricingResult => {
    let sellingPrice = 0;
    if ($store.mode === 'margin') {
      sellingPrice = calculatePriceFromMargin($store.cost, $store.margin);
    } else if ($store.mode === 'markup') {
      sellingPrice = calculatePriceFromMarkup($store.cost, $store.markup);
    } else {
      sellingPrice = $store.price;
    }
    return calculatePricingResults($store.cost, sellingPrice, true);
  }
);

export const hasPricingData = derived(pricingStore, ($store) => $store.cost > 0 || $store.price > 0);
