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
  import { hapticSelect, hapticSuccess, hapticWarning } from '../utils/haptics';
  
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
      hapticWarning();
      onShowToast('Con precio objetivo, solo se calcula el descuento necesario', 'info');
      return;
    }
    if (!canAddMoreDiscounts) {
      hapticWarning();
      onShowToast(`Máximo ${MAX_DISCOUNTS} descuentos permitidos`, 'warning');
      return;
    }
    hapticSuccess();
    discountStore.addDiscount(0);
    onShowToast('Descuento agregado', 'success');
  }
  
  discountStore.subscribe(state => {
    originalPrice = state.originalPrice;
    discounts = state.discounts;
    canAddMore = state.discounts.length < MAX_DISCOUNTS;
  });
  
  discountResults.subscribe(value => {
    results = value;
  });
  
  function handlePriceChange(price: number) {
    discountStore.setOriginalPrice(price);
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
        onShowToast('Campos limpiados', 'success');
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

  function doSave() {
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
      timestamp: new Date().toISOString() 
    };
    try {
      const history = JSON.parse(localStorage.getItem('g360-history-discount') || '[]');
      history.unshift(historyItem);
      localStorage.setItem('g360-history-discount', JSON.stringify(history.slice(0, 50)));
      
      discountStore.clearAll();
      targetPrice = 0;
      targetDisplayValue = '';
      
      onShowToast('Guardado en historial', 'success');
    } catch (e) {}
  }

  function doShare() {
    if (originalPrice <= 0) return;
    
    const now = new Date();
    const fecha = now.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
    const hora = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const finalConIGV = results.finalPrice * 1.18;
    
    let message = `💰 *CALCULO DE DESCUENTO* 💰\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    if (clientCode) message += `📋 Codigo: ${clientCode}\n`;
    if (clientName) message += `👤 Cliente: ${clientName}\n`;
    
    if (hasTargetPrice) {
      message += `💵 Precio Original: S/ ${originalPrice.toFixed(2)}\n`;
      message += `🎯 Precio Objetivo: S/ ${targetPrice.toFixed(2)}\n`;
      message += `📉 *DESCUENTO REQ: ${requiredDiscount.toFixed(1)}%*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `✅ *PRECIO FINAL: S/ ${targetPrice.toFixed(2)}*\n`;
      message += `🧾 + IGV (18%): S/ ${(targetPrice * 1.18).toFixed(2)}\n`;
    } else {
      const activeDiscounts = discounts.filter(d => d.isActive);
      const discountLabels = activeDiscounts.map(d => `${d.percentage}%`).join(' + ');
      message += `💵 Precio Inicial: S/ ${originalPrice.toFixed(2)}\n`;
      if (discountLabels) {
        message += `📉 Descuentos: ${discountLabels}\n`;
      }
      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `✅ *PRECIO FINAL: S/ ${results.finalPrice.toFixed(2)}*\n`;
      message += `🧾 + IGV (18%): S/ ${finalConIGV.toFixed(2)}\n`;
    }
    
    if (observation) {
      message += `📝 Nota: ${observation}\n`;
    }
    
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🔗 G360 Calculator | ${hora}`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onShowToast('Abriendo WhatsApp...', 'info');
  }

  function handleShowHistory() {
    showHistory = true;
  }

  function handleCloseHistory() {
    showHistory = false;
  }
</script>

<div class="discounts-page">
  <div class="header-section glass-card">
    <div class="inputs-grid">
      <div class="input-group full-width">
        <label class="input-label">💰 Precio Original (S/)</label>
        <PriceInput value={originalPrice} onChange={handlePriceChange} compact={true} />
      </div>
    </div>
  </div>
  
  <div class="discounts-section glass-card">
    <div class="section-header">
      <h3>Descuentos <span class="count">({discounts.length})</span></h3>
    </div>
    
    <div class="discounts-list">
      {#if showDiscounts}
        {#each discounts as discount (discount.id)}
          <DiscountRow {discount} onUpdate={handleUpdateDiscount} onRemove={handleRemoveDiscount} onToggle={handleToggleDiscount} />
        {/each}
        {#if canAddMoreDiscounts}
          <button class="add-discount-row" on:click={handleAddDiscount}>
            <span class="add-icon">+</span>
            <span class="add-text">Agregar</span>
          </button>
        {/if}
        {#if discounts.length === 0 && !canAddMoreDiscounts}
          <div class="empty">Sin descuentos</div>
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
   
  <ResultsCard {results} hasDiscounts={$hasActiveDiscounts} {hasTargetPrice} targetPrice={hasTargetPrice ? targetPrice : 0} {requiredDiscount} />

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
        <span class="result-value">{requiredDiscount.toFixed(1)}%</span>
      </div>
    {/if}
  </div>
  
  <ActionButtons {originalPrice} onClear={handleClear} onOpenObservationModal={handleOpenObservationModal} onShowHistory={handleShowHistory} {onShowToast} />
  
  {#if showHistory}
    <HistoryModal onClose={handleCloseHistory} {onShowToast} />
  {/if}

  {#if showObservationModal}
    <ObservationModal 
      action={observationAction} 
      onClose={handleCloseObservationModal} 
      onConfirm={handleConfirmObservation} 
    />
  {/if}
</div>

<style>
  .discounts-page { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.5rem; }
  
  .glass-card { padding: 0.6rem !important; margin-bottom: 0 !important; }
  
  .inputs-grid { display: flex; justify-content: center; width: 100%; }
  .input-group.full-width { width: 100%; max-width: 350px; }
  
  .input-label { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: var(--theme-muted); margin-bottom: 0.25rem; display: block; }
  
  :global(.price-input-container.compact) {
    margin: 0;
  }
  
  :global(.price-input-container.compact .price-input) {
    padding: 0.75rem 0.75rem 0.75rem 2rem;
    font-size: 1.25rem;
    font-weight: 800;
  }
  
  :global(.price-input-container.compact .currency-prefix) {
    font-size: 1rem;
  }
  
  .add-discount-btn { 
    width: 100%; height: 38px; background: var(--g360-accent); color: var(--g360-bg); 
    border: none; border-radius: 8px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase;
  }

  .section-header h3 { font-size: 0.9rem; margin: 0 0 0.5rem 0; font-weight: 800; text-transform: uppercase; }
  .section-header .count { color: var(--g360-accent); }

  .discounts-list { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr) !important; 
    gap: 0.3rem; 
    max-height: 300px; 
    overflow-y: auto; 
    padding: 0.25rem;
  }

  .empty { 
    grid-column: span 4; 
    text-align: center; 
    padding: 0.5rem; 
    font-size: 0.7rem; 
    color: var(--theme-muted); 
  }

  @media (max-width: 640px) {
    .discounts-list { grid-template-columns: repeat(4, 1fr) !important; }
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
    padding: 0.5rem;
    background: var(--theme-bg);
    border: 2px dashed var(--theme-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .add-discount-row:hover {
    border-color: var(--g360-accent);
    background: rgba(239, 68, 68, 0.05);
  }

  .add-icon {
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--g360-accent);
  }

  .add-text {
    font-size: 0.75rem;
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
    font-size: 0.85rem;
    font-weight: 800;
    color: #8b5cf6;
    text-transform: uppercase;
  }

  .indicator-hint {
    font-size: 0.75rem;
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

  .target-icon { font-size: 1.2rem; }
  .target-title {
    font-size: 0.85rem;
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
    color: #8b5cf6;
  }
</style>