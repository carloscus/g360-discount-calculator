<script lang="ts">
  import { hapticSelect, hapticSuccess, hapticWarning } from '../utils/haptics';
  
  export let originalPrice: number;
  export let onClear: () => void;
  export let onOpenObservationModal: (action: 'save' | 'share') => void;
  export let onShowHistory: () => void;
  export let onShowToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;

  function handleClear() {
    hapticSelect();
    onClear();
  }

  function handleSave() {
    if (originalPrice <= 0) {
      hapticWarning();
      onShowToast('Ingresa un precio para guardar', 'warning');
      return;
    }
    hapticSelect();
    onOpenObservationModal('save');
  }

  function handleShare() {
    if (originalPrice <= 0) {
      hapticWarning();
      onShowToast('No hay resultados para compartir', 'warning');
      return;
    }
    hapticSelect();
    onOpenObservationModal('share');
  }

  function handleShowHistory() {
    hapticSelect();
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
    on:click={handleShare}
    disabled={originalPrice <= 0}
    aria-label="Compartir por WhatsApp"
  >
    <span class="btn-icon">💬</span>
    <span class="btn-text">WhatsApp</span>
  </button>

  <button 
    class="action-btn save-btn"
    on:click={handleSave}
    disabled={originalPrice <= 0}
    aria-label="Guardar cálculo"
  >
    <span class="btn-icon">💾</span>
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
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 0.3rem !important;
    margin-top: 0.5rem !important;
    width: 100% !important;
  }
  
  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.6rem 0.4rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all var(--transition-normal);
    font-weight: 700;
    min-height: 54px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.8rem;
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

  @media (max-width: 400px) {
    .btn-text { display: none; }
    .btn-icon { font-size: 1.4rem; }
    .action-btn { min-height: 52px; }
  }
</style>