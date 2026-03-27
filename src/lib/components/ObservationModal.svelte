<script lang="ts">
  import { onMount } from 'svelte';
  import { hapticSelect, hapticSuccess } from '../utils/haptics';

  export let action: 'save' | 'share' = 'save';
  export let onClose: () => void;
  export let onConfirm: (data: { code: string; client: string; observation: string }) => void;

  let code = '';
  let client = '';
  let observation = '';
  let inputRef: HTMLTextAreaElement;

  function handleSubmit() {
    hapticSuccess();
    onConfirm({ code, client, observation });
  }

  function handleClose() {
    hapticSelect();
    onClose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }

  onMount(() => {
    setTimeout(() => inputRef?.focus(), 100);
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="modal-overlay" on:click={handleClose} on:keydown={handleKeydown} role="button" tabindex="0">
  <div class="modal-content" on:click|stopPropagation on:keydown={handleKeydown} role="dialog" aria-modal="true">
    <div class="modal-header">
      <h2>{action === 'save' ? '💾 Guardar Cálculo' : '💬 Compartir por WhatsApp'}</h2>
      <button class="close-btn" on:click={handleClose} aria-label="Cerrar">✕</button>
    </div>

    <div class="modal-body">
      <div class="input-row">
        <div class="input-group">
          <label class="input-label" for="code">🔢 Código</label>
          <input 
            id="code"
            type="text"
            class="text-input"
            bind:value={code}
            placeholder="Ej: ORD-001"
          />
        </div>
        <div class="input-group">
          <label class="input-label" for="client">👤 Cliente</label>
          <input 
            id="client"
            type="text"
            class="text-input"
            bind:value={client}
            placeholder="Ej: Pepe"
          />
        </div>
      </div>
      
      <label class="input-label" for="observation">📝 Observaciones (producto, notas)</label>
      <textarea 
        id="observation"
        class="observation-input"
        bind:this={inputRef}
        bind:value={observation}
        placeholder="Ej:&#10;Producto: Pelota semideportiva&#10;Nota: Precio acordado especial"
        rows="3"
      ></textarea>
      <p class="hint">Guarda los datos del acuerdo para consultarlos después</p>
    </div>

    <div class="modal-footer">
      <button class="cancel-btn" on:click={handleClose}>Cancelar</button>
      <button class="confirm-btn" on:click={handleSubmit}>
        {action === 'save' ? '💾 Guardar' : '💬 Enviar'}
      </button>
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
    max-width: 400px;
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
    font-size: 1.15rem;
    color: var(--theme-text);
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;
    color: var(--theme-muted);
    padding: 0.25rem;
    min-width: 44px;
    min-height: 44px;
  }

  .modal-body {
    padding: 1rem;
  }

  .input-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .input-group {
    flex: 1;
  }

  .input-label {
    font-size: 0.85rem;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--theme-muted);
    margin-bottom: 0.25rem;
    display: block;
  }

  .text-input {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid var(--theme-border);
    border-radius: 8px;
    background: var(--theme-bg);
    color: var(--theme-text);
    font-size: 1rem;
    font-family: inherit;
    min-height: 44px;
  }

  .text-input:focus {
    outline: none;
    border-color: var(--g360-accent);
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
  }

  .observation-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--theme-border);
    border-radius: 8px;
    background: var(--theme-bg);
    color: var(--theme-text);
    font-size: 1rem;
    resize: vertical;
    font-family: inherit;
    min-height: 90px;
    line-height: 1.4;
  }

  .observation-input:focus {
    outline: none;
    border-color: var(--g360-accent);
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
  }

  .hint {
    font-size: 0.7rem;
    color: var(--theme-muted);
    margin-top: 0.5rem;
  }

  .modal-footer {
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid var(--theme-border);
  }

  .cancel-btn {
    flex: 1;
    padding: 0.85rem;
    background: var(--theme-bg);
    border: 1px solid var(--theme-border);
    border-radius: 8px;
    color: var(--theme-text);
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    min-height: 48px;
  }

  .confirm-btn {
    flex: 1;
    padding: 0.85rem;
    background: linear-gradient(135deg, var(--g360-accent), #b91c1c);
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    min-height: 48px;
  }
</style>