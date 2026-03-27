/**
 * @module Store de Tema G360
 * @description Manejo del estado del tema (claro/oscuro)
 *
 * @author Carlos Cusi (CCUSI)
 * @created 2026-03-25
 * @version 1.0.1
 */

import { writable, derived } from 'svelte/store';
import type { Theme } from '../types';
import { browser } from '$app/environment';

// ========================================
// Funciones Auxiliares
// ========================================

/**
 * Obtiene el tema inicial desde localStorage o usa 'dark' por defecto
 */
function getInitialTheme(): Theme {
  if (!browser) return 'dark';
  
  try {
    const saved = localStorage.getItem('g360-theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    
    // Detectar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch (e) {
    console.warn('Error reading theme from localStorage:', e);
  }
  
  return 'dark';
}

/**
 * Aplica el tema al DOM
 */
function applyTheme(theme: Theme): void {
  if (!browser) return;
  
  try {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Actualizar meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0b1220' : '#f8fafc');
    }
  } catch (e) {
    console.warn('Error applying theme:', e);
  }
}

/**
 * Guarda el tema en localStorage
 */
function saveTheme(theme: Theme): void {
  if (!browser) return;
  
  try {
    localStorage.setItem('g360-theme', theme);
  } catch (e) {
    console.warn('Error saving theme to localStorage:', e);
  }
}

// ========================================
// Store Principal de Tema (Instancia Única)
// ========================================

const { subscribe, set, update } = writable<Theme>(getInitialTheme());

/**
 * Store exportado con métodos personalizados
 */
export const themeStore = {
  subscribe,
  
  /**
   * Cambia al tema opuesto
   */
  toggle: () => {
    update(current => {
      const newTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      saveTheme(newTheme);
      return newTheme;
    });
  },
  
  /**
   * Establece un tema específico
   */
  set: (theme: Theme) => {
    set(theme);
    applyTheme(theme);
    saveTheme(theme);
  },
  
  /**
   * Inicializa el tema desde localStorage
   */
  init: () => {
    const savedTheme = getInitialTheme();
    set(savedTheme);
    applyTheme(savedTheme);
  }
};

// ========================================
// Stores Derivados
// ========================================

/**
 * Store derivado que indica si el tema actual es oscuro
 */
export const isDarkMode = derived(
  themeStore,
  ($theme) => $theme === 'dark'
);

/**
 * Store derivado que indica si el tema actual es claro
 */
export const isLightMode = derived(
  themeStore,
  ($theme) => $theme === 'light'
);

// ========================================
// Funciones de Conveniencia
// ========================================

/**
 * Alterna entre tema claro y oscuro
 */
export function toggleTheme(): void {
  themeStore.toggle();
}

/**
 * Establece el tema oscuro
 */
export function setDarkTheme(): void {
  themeStore.set('dark');
}

/**
 * Establece el tema claro
 */
export function setLightTheme(): void {
  themeStore.set('light');
}

/**
 * Inicializa el tema (llamar al inicio de la app)
 */
export function initTheme(): void {
  themeStore.init();
}
