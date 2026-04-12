<script lang="ts">
  import { pricingStore, pricingResults, hasPricingData } from '../stores/pricing';
  import type { PricingMode, PricingResult } from '../types';
  import SegmentedControl from './SegmentedControl.svelte';
  import PricingResults from './PricingResults.svelte';
  import { formatCurrency, parseNumber } from '../utils/formatting';
  import { copyPricingResults, sharePricingViaWhatsApp } from '../utils/sharing';
  import { IVA_RATE } from '../types';
  
  export let onShowToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;

  // Estado local (valores por defecto que se actualizan desde el store)
  let mode: PricingMode = 'margin';
  let cost = 0;
  let margin = 0;
  let markup = 0;
  let price = 0;
  let inputModeIGV = false;
  let results: PricingResult = {
    sellingPrice: 0,
    grossMargin: 0,
    markup: 0,
    ivaAmount: 0,
    finalPrice: 0,
    grossProfit: 0
  };

  let costInputValue = '';
  let priceInputValue = '';
  let costFocused = false;
  let priceFocused = false;

  // Suscribirse a los stores
  pricingStore.subscribe(state => {
    mode = state.mode;
    cost = state.cost;
    margin = state.margin;
    markup = state.markup;
    price = state.price;
    inputModeIGV = state.inputModeIGV;
  });

  pricingResults.subscribe(value => {
    results = value;
  });

  function getDisplayValue(val: number, isIGV: boolean, isFocused: boolean): string {
    if (val <= 0) return '';
    const displayVal = isIGV ? val * 1.18 : val;
    // Redondear a 4 decimales máximo
    const rounded = Math.round(displayVal * 10000) / 10000;
    return isFocused ? rounded.toString() : rounded.toFixed(2);
  }

  $: costInputValue = getDisplayValue(cost, inputModeIGV, costFocused);
  $: priceInputValue = getDisplayValue(price, inputModeIGV, priceFocused);

  function handleCostFocus(event: FocusEvent) {
    costFocused = true;
    const target = event.target as HTMLInputElement;
    setTimeout(() => target.select(), 0);
  }

  function handleCostBlur() {
    costFocused = false;
    costInputValue = getDisplayValue(cost, inputModeIGV, false);
  }

  function handlePriceFocus(event: FocusEvent) {
    priceFocused = true;
    const target = event.target as HTMLInputElement;
    setTimeout(() => target.select(), 0);
  }

  function handlePriceBlur() {
    priceFocused = false;
    priceInputValue = getDisplayValue(price, inputModeIGV, false);
  }

  // Funciones de manejo
  function handleModeChange(newMode: PricingMode) {
    pricingStore.setMode(newMode);
  }

  function handleInputModeToggle() {
    pricingStore.setInputModeIGV(!inputModeIGV);
    onShowToast(inputModeIGV ? 'Ingreso: Neto' : 'Ingreso: con IGV', 'info');
  }

  function processValue(val: string): number {
    const cleaned = val.replace(/[^\d.]/g, '');
    const parsed = parseNumber(cleaned);
    if (inputModeIGV) {
      // Redondear a 4 decimales al quitar IGV
      return Math.round((parsed / (1 + IVA_RATE)) * 10000) / 10000;
    }
    return parsed;
  }

  function handleCostInput(event: Event) {
    const target = event.target as HTMLInputElement;
    pricingStore.setCost(processValue(target.value));
  }

  function handleMarginInput(event: Event) {
    const target = event.target as HTMLInputElement;
    pricingStore.setMargin(parseNumber(target.value.replace(/[^\d.]/g, '')));
  }

  function handleMarkupInput(event: Event) {
    const target = event.target as HTMLInputElement;
    pricingStore.setMarkup(parseNumber(target.value.replace(/[^\d.]/g, '')));
  }

  function handlePriceInput(event: Event) {
    const target = event.target as HTMLInputElement;
    pricingStore.setPrice(processValue(target.value));
  }

  function handleFocus(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    setTimeout(() => target.select(), 0);
  }

  function handleShareWhatsApp() {
    if (cost <= 0) return;
    sharePricingViaWhatsApp(cost, results, true);
    onShowToast('Abriendo WhatsApp...', 'info');
  }

  function handleClear() {
    if (cost > 0 || price > 0 || margin > 0 || markup > 0) {
      if (confirm('¿Limpiar todo el cálculo?')) {
        pricingStore.clear();
        onShowToast('Limpiado', 'success');
      }
    } else {
      onShowToast('Ya está limpio', 'info');
    }
  }

  function doSave(alsoShare: boolean = false) {
    if (cost <= 0) return;

    const historyItem = {
      cost,
      sellingPrice: results.sellingPrice,
      results,
      clientCode: '',
      clientName: '',
      observation: '',
      mode: mode,
      inputModeIGV,
      timestamp: new Date().toISOString(),
      fromWSP: alsoShare
    };

    try {
      const history = JSON.parse(localStorage.getItem('g360-history-pricing') || '[]');
      history.unshift(historyItem);
      localStorage.setItem('g360-history-pricing', JSON.stringify(history.slice(0, 50)));

      if (!alsoShare) {
        pricingStore.clear();
        onShowToast('Guardado en historial', 'success');
      }
    } catch (e) {
      onShowToast('Error al guardar', 'error');
    }

    if (alsoShare) {
      handleShareWhatsApp();
    }
  }

  function doShare(alsoSave: boolean = true) {
    if (cost <= 0) return;
    handleShareWhatsApp();

    if (alsoSave) {
      doSave(false);
    }
  }
</script>

<div class="pricing-page">
  <div class="top-bar">
    <SegmentedControl value={mode} onChange={handleModeChange} />
    <button class="toggle-mode-btn" class:active={inputModeIGV} on:click={handleInputModeToggle}>
      {inputModeIGV ? 'MODO: INC. IGV' : 'MODO: NETO'}
    </button>
  </div>

  <div class="input-section glass-card">
    <div class="inputs-grid">
      <!-- Costo -->
      <div class="input-group">
        <label class="input-label">💰 Costo {inputModeIGV ? '(Inc. IGV)' : '(Neto)'}</label>
        <div class="input-wrapper">
          <span class="currency-prefix">S/</span>
          <input
            type="text"
            class="price-input"
            placeholder="0.00"
            bind:value={costInputValue}
            on:input={handleCostInput}
            on:focus={handleCostFocus}
            on:blur={handleCostBlur}
            inputmode="decimal"
          />
        </div>
        {#if inputModeIGV && cost > 0}
          <span class="neto-hint">Neto: {formatCurrency(cost)}</span>
        {/if}
      </div>
      
      <!-- Entrada Dinámica -->
      <div class="input-group">
        {#if mode === 'margin'}
          <label class="input-label">📊 Margen %</label>
          <div class="input-wrapper">
            <input
              type="text"
              class="percentage-input"
              placeholder="0"
              value={margin > 0 ? margin.toString() : ''}
              on:input={handleMarginInput}
              on:focus={handleFocus}
              inputmode="decimal"
            />
            <span class="percentage-suffix">%</span>
          </div>
        {:else if mode === 'markup'}
          <label class="input-label">📈 Markup %</label>
          <div class="input-wrapper">
            <input
              type="text"
              class="percentage-input"
              placeholder="0"
              value={markup > 0 ? markup.toString() : ''}
              on:input={handleMarkupInput}
              on:focus={handleFocus}
              inputmode="decimal"
            />
            <span class="percentage-suffix">%</span>
          </div>
        {:else}
          <label class="input-label">💵 Venta {inputModeIGV ? '(Inc. IGV)' : '(Neto)'}</label>
          <div class="input-wrapper">
            <span class="currency-prefix">S/</span>
          <input
            type="text"
            class="price-input"
            placeholder="0.00"
            bind:value={priceInputValue}
            on:input={handlePriceInput}
            on:focus={handlePriceFocus}
            on:blur={handlePriceBlur}
            inputmode="decimal"
          />
          </div>
          {#if inputModeIGV && price > 0}
            <span class="neto-hint">Neto: {formatCurrency(price)}</span>
          {/if}
        {/if}
      </div>
    </div>
  </div>

  <PricingResults {results} hasData={$hasPricingData} />

  <div class="action-buttons-grid">
    <button class="action-btn clear-btn" on:click={handleClear}>🗑️ Limpiar</button>
    <button class="action-btn save-btn" on:click={() => doSave()} disabled={cost <= 0}>💾 Guardar</button>
    <button class="action-btn share-btn whatsapp full-width" on:click={() => doShare()} disabled={cost <= 0}>💬 WhatsApp</button>
  </div>
</div>

<style>
  .pricing-page { max-width: 800px; margin: 0 auto; padding: 0 0.75rem; }
  
  .top-bar { display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.75rem; }
  .top-bar :global(.segmented-capsule) { flex: 1; margin-bottom: 0; }

  .toggle-mode-btn {
    height: 44px; padding: 0 0.75rem; border-radius: 12px; border: 1px solid var(--theme-border);
    background: var(--theme-surface); color: var(--theme-muted); font-weight: 700; font-size: 0.65rem;
    text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; white-space: nowrap;
  }
  .toggle-mode-btn.active {
    background: var(--g360-neon-blue); color: var(--g360-bg); border-color: var(--g360-neon-blue);
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
  }

  .input-section { padding: 0.75rem; margin-bottom: 0.75rem; }
  .inputs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
  
  .input-label { 
    font-size: 0.7rem; font-weight: 700; text-transform: uppercase; 
    color: var(--theme-muted); margin-bottom: 0.35rem; display: block; letter-spacing: 0.3px;
  }

  .input-wrapper { position: relative; display: flex; align-items: center; }
  .currency-prefix { position: absolute; left: 0.65rem; color: var(--g360-accent); font-weight: 700; font-size: 0.85rem; }
  .percentage-suffix { position: absolute; right: 0.65rem; color: var(--g360-accent); font-weight: 700; font-size: 0.85rem; }

  .price-input, .percentage-input {
    width: 100%; padding: 0.65rem 0.7rem; padding-left: 1.9rem;
    border: 1px solid var(--theme-border); border-radius: 10px;
    background: var(--theme-surface); color: var(--theme-text);
    font-size: 1.1rem; font-weight: 700; text-align: right;
    font-family: var(--g360-font-mono, monospace); outline: none; min-height: 48px;
  }

  .percentage-input { padding-left: 0.7rem; padding-right: 1.9rem; }
  .price-input:focus, .percentage-input:focus { border-color: var(--g360-accent); box-shadow: var(--neon-glow); }

  .neto-hint { font-size: 0.6rem; color: var(--g360-accent); font-weight: 600; text-align: right; margin-top: 3px; display: block; }

  .action-buttons-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.35rem; margin-top: 1rem; margin-bottom: 1rem; }
  .action-btn { 
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    min-height: 52px; border-radius: 12px; font-weight: 700; font-size: 0.85rem;
    text-transform: uppercase; border: none; cursor: pointer;
    width: 100%;
  }
  .clear-btn { background: var(--theme-surface); border: 1px solid var(--theme-border); color: var(--theme-text); }
  .save-btn { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; }
  .whatsapp { background: linear-gradient(135deg, #25d366, #128c7e); color: white; }
  .action-btn:disabled { opacity: 0.5; }

  @media (max-width: 480px) {
    .action-buttons-grid { grid-template-columns: 1fr 1fr 1fr; }
  }

  /* Responsive móvil优先级 */
  @media (max-width: 480px) {
    .pricing-page { padding: 0 0.5rem; }
    .inputs-grid { gap: 0.6rem; }
    .input-section { padding: 0.6rem; }
    .price-input, .percentage-input { font-size: 1rem; padding: 0.6rem; padding-left: 1.7rem; min-height: 44px; }
    .percentage-input { padding-left: 0.6rem; padding-right: 1.7rem; }
    .action-btn { min-height: 48px; font-size: 0.85rem; }
  }
</style>