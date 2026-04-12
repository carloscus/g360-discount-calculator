<script lang="ts">
  import type { DiscountResult, Discount } from '../types';
  import { IVA_RATE } from '../types';
  import { formatCurrency, formatPercentage, formatPercentageCompact } from '../utils/formatting';
  import { calculateEffectiveDiscount } from '../utils/calculations';
  
  export let results: DiscountResult;
  export let hasDiscounts: boolean;
  export let hasTargetPrice: boolean = false;
  export let targetPrice: number = 0;
  export let requiredDiscount: number = 0;
  export let discounts: Discount[] = [];
  
  $: effectiveDiscountPercent = hasDiscounts && discounts && discounts.length > 0
    ? results.originalPrice > 0 ? results.effectiveDiscount : calculateEffectiveDiscount(discounts, 100)
    : 0;
  $: finalPrice = hasTargetPrice ? targetPrice : results.finalPrice;
  $: priceWithIGV = finalPrice * (1 + IVA_RATE);
  $: igvAmount = finalPrice * IVA_RATE;
  $: hasResults = hasTargetPrice ? targetPrice > 0 : (hasDiscounts || effectiveDiscountPercent > 0);
  $: showEffectiveDiscount = !hasTargetPrice && effectiveDiscountPercent > 0;
  $: discountLabels = discounts?.filter(d => d.isActive && d.percentage > 0).map(d => `${d.percentage}%`).join(' + ') || '';
</script>

<div class="results-card glass-card">
  <div class="results-header">
    <span class="results-icon">📊</span>
    <h3 class="results-title">{hasTargetPrice ? 'Precio Objetivo' : 'Resumen de Descuento'}</h3>
  </div>
  
  {#if hasResults}
    <div class="results-grid">
      {#if hasTargetPrice}
        <!-- Modo Precio Objetivo -->
        <div class="result-tile highlight-final">
          <span class="result-label">Obj. (+IGV)</span>
          <div class="value-group">
            <span class="result-value final-text">{formatCurrency(priceWithIGV)}</span>
            <span class="sub-value">Inc. {formatCurrency(igvAmount)} IGV</span>
          </div>
        </div>

        <div class="result-tile highlight-success">
          <span class="result-label">Dscto. Requerido</span>
          <div class="value-group">
            <span class="result-value success-text">{formatPercentage(requiredDiscount)}</span>
            <span class="sub-value">Para llegar al objetivo</span>
          </div>
        </div>
        
        <div class="result-tile">
          <span class="result-label">Objetivo</span>
          <div class="value-group">
            <span class="result-value target-text">{formatCurrency(targetPrice)}</span>
            <span class="sub-value">Neto</span>
          </div>
        </div>

        <div class="result-tile">
          <span class="result-label">Original</span>
          <div class="value-group">
            <span class="result-value">{formatCurrency(results.originalPrice || 0)}</span>
            <span class="sub-value">Sin descuento</span>
          </div>
        </div>
      {:else if showEffectiveDiscount}
        <!-- Solo descuentos sin precio original -->
        <div class="result-tile highlight-success">
          <span class="result-label">Dscto. Efectivo</span>
          <div class="value-group">
            <span class="result-value success-text">{formatPercentage(effectiveDiscountPercent)}</span>
            <span class="sub-value">{discountLabels}</span>
          </div>
        </div>

        <div class="result-tile">
          <span class="result-label">💡 Nota</span>
          <div class="value-group">
            <span class="result-value">Ingresa precio</span>
            <span class="sub-value">para ver ahorro real</span>
          </div>
        </div>
      {:else}
        <!-- Modo Descuentos normal -->
        <div class="result-tile highlight-final">
          <span class="result-label">Total (+IGV)</span>
          <div class="value-group">
            <span class="result-value final-text">{formatCurrency(priceWithIGV)}</span>
            <span class="sub-value">Inc. {formatCurrency(igvAmount)} IGV</span>
          </div>
        </div>

        <div class="result-tile highlight-success">
          <span class="result-label">Dcto. Real</span>
          <div class="value-group">
            <span class="result-value success-text">{formatPercentage(results.effectiveDiscount)}</span>
            <span class="sub-value">Ahorro: {formatCurrency(results.savings)}</span>
          </div>
        </div>
        
        <div class="result-tile">
          <span class="result-label">Precio Final</span>
          <div class="value-group">
            <span class="result-value">{formatCurrency(results.finalPrice)}</span>
            <span class="sub-value">Subtotal Neto</span>
          </div>
        </div>

        <div class="result-tile">
          <span class="result-label">Estado</span>
          <div class="value-group">
            <span class="result-value info-text">Aplicado</span>
            <span class="sub-value">Operación Exitosa</span>
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="results-empty">
      <div class="empty-icon">💰</div>
      <p class="empty-text">{hasTargetPrice ? 'Ingresa precio original y objetivo' : 'Ingresa precio y descuentos'}</p>
    </div>
  {/if}
</div>

<style>
  .results-card { padding: 0.6rem !important; margin-top: 0.5rem; }
  
  .results-header {
    display: flex; align-items: center; gap: 0.5rem;
    margin-bottom: 0.6rem; padding-bottom: 0.4rem;
    border-bottom: 1px solid var(--theme-border);
  }

  .results-title {
    font-size: var(--font-xs); font-weight: var(--weight-extrabold); color: var(--theme-text);
    text-transform: uppercase; letter-spacing: 0.5px; margin: 0;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.4rem;
  }
  
  .result-tile {
    display: flex; flex-direction: column; padding: 0.6rem;
    background: var(--theme-surface); border-radius: 12px;
    border: 2px solid var(--theme-border); transition: all 0.2s ease;
    min-height: 60px; justify-content: space-between;
  }

  .highlight-success {
    background: linear-gradient(135deg, rgba(0, 208, 132, 0.15), transparent);
    border-color: var(--g360-accent);
    box-shadow: 0 4px 12px rgba(0, 208, 132, 0.15);
  }

  .highlight-final {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), transparent);
    border-color: var(--g360-neon-purple);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.15);
  }

  .value-group { display: flex; flex-direction: column; align-items: flex-end; }

.sub-value { font-size: 0.65rem; font-weight: 600; opacity: 0.7; margin-top: 2px; }
   
  .result-label {
    font-size: 0.6rem; color: var(--theme-muted); font-weight: 700;
    text-transform: uppercase; text-align: left; letter-spacing: 0.5px;
  }
  
  .result-value {
    font-size: 1rem; font-weight: 800; color: var(--theme-text);
    text-align: right; font-family: var(--g360-font-mono, monospace);
  }
  
  .final-text { color: var(--g360-neon-purple); font-size: 1.2rem; }
  .success-text { color: var(--g360-accent); font-size: 1.1rem; }
  .target-text { color: #8b5cf6; }
  .info-text { color: var(--info-color); font-size: 0.8rem; }

  .results-empty { text-align: center; padding: 1.5rem 1rem; }
  .empty-icon { font-size: 1.5rem; opacity: 0.3; margin-bottom: 0.5rem; }
  .empty-text { color: var(--theme-muted); font-size: 0.7rem; margin: 0; }
  
  @media (max-width: 768px) {
    .results-grid { grid-template-columns: repeat(2, 1fr); }
  }
</style>