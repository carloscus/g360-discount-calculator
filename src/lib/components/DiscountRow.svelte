<script lang="ts">
  import type { Discount } from '../types';
  import { formatPercentage, parsePercentage } from '../utils/formatting';
  
  export let discount: Discount;
  export let onUpdate: (id: number, percentage: number) => void;
  export let onRemove: (id: number) => void;
  export let onToggle: (id: number) => void;
  
  $: hasError = discount.percentage > 100;
  
  // Estado local
  let isEditing = false;
  let displayValue = discount.percentage > 0 ? formatPercentage(discount.percentage) : '0.00%';
  
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value;
    const cleaned = rawValue.replace(/[^\d.]/g, '');
    const parsed = parsePercentage(cleaned);
    const limited = Math.min(parsed, 100);
    onUpdate(discount.id, limited);
  }
  
  function handleFocus(event: FocusEvent) {
    isEditing = true;
    displayValue = discount.percentage > 0 ? discount.percentage.toString() : '';
    // Seleccionar todo el texto para reemplazo rápido
    const input = event.target as HTMLInputElement;
    setTimeout(() => input.select(), 0);
  }
  
  function handleBlur() {
    isEditing = false;
    // Formatear con 2 decimales al perder foco
    if (discount.percentage > 0) {
      displayValue = formatPercentage(discount.percentage);
    } else {
      displayValue = '';
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    }
  }
</script>

<div class="minimal-tile" class:active={discount.isActive} class:inactive={!discount.isActive} class:has-error={hasError}>
  {#if hasError}
    <span class="error-badge" role="alert">Excede 100%</span>
  {/if}
  
  <!-- Botón eliminar (Solo visible en hover) -->
  <button class="remove-overlay" on:click={() => onRemove(discount.id)} aria-label="Eliminar">
    ✕
  </button>

  <!-- Toggle de estado (Área de clic pequeña) -->
  <button class="status-indicator" on:click={() => onToggle(discount.id)} aria-label="Cambiar estado">
    <div class="dot"></div>
  </button>

  <!-- Input principal -->
  <div class="input-container">
    <input
      type="text"
      class="discount-input"
      bind:value={displayValue}
      on:input={handleInput}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:keydown={handleKeyDown}
      inputmode="decimal"
      disabled={!discount.isActive}
      aria-invalid={hasError}
    />
  </div>
</div>

<style>
.minimal-tile {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    padding: 0.25rem;
    transition: all 0.2s ease;
    height: var(--height-lg);
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .minimal-tile.active {
    border-color: var(--g360-accent);
    box-shadow: 0 0 10px rgba(0, 208, 132, 0.15);
  }

  .minimal-tile.inactive {
    opacity: 0.6;
    filter: grayscale(1);
  }

  .minimal-tile.has-error {
    border-color: #ef4444;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.25);
  }

  .error-badge {
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    background: #ef4444;
    color: white;
    font-size: 0.55rem;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 4px;
    z-index: 20;
    white-space: nowrap;
  }

  /* Botón Eliminar Oculto */
  .remove-overlay {
    position: absolute;
    top: -2px;
    right: -2px;
    background: var(--danger-color);
    color: white;
    border: none;
    width: 18px;
    height: 18px;
    border-radius: 0 0 0 6px;
    font-size: 0.6rem;
    cursor: pointer;
    display: none;
    z-index: 10;
    align-items: center;
    justify-content: center;
  }

  .minimal-tile:hover .remove-overlay {
    display: flex;
  }

  /* Indicador de Estado */
  .status-indicator {
    background: transparent;
    border: none;
    padding: 0 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--theme-muted);
    transition: all 0.2s ease;
  }

  .active .dot {
    background: var(--g360-accent);
    box-shadow: 0 0 5px var(--g360-accent);
  }

  /* Input */
  .input-container {
    flex: 1;
    height: 100%;
  }

  .discount-input {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    text-align: right;
    padding-right: 4px;
    color: var(--theme-text);
    font-family: var(--g360-font-mono, monospace);
    font-size: var(--font-md);
    font-weight: 800;
    outline: none;
  }

  .discount-input:disabled {
    cursor: not-allowed;
  }

  /* Responsive 390px (3 columnas ya manejado por el padre) */
  @media (max-width: 400px) {
    .discount-input {
      font-size: var(--font-sm);
    }
  }
</style>