/**
 * @module Punto de Entrada Principal
 * @description Inicialización de la aplicación SvelteKit
 *
 * @author Carlos Cusi (CCUSI)
 * @created 2026-03-25
 * @version 1.0.0
 */

import { mount } from 'svelte';
import App from './App.svelte';
import { initTheme } from './lib/stores/theme';
import './app.css';

// Inicializar tema antes de montar la aplicación
initTheme();

// Montar la aplicación
const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;