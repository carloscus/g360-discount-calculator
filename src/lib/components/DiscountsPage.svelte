<script lang="ts">
  import { discountStore, discountResults, hasActiveDiscounts } from '../stores/discounts';
  import type { Discount, DiscountResult } from '../types';
  import { MAX_DISCOUNTS } from '../types';
  import PriceInput from './PriceInput.svelte';
  import DiscountRow from './DiscountRow.svelte';
  import ResultsCard from './ResultsCard.svelte';
  import ActionButtons from './ActionButtons.svelte';
  import HistoryModal from './HistoryModal.svelte';
  import ObservationModal from './ObservationModal.svelte';
  import { IVA_RATE } from '../types';
  import { formatCurrency } from '../utils/formatting';
  import { fly } from 'svelte/transition';
  import { quadOut } from 'svelte/easing';
  
  export let onShowToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  
  let originalPrice = 0;
  let discounts: Discount[] = [];
  let results: DiscountResult = {
    originalPrice: 0,
    effectiveDiscount: 0,
    exactEffectiveDiscount: 0,
    finalPrice: 0,
    savings: 0
  };
  let canAddMore = true;
  let observation = '';
  let clientCode = '';
  let clientName = '';
  let showHistory = false;
  let showObservationModal = false;
  let observationAction: 'save' | 'share' = 'save';
  let targetPrice = 0;
  let targetDisplayValue = '';
  let targetIsFocused = false;
  let igvAddResult = 0;
  let igvRemoveResult = 0;
  let showIgvModal = false;
  let igvModalValue = '';
  let igvModalResult = 0;
  
  function handleTargetInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value;
    const cleaned = rawValue.replace(/[^\d.]/g, '');
    targetDisplayValue = rawValue;
    targetPrice = parseFloat(cleaned) || 0;
  }
  
  function handleTargetFocus(event: FocusEvent) {
    targetIsFocused = true;
    targetDisplayValue = targetPrice > 0 ? targetPrice.toString() : '';
    const target = event.target as HTMLInputElement;
    setTimeout(() => target.select(), 0);
  }
  
  function handleTargetBlur() {
    targetIsFocused = false;
    if (targetPrice > 0) {
      targetDisplayValue = targetPrice.toFixed(2);
    } else {
      targetDisplayValue = '';
    }
  }
  
  function handleTargetKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    }
  }
  
  $: requiredDiscount = originalPrice > 0 && targetPrice > 0 && targetPrice < originalPrice 
    ? ((originalPrice - targetPrice) / originalPrice) * 100 
    : 0;
  
  $: hasTargetPrice = targetPrice > 0 && targetPrice < originalPrice;
  $: showDiscounts = !hasTargetPrice;
  $: canAddMoreDiscounts = showDiscounts && discounts.length < MAX_DISCOUNTS;
  
  function handleAddDiscount() {
    if (hasTargetPrice) {
      onShowToast('Con precio objetivo, solo se calcula el descuento necesario', 'info');
      return;
    }
    if (!canAddMoreDiscounts) {
      onShowToast(`Se alcanzó el límite de ${MAX_DISCOUNTS} descuentos`, 'warning');
      return;
    }
    discountStore.addDiscount(0);
    onShowToast('Descuento agregado correctamente', 'success');
  }
  
  discountStore.subscribe(state => {
    originalPrice = state.originalPrice;
    discounts = state.discounts;
    canAddMore = state.discounts.length < MAX_DISCOUNTS;
  });
  
  discountResults.subscribe(value => {
    results = value;
  });
  
  function handlePriceChange(value: any) {
    // Enviamos el valor tal cual, el store ahora es mucho más robusto parseando
    discountStore.setOriginalPrice(value);
  }
   
  function handleUpdateDiscount(id: number, percentage: number) {
    discountStore.updateDiscount(id, percentage);
  }
  
  function handleRemoveDiscount(id: number) {
    discountStore.removeDiscount(id);
  }
  
  function handleToggleDiscount(id: number) {
    discountStore.toggleDiscount(id);
  }
  
  function handleClear() {
    if (originalPrice > 0 || discounts.length > 0 || targetPrice > 0) {
      if (confirm('¿Limpiar todo el cálculo? Se perderán los datos no guardados.')) {
        discountStore.clearAll();
        targetPrice = 0;
        targetDisplayValue = '';
        onShowToast('Cálculo limpiado correctamente', 'success');
      }
    }
  }

  function handleOpenObservationModal(action: 'save' | 'share') {
    observationAction = action;
    showObservationModal = true;
  }

  function handleCloseObservationModal() {
    showObservationModal = false;
    clientCode = '';
    clientName = '';
    observation = '';
  }

  function handleConfirmObservation(data: { code: string; client: string; observation: string }) {
    clientCode = data.code;
    clientName = data.client;
    observation = data.observation;
    
    if (observationAction === 'save') {
      doSave();
    } else {
      doShare();
    }
    showObservationModal = false;
    clientCode = '';
    clientName = '';
    observation = '';
  }

  function doSave(alsoShare: boolean = false) {
    if (originalPrice <= 0) return;
    
    const activeDiscounts = discounts.filter(d => d.isActive);
    const discountLabels = activeDiscounts.map(d => `${d.percentage}%`).join(' - ');
    const historyItem = { 
      originalPrice, 
      discounts: activeDiscounts, 
      discountLabels,
      results, 
      clientCode,
      clientName,
      observation,
      targetPrice: targetPrice || null,
      requiredDiscount: requiredDiscount > 0 ? requiredDiscount : null,
      hasTargetPrice,
      timestamp: new Date().toISOString(),
      fromWSP: alsoShare
    };
    
     try {
       const history = JSON.parse(localStorage.getItem('g360-history-discount') || '[]');
       history.unshift(historyItem);
       localStorage.setItem('g360-history-discount', JSON.stringify(history.slice(0, 50)));
       
       if (!alsoShare) {
         discountStore.clearAll();
         targetPrice = 0;
         targetDisplayValue = '';
         onShowToast('Cálculo guardado en el historial', 'success');
       }
     } catch (e) {
       console.error('Error guardando historial de descuentos:', e);
       onShowToast('Error al guardar en historial', 'error');
     }
    
    if (alsoShare) {
      doShare();
    }
  }

   function doShare(alsoSave: boolean = true) {
     if (originalPrice <= 0) return;
     
     const now = new Date();
     const fecha = now.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
     const hora = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
     // Usar la constante de IGV para mayor precisión
     const finalConIGV = results.finalPrice * (1 + IVA_RATE);
     
     let message = `📊 *DESCUENTO REAL* - ${fecha}\n`;
     message += `─────────────────────\n`;
     
     if (clientCode) message += `🔢 Código: ${clientCode}\n`;
     if (clientName) message += `👤 Cliente: ${clientName}\n`;
     
     if (hasTargetPrice) {
       message += `💰 Precio orig: S/ ${originalPrice.toFixed(2)}\n`;
       message += `🎯 Precio objetivo: S/ ${targetPrice.toFixed(2)}\n`;
       message += `📉 *Dscto necesario: ${requiredDiscount.toFixed(1)}%*\n`;
       message += `─────────────────────\n`;
       message += `💵 *Final: S/ ${targetPrice.toFixed(2)}*\n`;
       message += `💵 c/IGV: S/ ${(targetPrice * (1 + IVA_RATE)).toFixed(2)}\n`;
     } else {
       const activeDiscounts = discounts.filter(d => d.isActive);
       const discountLabels = activeDiscounts.map(d => `${d.percentage}%`).join(' - ');
       message += `💰 Precio: S/ ${originalPrice.toFixed(2)}\n`;
       if (discountLabels) {
         message += `📉 Descuentos: ${discountLabels}\n`;
       }
       message += `─────────────────────\n`;
       message += `💵 *Final: S/ ${results.finalPrice.toFixed(2)}*\n`;
       message += `💵 c/IGV: S/ ${finalConIGV.toFixed(2)}\n`;
     }
    
    if (observation) {
      message += `📝 Obs: ${observation}\n`;
    }
    
    message += `─────────────────────\n`;
    message += `_G360 | ${hora}_`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onShowToast('Abriendo WhatsApp y guardando...', 'info');
    
    if (alsoSave) {
      doSave(false);
    }
  }

  function handleShowHistory() {
    showHistory = true;
  }

  function handleCloseHistory() {
    showHistory = false;
  }

  function calculateIgvAdd() {
    const val = parseFloat(igvModalValue) || 0;
    igvModalResult = val * (1 + IVA_RATE);
  }

  function calculateIgvRemove() {
    const val = parseFloat(igvModalValue) || 0;
    igvModalResult = val / (1 + IVA_RATE);
  }

  function copyIgvResult() {
    navigator.clipboard.writeText(igvModalResult.toFixed(4));
    onShowToast('Resultado copiado al portapapeles', 'success');
  }
</script>

<div class="discounts-page">
  <div class="header-section glass-card">
    <div class="inputs-grid">
      <div class="input-group full-width">
        <span class="input-label">💰 Precio Base Original (S/)</span>
        <PriceInput value={originalPrice} onChange={handlePriceChange} compact={true} />
      </div>
    </div>
  </div>
  
  {#if !hasTargetPrice}
  <div class="discounts-section glass-card">
    <div class="section-header">
      <h3>Descuentos Aplicados <span class="count">({discounts.length}/{MAX_DISCOUNTS})</span></h3>
    </div>
    
    <div class="discounts-list">
      {#if showDiscounts}
        {#each discounts as discount (discount.id)}
          <DiscountRow {discount} onUpdate={handleUpdateDiscount} onRemove={handleRemoveDiscount} onToggle={handleToggleDiscount} />
        {/each}
        {#if canAddMoreDiscounts}
          <button class="add-discount-row" on:click={handleAddDiscount}>
            <span class="add-icon">+</span>
            <span class="add-text">Agregar Descuento</span>
          </button>
        {/if}
        {#if discounts.length === 0 && !canAddMoreDiscounts}
          <div class="empty">Agrega tu primer descuento para comenzar</div>
        {/if}
      {:else}
        <div class="target-mode-indicator">
          <span class="indicator-icon">🎯</span>
          <span class="indicator-text">Modo Precio Objetivo</span>
          <span class="indicator-hint">El descuento se calcula automáticamente</span>
        </div>
      {/if}
    </div>
  </div>
  {/if}
   
  <ResultsCard results={results} hasDiscounts={$hasActiveDiscounts} hasTargetPrice={hasTargetPrice} targetPrice={hasTargetPrice ? targetPrice : 0} requiredDiscount={requiredDiscount} discounts={discounts} />

  <div class="target-section glass-card">
    <div class="target-header">
      <span class="target-icon">🎯</span>
      <span class="target-title">Precio Objetivo</span>
    </div>
    <div class="target-input-row">
      <div class="target-input-wrapper">
        <span class="currency-prefix">S/</span>
        <input 
          type="text"
          class="target-input"
          bind:value={targetDisplayValue}
          on:input={handleTargetInput}
          on:focus={handleTargetFocus}
          on:blur={handleTargetBlur}
          on:keydown={handleTargetKeyDown}
          inputmode="decimal"
          placeholder="S/ 0.00"
        />
      </div>
    </div>
    {#if requiredDiscount > 0}
      <div class="target-result">
        <span class="result-label">Descuento necesario:</span>
        <span class="result-value">{requiredDiscount.toFixed(2)}%</span>
      </div>
    {/if}
  </div>


  
  <ActionButtons {originalPrice} onClear={handleClear} onOpenObservationModal={handleOpenObservationModal} onShowHistory={handleShowHistory} {onShowToast} />

  <!-- Botón Flotante IGV -->
  <button class="igv-fab" on:click={() => showIgvModal = true}>
    <span class="fab-icon">🧮</span>
  </button>

  <!-- Modal Slide IGV -->
  {#if showIgvModal}
  <div class="igv-modal-overlay" on:click|self={() => showIgvModal = false}>
    <div class="igv-modal-panel" transition:fly={{ x: 400, duration: 250, easing: quadOut }}>
      <div class="igv-modal-header">
        <h3 class="igv-modal-title">Calculadora IGV</h3>
        <button class="igv-modal-close" on:click={() => showIgvModal = false}>✕</button>
      </div>

      <div class="igv-modal-content">
        <span class="igv-modal-label">Valor a calcular</span>
        <div class="igv-modal-input-wrapper">
          <span class="igv-modal-prefix">S/</span>
          <input 
            type="text" 
            class="igv-modal-input"
            bind:value={igvModalValue}
            inputmode="decimal"
            placeholder="0.00"
            on:input={() => {
              if(igvModalValue === '' || igvModalValue === '0') {
                igvModalResult = 0;
              }
            }}
            on:keydown={(e) => {
              if(e.key === 'Enter') calculateIgvRemove();
            }}
            autofocus
          />
        </div>

        <div class="igv-modal-buttons">
          <button class="igv-btn igv-btn-add" on:click={calculateIgvAdd}>
            ➕ Agregar IGV
          </button>
          <button class="igv-btn igv-btn-remove" on:click={calculateIgvRemove}>
            ➖ Quitar IGV
          </button>
        </div>

        {#if igvModalResult > 0}
        <div class="igv-modal-result">
          <span class="igv-modal-label">Resultado</span>
          <button type="button" class="igv-modal-result-value" on:click={copyIgvResult}>
            <span>{formatCurrency(igvModalResult, false)}</span>
            <span class="copy-hint">Click para copiar</span>
          </button>
        </div>
        {/if}
      </div>
    </div>
  </div>
  {/if}
  
  {#if showHistory}
    <HistoryModal onClose={handleCloseHistory} {onShowToast} />
  {/if}

  {#if showObservationModal}
    <ObservationModal 
      action={observationAction} 
      onClose={handleCloseObservationModal} 
      onConfirm={handleConfirmObservation}
      on:share={() => { doShare(false); discountStore.clearAll(); targetPrice = 0; targetDisplayValue = ''; showObservationModal = false; }}
    />
  {/if}
</div>

<style>
  .discounts-page { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.5rem; }
  
  .glass-card { padding: 0.6rem !important; margin-bottom: 0 !important; }
  
  .inputs-grid { display: flex; justify-content: center; width: 100%; }
  .input-group.full-width { width: 100%; max-width: 350px; }
  
.input-label { font-size: var(--font-xs); font-weight: var(--weight-extrabold); text-transform: uppercase; color: var(--theme-muted); margin-bottom: 0.25rem; display: block; }
  
  :global(.price-input-container.compact) {
    margin: 0;
  }
  
  :global(.price-input-container.compact .price-input) {
    padding: 0.75rem 0.75rem 0.75rem 2rem;
    font-size: var(--font-xl);
    font-weight: var(--weight-extrabold);
  }
  
  :global(.price-input-container.compact .currency-prefix) {
    font-size: var(--font-md);
  }


  .section-header h3 { font-size: var(--font-sm); margin: 0 0 0.5rem 0; font-weight: var(--weight-extrabold); text-transform: uppercase; }
  .section-header .count { color: var(--g360-accent); }

  .discounts-list { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 0.4rem; 
    max-height: 350px; 
    overflow-y: auto; 
    overflow-x: auto;
    padding: 0.3rem;
  }

  .empty { 
    grid-column: span 4; 
    text-align: center; 
    padding: 0.5rem; 
    font-size: var(--font-xs); 
    color: var(--theme-muted); 
  }

  @media (max-width: 640px) {
    .discounts-list { grid-template-columns: repeat(4, 1fr); }
    .empty { grid-column: span 4; }
  }

  @media (max-width: 400px) {
    .discounts-list { gap: 0.2rem; }
  }

  .add-discount-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.65rem 0.5rem;
    background: var(--theme-bg);
    border: 2px dashed var(--theme-border);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    min-height: 60px;
  }

  .add-discount-row:hover {
    border-color: var(--g360-accent);
    background: rgba(239, 68, 68, 0.05);
  }

  .add-icon {
    font-size: var(--font-xl);
    font-weight: var(--weight-extrabold);
    color: var(--g360-accent);
  }

  .add-text {
    font-size: var(--font-xs);
    color: var(--theme-muted);
    text-transform: uppercase;
  }

  .target-mode-indicator {
    grid-column: span 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(109, 40, 217, 0.05));
    border: 1px dashed rgba(139, 92, 246, 0.3);
    border-radius: 8px;
    text-align: center;
  }

  .indicator-icon {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }

  .indicator-text {
    font-size: 0.75rem;
    font-weight: 800;
    color: #8b5cf6;
    text-transform: uppercase;
  }

  .indicator-hint {
    font-size: 0.6rem;
    color: var(--theme-muted);
    margin-top: 0.25rem;
  }

  .target-section { padding: 0.6rem; }
  .observation-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--theme-border);
    border-radius: 8px;
    background: var(--theme-bg);
    color: var(--theme-text);
    font-size: 0.85rem;
    resize: none;
    font-family: inherit;
  }
  .observation-input:focus {
    outline: none;
    border-color: var(--g360-accent);
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
  }

  .target-section {
    padding: 0.6rem;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(109, 40, 217, 0.05));
    border: 1px solid rgba(139, 92, 246, 0.3);
  }

  .target-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
  }

  .target-icon { font-size: 1rem; }
  .target-title {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    color: #8b5cf6;
  }

  .target-input-row {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
  }

  .target-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
  }

  .target-input-wrapper .currency-prefix {
    position: absolute;
    left: 0.6rem;
    color: #8b5cf6;
    font-weight: 800;
    font-size: 0.85rem;
    pointer-events: none;
  }

  .target-input {
    width: 100%;
    padding: 0.6rem 0.6rem 0.6rem 1.8rem;
    border: 1px solid var(--theme-border);
    border-radius: 8px;
    background: var(--theme-bg);
    color: var(--theme-text);
    font-size: 1rem;
    font-weight: 800;
    text-align: right;
    font-family: var(--g360-font-mono, monospace);
  }

  .target-input:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
  }

  .target-input::placeholder {
    color: var(--theme-muted);
    opacity: 0.5;
  }

  .target-result {
    margin-top: 0.5rem;
    padding: 0.4rem;
    background: rgba(139, 92, 246, 0.15);
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .result-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--theme-muted);
  }

   .result-value {
     font-size: 1rem;
     font-weight: 800;
     color: var(--text-target);
   }

  /* Calculadora IGV Estilos */
  .igv-section {
    padding: 0.6rem;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
    border: 1px solid rgba(59, 130, 246, 0.3);
  }

  .igv-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
  }

  .igv-icon { font-size: 1rem; }
   .igv-title {
     font-size: 0.7rem;
     font-weight: 800;
     text-transform: uppercase;
     color: var(--text-info);
   }

  .igv-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
  }

  .igv-column {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .igv-label {
    font-size: 0.6rem;
    color: var(--theme-muted);
    font-weight: 700;
    text-transform: uppercase;
    text-align: left;
    letter-spacing: 0.5px;
  }

  .igv-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .igv-input-wrapper .igv-prefix {
    position: absolute;
    left: 0.6rem;
    color: #3b82f6;
    font-weight: 800;
    font-size: 0.85rem;
    pointer-events: none;
  }

  .igv-input {
    width: 100%;
    padding: 0.6rem 0.6rem 0.6rem 1.8rem;
    border: 1px solid var(--theme-border);
    border-radius: 8px;
    background: var(--theme-bg);
    color: var(--theme-text);
    font-size: 1rem;
    font-weight: 800;
    text-align: right;
    font-family: var(--g360-font-mono, monospace);
  }

  .igv-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  .igv-result {
    margin-top: 0.3rem;
    padding: 0.4rem;
    background: rgba(59, 130, 246, 0.15);
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .igv-result-label {
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--theme-muted);
  }

  .igv-result-value {
    font-size: 0.9rem;
    font-weight: 800;
    color: #3b82f6;
  }

  @media (max-width: 480px) {
    .igv-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Pestaña Lateral IGV para móviles */
   .igv-fab {
     position: fixed;
     right: 0;
     top: 45%;
     transform: translateY(-50%);
     width: 34px;
     height: 48px;
     border-radius: 10px 0 0 10px;
     border: none;
     background: linear-gradient(135deg, #3b82f6, #1d4ed8);
     color: white;
     font-size: 1.15rem;
     box-shadow: -2px 0 10px rgba(59, 130, 246, 0.45);
     cursor: pointer;
     z-index: 999;
     transition: all 0.2s ease;
     display: flex;
     align-items: center;
     justify-content: center;
     touch-action: manipulation;
     -webkit-tap-highlight-color: transparent;
     animation: igvPulse 4s ease-in-out infinite;
   }

  .igv-fab:active {
    transform: translateY(-50%) scale(0.95);
    width: 30px;
  }

   @keyframes igvPulse {
     0%, 100% { box-shadow: -2px 0 8px rgba(59, 130, 246, 0.35); }
     50% { box-shadow: -2px 0 12px rgba(59, 130, 246, 0.5); }
   }

  @media (min-width: 768px) {
    .igv-fab {
      bottom: 24px;
      right: 24px;
      top: auto;
      transform: none;
      width: 52px;
      height: 52px;
      border-radius: 14px;
      animation: none;
    }
    .igv-fab:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
    }
    .igv-fab:active {
      transform: scale(0.95);
      width: 52px;
    }
  }

  .igv-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background: rgba(0,0,0, 0.25);
    backdrop-filter: blur(2px);
  }

  .igv-modal-panel {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    width: 270px;
    height: auto;
    min-height: auto;
    background: var(--theme-bg);
    border: 1px solid var(--theme-border);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0, 0.25);
    padding: 1rem;
  }

  @media (max-width: 480px) {
    .igv-modal-panel {
      width: calc(100% - 24px);
      left: 12px;
      right: 12px;
    }
  }

  .igv-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--theme-border);
  }

  .igv-modal-title {
    font-size: 0.85rem;
    font-weight: 800;
    text-transform: uppercase;
    margin: 0;
    color: #3b82f6;
  }

  .igv-modal-close {
    background: none;
    border: none;
    color: var(--theme-muted);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.25rem;
  }

  .igv-modal-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .igv-modal-label {
    font-size: 0.65rem;
    color: var(--theme-muted);
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 0.3rem;
    display: block;
  }

  .igv-modal-input-wrapper {
    position: relative;
  }

  .igv-modal-prefix {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #3b82f6;
    font-weight: 800;
    font-size: 1rem;
    pointer-events: none;
  }

  .igv-modal-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid var(--theme-border);
    border-radius: 12px;
    background: var(--theme-surface);
    color: var(--theme-text);
    font-size: 1.2rem;
    font-weight: 800;
    text-align: right;
    font-family: var(--g360-font-mono, monospace);
    box-sizing: border-box;
  }

  .igv-modal-input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .igv-modal-buttons {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .igv-btn {
    flex: 1;
    padding: 0.85rem 0.5rem;
    border: none;
    border-radius: 10px;
    font-weight: 800;
    font-size: 0.7rem;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .igv-btn-add {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
    border: 2px solid rgba(34, 197, 94, 0.3);
  }

  .igv-btn-add:hover {
    background: rgba(34, 197, 94, 0.25);
    transform: translateY(-1px);
  }

  .igv-btn-remove {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border: 2px solid rgba(239, 68, 68, 0.3);
  }

  .igv-btn-remove:hover {
    background: rgba(239, 68, 68, 0.25);
    transform: translateY(-1px);
  }

  .igv-modal-result {
    margin-top: 0.5rem;
    padding: 1rem;
    background: rgba(59, 130, 246, 0.1);
    border-radius: 12px;
    border: 2px solid rgba(59, 130, 246, 0.3);
  }

   .igv-modal-result-value {
     font-size: 1.4rem;
     font-weight: 800;
     text-align: center;
     color: var(--text-igv);
     cursor: pointer;
     font-family: var(--g360-font-mono, monospace);
     display: flex;
     flex-direction: column;
     gap: 0.25rem;
   }

  .copy-hint {
    font-size: 0.55rem;
    color: var(--theme-muted);
    font-weight: 600;
    opacity: 0.7;
    text-transform: uppercase;
  }

  @media (max-width: 480px) {
    .igv-modal-panel {
      width: 100%;
    }
  }
</style>
