<script lang="ts">
  export let originalPrice: number;
  export let onClear: () => void;
  export let onOpenObservationModal: (action: 'save' | 'share') => void;
  export let onShowHistory: () => void;
  export let onShowToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;

  let isSaving = false;
  let isSharing = false;

  function handleClear() {
    onClear();
  }

  async function handleSave() {
    if (originalPrice <= 0) {
      onShowToast('Ingresa un precio para guardar', 'warning');
      return;
    }
    isSaving = true;
    await new Promise(r => setTimeout(r, 300));
    onOpenObservationModal('save');
    isSaving = false;
  }

  async function handleShare() {
    if (originalPrice <= 0) {
      onShowToast('No hay resultados para compartir', 'warning');
      return;
    }
    isSharing = true;
    await new Promise(r => setTimeout(r, 300));
    onOpenObservationModal('share');
    isSharing = false;
  }

  function handleShowHistory() {
    onShowHistory();
  }
</script>

<div class="action-buttons-grid">
  <button 
    class="action-btn clear-btn"
    on:click={handleClear}
    aria-label="Limpiar todo"
  >
    <span class="btn-icon">🗑️</span>
    <span class="btn-text">Limpiar</span>
  </button>

  <button 
    class="action-btn whatsapp-btn"
    class:loading={isSharing}
    on:click={handleShare}
    disabled={originalPrice <= 0 || isSharing}
    aria-label="Compartir por WhatsApp"
  >
    {#if isSharing}
      <span class="spinner"></span>
    {:else}
      <span class="btn-icon">💬</span>
    {/if}
    <span class="btn-text">WhatsApp</span>
  </button>

  <button 
    class="action-btn save-btn"
    class:loading={isSaving}
    on:click={handleSave}
    disabled={originalPrice <= 0 || isSaving}
    aria-label="Guardar cálculo"
  >
    {#if isSaving}
      <span class="spinner"></span>
    {:else}
      <span class="btn-icon">💾</span>
    {/if}
    <span class="btn-text">Guardar</span>
  </button>

  <button 
    class="action-btn history-btn"
    on:click={handleShowHistory}
    aria-label="Ver historial"
  >
    <span class="btn-icon">📋</span>
    <span class="btn-text">Historial</span>
  </button>
</div>

<style>
  .action-buttons-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.3rem;
    margin-top: 0.5rem;
    width: 100%;
  }
  
  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.5rem 0.3rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all var(--transition-normal);
    font-weight: 700;
    min-height: 48px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.75rem;
  }
  
  .btn-icon {
    font-size: 1rem;
  }

  .btn-text {
    white-space: nowrap;
  }
  
  .clear-btn {
    background: var(--theme-surface);
    border: 2px solid var(--theme-border);
    color: var(--theme-text);
  }
  
  .clear-btn:hover:not(:disabled) {
    background: var(--glass-bg);
    border-color: var(--danger-color);
    color: var(--danger-color);
  }

  .whatsapp-btn {
    background: linear-gradient(135deg, #25d366, #128c7e);
    border: none;
    color: white;
  }
  
  .whatsapp-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #128c7e, #075e54);
  }

  .whatsapp-btn:disabled {
    opacity: 0.5;
  }

  .save-btn {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border: none;
    color: white;
  }
  
  .save-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #1d4ed8, #1e3a8a);
  }

  .save-btn:disabled {
    opacity: 0.5;
  }
  
  .history-btn {
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
    border: none;
    color: white;
  }
  
  .history-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #6d28d9, #5b21b6);
  }

  .loading {
    pointer-events: none;
    opacity: 0.8;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 400px) {
    .btn-text { display: none; }
    .btn-icon { font-size: 1.1rem; }
  }
</style>