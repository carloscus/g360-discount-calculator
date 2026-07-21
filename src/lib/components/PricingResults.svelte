<script lang="ts">
  import type { PricingResult } from '../types';
  import { formatCurrency, formatPercentage } from '../utils/formatting';
  
  export let results: PricingResult;
  export let hasData: boolean;
  export let cost: number = 0;

  // Semáforo de Rentabilidad
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
    <div class="results-flow">
      <!-- FILA 1: Costo → Precio de Venta -->
      <div class="flow-row">
        <div class="result-tile input-tile">
          <span class="result-label">💰 Costo</span>
          <div class="value-group">
            <span class="result-value input-text">{formatCurrency(cost)}</span>
            <span class="sub-value">Lo que inviertes</span>
          </div>
        </div>

        <div class="flow-arrow">→</div>

        <div class="result-tile output-tile">
          <span class="result-label">💵 Precio Venta</span>
          <div class="value-group">
            <span class="result-value output-text">{formatCurrency(results.sellingPrice)}</span>
            <span class="sub-value">Subtotal Neto</span>
          </div>
        </div>
      </div>

      <!-- FILA 2: Margen Real + Markup -->
      <div class="metrics-row">
        <div class="result-tile highlight-dynamic" style="border-color: {marginColor}; box-shadow: {marginGlow}">
          <span class="result-label" style="color: {marginColor}">📊 Margen Real</span>
          <div class="value-group">
            <span class="result-value" style="color: {marginColor}">{formatPercentage(results.grossMargin)}</span>
            <span class="sub-value">Sobre la venta</span>
          </div>
        </div>

        <div class="result-tile">
          <span class="result-label">📈 Markup</span>
          <div class="value-group">
            <span class="result-value markup-value">{formatPercentage(results.markup)}</span>
            <span class="sub-value">Sobre el costo</span>
          </div>
        </div>
      </div>

      <!-- FILA 3: Ganancias (Neto y con IGV) -->
      <div class="metrics-row">
        <div class="result-tile profit-tile">
          <span class="result-label">✅ Ganancia Neta</span>
          <div class="value-group">
            <span class="result-value profit-text">{formatCurrency(results.grossProfit)}</span>
            <span class="sub-value">Venta − Costo</span>
          </div>
        </div>

        <div class="result-tile profit-igv-tile">
          <span class="result-label">✅ Ganancia +IGV</span>
          <div class="value-group">
            <span class="result-value profit-igv-text">{formatCurrency(results.grossProfitWithIGV)}</span>
            <span class="sub-value">Total +IGV − Costo</span>
          </div>
        </div>
      </div>

      <!-- FILA 4: Total con IGV (Final) -->
      <div class="total-row">
        <div class="result-tile highlight-final">
          <span class="result-label">💵 CLIENTE PAGA</span>
          <div class="value-group">
            <span class="result-value final-text">{formatCurrency(results.finalPrice)}</span>
            <span class="sub-value">Incluye S/ {formatCurrency(results.ivaAmount, false)} de IGV</span>
          </div>
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

  .results-flow {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* FILA 1: Costo → Precio */
  .flow-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0.4rem;
    align-items: center;
  }

  .flow-arrow {
    font-size: 1.3rem;
    color: var(--g360-accent);
    font-weight: 800;
    text-align: center;
    line-height: 1;
    opacity: 0.7;
  }

  /* FILAS 2, 3: Dos métricas lado a lado */
  .metrics-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem;
  }

  /* FILA 4: Total ancho completo */
  .total-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }

  .result-tile {
    display: flex; flex-direction: column; padding: 0.65rem;
    background: var(--theme-surface); border-radius: 12px;
    border: 1px solid var(--theme-border); transition: all 0.2s ease;
    min-height: 60px; justify-content: space-between;
  }

  .input-tile {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.2);
  }

  .output-tile {
    background: rgba(0, 208, 132, 0.08);
    border-color: rgba(0, 208, 132, 0.2);
  }

  .profit-tile {
    background: rgba(34, 197, 94, 0.08);
    border-color: rgba(34, 197, 94, 0.2);
  }

  .profit-igv-tile {
    background: rgba(59, 130, 246, 0.08);
    border-color: rgba(59, 130, 246, 0.2);
  }

  .highlight-final {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.12), transparent);
    border-color: var(--g360-neon-purple);
    border-width: 2px;
  }

  .highlight-dynamic {
    background: linear-gradient(135deg, rgba(0, 208, 132, 0.08), transparent);
  }

  .value-group { display: flex; flex-direction: column; align-items: flex-end; }

  .sub-value {
    font-size: 0.6rem; font-weight: 600; opacity: 0.65; margin-top: 1px;
    white-space: nowrap;
  }
  
  .result-label {
    font-size: 0.6rem; color: var(--theme-muted); font-weight: 700;
    text-transform: uppercase; text-align: left; letter-spacing: 0.3px;
  }
  
  .result-value {
    font-size: 1rem; font-weight: 800; color: var(--theme-text);
    text-align: right; font-family: var(--g360-font-mono, monospace);
  }
  
  .final-text { color: var(--g360-neon-purple); font-size: 1.15rem; }
  .input-text { color: var(--danger-color); }
  .output-text { color: var(--g360-accent); font-size: 1.1rem; }
  .markup-value { color: var(--info-color); }
  .profit-text { color: #22c55e; }
  .profit-igv-text { color: #3b82f6; }

  .results-empty { text-align: center; padding: 1.5rem 1rem; }
  .empty-icon { font-size: 1.5rem; opacity: 0.3; margin-bottom: 0.5rem; }
  .empty-text { color: var(--theme-muted); font-size: 0.75rem; margin: 0; }

  @media (max-width: 600px) {
    .flow-row { grid-template-columns: 1fr auto 1fr; gap: 0.3rem; }
    .flow-arrow { font-size: 1.1rem; }
    .metrics-row { grid-template-columns: 1fr 1fr; gap: 0.35rem; }
    .result-tile { padding: 0.5rem; min-height: 54px; }
    .result-label { font-size: 0.55rem; }
    .result-value { font-size: 0.85rem; }
    .sub-value { font-size: 0.55rem; }
    .final-text { font-size: 1rem; }
  }

  @media (max-width: 380px) {
    .result-tile { min-height: 50px; padding: 0.45rem; }
    .result-value { font-size: 0.8rem; }
    .flow-row { grid-template-columns: 1fr auto 1fr; }
  }
</style>