<script lang="ts">
  import type { PricingResult } from '../types';
  import { formatCurrency, formatPercentage } from '../utils/formatting';
  
  export let results: PricingResult;
  export let hasData: boolean;

  // Lógica de Semáforo de Rentabilidad
  $: marginColor = results.grossMargin < 15 
    ? 'var(--danger-color)' 
    : results.grossMargin < 25 
      ? 'var(--warning-color)' 
      : 'var(--g360-accent)';
  
  $: marginGlow = results.grossMargin < 15 
    ? '0 0 12px rgba(239, 68, 68, 0.15)' 
    : results.grossMargin < 25 
      ? '0 0 12px rgba(245, 158, 11, 0.15)' 
      : 'var(--neon-glow)';
</script>

<div class="pricing-results glass-card">
  <div class="results-header">
    <span class="results-icon">📊</span>
    <h3 class="results-title">Análisis de Venta</h3>
  </div>
  
  {#if hasData}
    <div class="results-grid">
      <!-- 1. TOTAL FINAL (CON IGV) -->
      <div class="result-tile highlight-final">
        <span class="result-label">Total (+IGV)</span>
        <div class="value-group">
          <span class="result-value final-text">{formatCurrency(results.finalPrice)}</span>
          <span class="sub-value">Incl. {formatCurrency(results.ivaAmount)} IGV</span>
        </div>
      </div>

      <!-- 2. MARGEN REAL (CON UTILIDAD) -->
      <div class="result-tile highlight-dynamic" style="border-color: {marginColor}; box-shadow: {marginGlow}">
        <span class="result-label" style="color: {marginColor}">Margen Real</span>
        <div class="value-group">
          <span class="result-value" style="color: {marginColor}">{formatPercentage(results.grossMargin)}</span>
          <span class="sub-value">Ganancia: +{formatCurrency(results.grossProfit)}</span>
        </div>
      </div>
      
      <!-- 3. VENTA BASE -->
      <div class="result-tile">
        <span class="result-label">Venta (Base)</span>
        <div class="value-group">
          <span class="result-value base-text">{formatCurrency(results.sellingPrice)}</span>
          <span class="sub-value">Subtotal Neto</span>
        </div>
      </div>
      
      <!-- 4. MARKUP -->
      <div class="result-tile">
        <span class="result-label">Markup</span>
        <div class="value-group">
          <span class="result-value markup-value">{formatPercentage(results.markup)}</span>
          <span class="sub-value">Sobre el Costo</span>
        </div>
      </div>
    </div>
  {:else}
    <div class="results-empty">
      <div class="empty-icon">💰</div>
      <p class="empty-text">Ingresa costo para análisis</p>
    </div>
  {/if}
</div>

<style>
  .pricing-results { padding: 0.75rem; margin-bottom: 1rem; }
  
  .results-header {
    display: flex; align-items: center; gap: 0.5rem;
    margin-bottom: 0.75rem; padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--theme-border);
  }

  .results-title {
    font-size: 0.75rem; font-weight: 800; color: var(--theme-text);
    text-transform: uppercase; letter-spacing: 0.5px; margin: 0;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }
  
  .result-tile {
    display: flex; flex-direction: column; padding: 0.6rem;
    background: var(--theme-surface); border-radius: 12px;
    border: 1px solid var(--theme-border); transition: all 0.2s ease;
    min-height: 60px; justify-content: space-between;
  }

  .highlight-final {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), transparent);
    border-color: var(--g360-neon-purple);
  }

  .value-group { display: flex; flex-direction: column; align-items: flex-end; }

  .sub-value { font-size: 0.65rem; font-weight: 600; opacity: 0.6; margin-top: -1px; }
  
  .result-label {
    font-size: 0.6rem; color: var(--theme-muted); font-weight: 700;
    text-transform: uppercase; text-align: left; letter-spacing: 0.3px;
  }
  
  .result-value {
    font-size: 0.95rem; font-weight: 800; color: var(--theme-text);
    text-align: right; font-family: var(--g360-font-mono, monospace);
  }
  
  .final-text { color: var(--g360-neon-purple); font-size: 1rem; }
  .base-text { color: var(--g360-accent); }
  .markup-value { color: var(--info-color); }

  .results-empty { text-align: center; padding: 1.5rem 1rem; }
  .empty-icon { font-size: 1.5rem; opacity: 0.3; margin-bottom: 0.5rem; }
  .empty-text { color: var(--theme-muted); font-size: 0.75rem; margin: 0; }
  
  @media (max-width: 600px) {
    .results-grid { grid-template-columns: repeat(2, 1fr); gap: 0.4rem; }
    .result-tile { padding: 0.5rem; min-height: 56px; }
    .result-label { font-size: 0.55rem; }
    .result-value { font-size: 0.85rem; }
    .sub-value { font-size: 0.55rem; }
    .final-text { font-size: 0.95rem; }
  }

  @media (max-width: 380px) {
    .result-tile { min-height: 52px; }
    .result-value { font-size: 0.8rem; }
  }
</style>