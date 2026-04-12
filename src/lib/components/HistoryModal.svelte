<script lang="ts">
  import type { HistoryItem } from '../types';
  import { CURRENCY_SYMBOL } from '../types';
  import { shareDiscountHistory, copyHistoryToClipboard, generateDiscountHistoryText, generateWhatsAppURL, copyToClipboard } from '../utils/sharing';

  export let onClose: () => void;
  export let onShowToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;

  let history: HistoryItem[] = [];
  let filteredHistory: HistoryItem[] = [];
  let expandedItem: string | null = null;
  let searchQuery = '';
  let showFilters = false;
  let selectedItems: Set<string> = new Set();
  let selectMode = false;

  function loadHistory() {
    try {
      const stored = localStorage.getItem('g360-history-discount');
      if (stored) {
        history = JSON.parse(stored);
        filteredHistory = history;
      }
    } catch (e) {
      history = [];
      filteredHistory = [];
    }
  }

  $: filteredHistory = searchQuery 
    ? history.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
          item.clientName?.toLowerCase().includes(query) ||
          item.clientCode?.toLowerCase().includes(query) ||
          item.observation?.toLowerCase().includes(query)
        );
      })
    : history;

  loadHistory();

  function formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function toggleExpand(timestamp: string) {
    if (expandedItem === timestamp) {
      expandedItem = null;
    } else {
      expandedItem = timestamp;
    }
  }

  function toggleSelect(timestamp: string) {
    if (selectedItems.has(timestamp)) {
      selectedItems.delete(timestamp);
    } else {
      selectedItems.add(timestamp);
    }
    selectedItems = selectedItems;
  }

  function handleItemClick(timestamp: string) {
    if (selectMode) {
      return;
    }
    toggleExpand(timestamp);
  }

  function toggleSelectMode() {
    selectMode = !selectMode;
    if (!selectMode) {
      selectedItems.clear();
      selectedItems = selectedItems;
    }
  }

  function handleDelete(item: HistoryItem, event: MouseEvent) {
    event.stopPropagation();
    try {
      history = history.filter(h => h.timestamp !== item.timestamp);
      filteredHistory = filteredHistory.filter(h => h.timestamp !== item.timestamp);
      localStorage.setItem('g360-history-discount', JSON.stringify(history));
      onShowToast('Registro eliminado', 'success');
    } catch (e) {
      onShowToast('Error al eliminar', 'error');
    }
  }

  function handleClearAll(event: MouseEvent) {
    if (history.length === 0) return;
    if (confirm('¿Eliminar todo el historial?')) {
      localStorage.removeItem('g360-history-discount');
      history = [];
      filteredHistory = [];
      onShowToast('Historial eliminado', 'success');
    }
  }

  function generateSingleItemText(item: HistoryItem): string {
    const date = new Date(item.timestamp);
    const dateStr = date.toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const code = item.clientCode ? `${item.clientCode} | ` : '';
    const client = item.clientName || '';
    const finalPrice = item.targetPrice 
      ? item.targetPrice.toFixed(2)
      : item.results?.finalPrice?.toFixed(2) || '0.00';
    const original = item.originalPrice.toFixed(2);
    const obs = item.observation ? `\n📝 ${item.observation}` : '';
    
    let text = `[${dateStr}] ${code}${client}\n`;
    text += `💰 ${original} → ${finalPrice}${obs}\n`;
    return text;
  }

  function handleShareSelected() {
    if (selectedItems.size === 0) {
      onShowToast('Selecciona al menos 1 registro', 'warning');
      return;
    }

    const now = new Date();
    const exportDate = now.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let text = `📋 G360 - Selección de Descuentos\n`;
    text += `Exportado: ${exportDate}\n`;
    text += `══════════════════════════════════════\n\n`;

    const selected = history.filter(h => selectedItems.has(h.timestamp));
    selected.forEach((item, index) => {
      text += generateSingleItemText(item);
      if (index < selected.length - 1) {
        text += `────────��───────────────────────\n\n`;
      }
    });

    text += `\n────────────────────────────────\n`;
    text += `Total: ${selected.length} registro${selected.length > 1 ? 's' : ''}\n`;
    text += `G360 | g360-discount-calculator`;

    const url = generateWhatsAppURL(text);
    window.open(url, '_blank');
    onShowToast('Abriendo WhatsApp...', 'info');
    
    selectMode = false;
    selectedItems = new Set();
  }

  function handleCopySelected() {
    if (selectedItems.size === 0) {
      onShowToast('Selecciona al menos 1 registro', 'warning');
      return;
    }

    const selected = history.filter(h => selectedItems.has(h.timestamp));
    let text = '';
    
    selected.forEach((item, index) => {
      text += generateSingleItemText(item);
      if (index < selected.length - 1) {
        text += `\n────────────────────────────────\n\n`;
      }
    });

    copyToClipboard(text);
    onShowToast('Copiado al portapapeles', 'success');
    
    selectMode = false;
    selectedItems = new Set();
  }

  function handleShareHistory() {
    try {
      shareDiscountHistory(history);
      onShowToast('Abriendo WhatsApp...', 'info');
    } catch (e) {
      onShowToast('Error al compartir', 'error');
    }
  }

  function handleCopyHistory() {
    try {
      copyHistoryToClipboard(history);
      onShowToast('Copiado al portapapeles', 'success');
    } catch (e) {
      onShowToast('Error al copiar', 'error');
    }
  }
</script>

<div class="modal-overlay" on:click={onClose} on:keydown={(e) => e.key === 'Escape' && onClose()} role="button" tabindex="0">
  <div class="modal-content" on:click|stopPropagation role="dialog" aria-modal="true">
    <div class="modal-header">
      <h2>📋 Historial de Cálculos</h2>
      <button class="close-btn" on:click={onClose} aria-label="Cerrar">✕</button>
    </div>

    {#if history.length > 0}
      <div class="history-actions">
        <button class="action-btn select-btn" class:active={selectMode} on:click={toggleSelectMode}>
          {selectMode ? '✅ Seleccionar' : '☐ Seleccionar'}
        </button>
        {#if selectMode}
          <button class="action-btn share-btn" on:click={handleShareSelected} disabled={selectedItems.size === 0}>
            💬 Compartir ({selectedItems.size})
          </button>
          <button class="action-btn copy-btn" on:click={handleCopySelected} disabled={selectedItems.size === 0}>
            📋 Copiar ({selectedItems.size})
          </button>
        {:else}
          <button class="action-btn share-btn" on:click={handleShareHistory}>💬 Todo</button>
          <button class="action-btn copy-btn" on:click={handleCopyHistory}>📋 Todo</button>
        {/if}
      </div>
      
      <div class="search-box">
        <input 
          type="text"
          class="search-input"
          placeholder="🔍 Buscar por cliente, código o nota..."
          bind:value={searchQuery}
        />
        {#if searchQuery}
          <span class="search-count">{filteredHistory.length} de {history.length}</span>
        {/if}
      </div>
    {/if}

    <div class="history-list">
      {#if filteredHistory.length === 0}
        {#if history.length === 0}
          <div class="empty">No hay registros guardados</div>
        {:else}
          <div class="empty">Sin resultados para "{searchQuery}"</div>
        {/if}
      {:else}
        {#each filteredHistory as item (item.timestamp)}
          <div 
            class="history-item"
            class:selected={selectMode && selectedItems.has(item.timestamp)}
            class:expanded={expandedItem === item.timestamp}
            on:click={() => selectMode ? toggleSelect(item.timestamp) : handleItemClick(item.timestamp)}
            on:keydown={(e) => e.key === 'Enter' && (selectMode ? toggleSelect(item.timestamp) : handleItemClick(item.timestamp))}
            role="button"
            tabindex="0"
          >
            <div class="item-summary">
              <div class="summary-left">
                {#if item.clientCode}
                  <span class="client-code">{item.clientCode}</span>
                {/if}
                {#if item.clientName}
                  <span class="client-name">👤 {item.clientName}</span>
                {/if}
                <span class="item-date">{formatDate(item.timestamp)}</span>
              </div>
              <div class="summary-right">
                <div class="price-with-igv">
                  <span class="item-price-net">{CURRENCY_SYMBOL} {item.targetPrice ? item.targetPrice.toFixed(2) : item.results?.finalPrice?.toFixed(2)}</span>
                  <span class="item-price-igv">({CURRENCY_SYMBOL}{((item.targetPrice || item.results?.finalPrice) * 1.18)?.toFixed(2)})</span>
                </div>
                <span class="expand-icon">{expandedItem === item.timestamp ? '▲' : '▼'}</span>
              </div>
            </div>
            
            {#if expandedItem === item.timestamp}
              <div class="item-details">
                {#if item.hasTargetPrice}
                  <div class="detail-row highlight">
                    <span class="label">🎯 Precio Objetivo:</span>
                    <span class="value">{CURRENCY_SYMBOL} {item.targetPrice?.toFixed(2)}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">💰 Precio Original:</span>
                    <span class="value">{CURRENCY_SYMBOL} {item.originalPrice.toFixed(2)}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">📉 Descuento:</span>
                    <span class="value highlight">{item.requiredDiscount?.toFixed(1)}%</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">💵 c/IGV (18%):</span>
                    <span class="value igv">{CURRENCY_SYMBOL} {((item.targetPrice ?? 0) * 1.18).toFixed(2)}</span>
                  </div>
                {:else}
                  <div class="detail-row">
                    <span class="label">💰 Precio Original:</span>
                    <span class="value">{CURRENCY_SYMBOL} {item.originalPrice.toFixed(2)}</span>
                  </div>
                  {#if item.discountLabels}
                    <div class="detail-row">
                      <span class="label">📉 Descuentos:</span>
                      <span class="value">{item.discountLabels}</span>
                    </div>
                  {/if}
                  <div class="detail-row">
                    <span class="label">💵 Precio Final:</span>
                    <span class="value highlight">{CURRENCY_SYMBOL} {item.results?.finalPrice?.toFixed(2)}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">💵 c/IGV (18%):</span>
                    <span class="value igv">{CURRENCY_SYMBOL} {(item.results?.finalPrice * 1.18)?.toFixed(2)}</span>
                  </div>
                {/if}
                {#if item.observation}
                  <div class="detail-row observation">
                    <span class="label">📝 Observaciones:</span>
                    <span class="value">{item.observation}</span>
                  </div>
                {/if}
                <button class="delete-btn-inline" on:click={(e) => handleDelete(item, e)}>🗑️ Eliminar</button>
              </div>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    background: var(--theme-surface);
    border-radius: 16px;
    width: 100%;
    max-width: 450px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--theme-border);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--theme-border);
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1rem;
    color: var(--theme-text);
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--theme-muted);
    padding: 0.25rem;
  }

  .modal-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(139, 92, 246, 0.1);
    border-bottom: 1px solid var(--theme-border);
    font-size: 0.75rem;
    color: var(--theme-muted);
  }

  .info-icon { font-size: 1rem; }

  .clear-all-btn {
    margin: 0.5rem 1rem;
    padding: 0.4rem 0.8rem;
    background: var(--theme-bg);
    border: 1px solid var(--danger-color);
    color: var(--danger-color);
    border-radius: 6px;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .empty {
    text-align: center;
    padding: 2rem;
    color: var(--theme-muted);
    font-size: 0.9rem;
  }

.history-item {
    background: var(--theme-bg);
    border: 1px solid var(--theme-border);
    border-radius: 12px;
    margin-bottom: 0.6rem;
    padding: 0.85rem;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .history-item:hover {
    border-color: var(--g360-accent);
  }

  .history-item.selected {
    border-color: var(--g360-accent);
    background: rgba(0, 208, 132, 0.08);
  }

  .history-item.selected::before {
    content: '✓';
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    background: var(--g360-accent);
    color: var(--g360-bg);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--weight-extrabold);
    font-size: var(--font-sm);
  }

  .history-item.expanded {
    border-color: var(--g360-accent);
    box-shadow: 0 0 10px rgba(0, 208,132, 0.15);
  }

  .history-item:hover {
    border-color: var(--g360-accent);
  }

  .history-item.expanded {
    border-color: var(--g360-accent);
    box-shadow: 0 0 10px rgba(0, 208, 132, 0.15);
  }

  .item-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem;
  }

  .summary-left {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
  }

  .client-code {
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--g360-accent);
    background: rgba(0, 208, 132, 0.1);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
  }

  .client-name {
    font-size: 0.85rem;
    color: var(--theme-text);
    font-weight: 600;
  }

  .item-date {
    font-size: 0.7rem;
    color: var(--theme-muted);
    width: 100%;
    margin-top: 0.2rem;
  }

  .summary-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .price-with-igv {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.1;
  }

  .item-price-net {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--g360-accent);
  }

  .item-price-igv {
    font-size: 0.75rem;
    color: var(--g360-neon-purple);
    font-weight: 600;
  }

  .expand-icon {
    font-size: 0.8rem;
    color: var(--theme-muted);
  }

  .item-details {
    padding: 1rem;
    border-top: 2px dashed var(--theme-border);
    background: var(--theme-surface);
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    font-size: 0.9rem;
  }

  .detail-row.highlight {
    background: rgba(139, 92, 246, 0.1);
    padding: 0.4rem;
    border-radius: 6px;
    margin-bottom: 0.25rem;
  }

  .detail-row .label {
    color: var(--theme-muted);
    font-weight: 600;
  }

  .detail-row .value {
    color: var(--theme-text);
    font-weight: 600;
  }

  .detail-row .value.highlight {
    color: var(--g360-accent);
    font-weight: 800;
  }

  .detail-row .value.igv {
    color: var(--g360-neon-purple);
    font-weight: 600;
  }

  .detail-row.observation {
    flex-direction: column;
    gap: 0.25rem;
    padding-top: 0.5rem;
    margin-top: 0.25rem;
    border-top: 1px dashed var(--theme-border);
  }

  .detail-row.observation .value {
    white-space: pre-wrap;
    line-height: 1.3;
    font-style: normal;
  }

.delete-btn-inline {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.4rem;
    background: transparent;
    border: 1px solid var(--danger-color);
    color: var(--danger-color);
    border-radius: 6px;
    font-size: 0.7rem;
    cursor: pointer;
  }

  .history-actions {
    display: flex;
    gap: 0.35rem;
    padding: 0 1rem;
    margin-bottom: 0.5rem;
  }

  .history-actions .action-btn {
    flex: 1;
    padding: 0.5rem;
    border: none;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 700;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .select-btn {
    background: var(--theme-surface);
    border: 1px solid var(--theme-border);
    color: var(--theme-text);
  }

  .select-btn.active {
    background: var(--g360-accent);
    color: var(--g360-bg);
  }

  .share-btn {
    background: linear-gradient(135deg, #25d366, #128c7e);
    color: white;
  }

  .copy-btn {
    background: var(--theme-surface);
    border: 1px solid var(--theme-border);
    color: var(--theme-text);
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1rem;
    margin-bottom: 0.5rem;
  }

  .search-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--theme-border);
    border-radius: 8px;
    background: var(--theme-bg);
    color: var(--theme-text);
    font-size: 0.8rem;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--g360-accent);
  }

  .search-count {
    font-size: 0.65rem;
    color: var(--theme-muted);
    white-space: nowrap;
  }
</style>