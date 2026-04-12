<script lang="ts">
  import { formatCurrency, parseNumber } from '../utils/formatting';
  
  export let value: number = 0;
  export let onChange: (value: number) => void;
  export let compact: boolean = false;
  export let error: string = '';
  export let hint: string = '';
  
  // Estado local para el input
  let isFocused = false;
  let displayValue: string = value > 0 ? formatCurrency(value) : '';
  
  // Sincronizar displayValue cuando el value cambie externamente (pero no si estamos editando)
  $: if (!isFocused) {
    displayValue = value > 0 ? formatCurrency(value) : '';
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value;
    
    // Limpiar entrada (solo números y punto)
    const cleaned = rawValue.replace(/[^\d.]/g, '');
    const parsed = parseNumber(cleaned);
    
    displayValue = rawValue; // Permitir escritura limpia
    onChange(parsed);
  }
  
  function handleFocus(event: FocusEvent) {
    isFocused = true;
    displayValue = value > 0 ? value.toString() : '';
    
    const target = event.target as HTMLInputElement;
    setTimeout(() => target.select(), 0);
  }
  
  function handleBlur() {
    isFocused = false;
    // Formatear con 2 decimales al perder foco
    if (value > 0) {
      displayValue = formatCurrency(value);
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

<div class="price-input-container" class:compact class:has-error={error}>
  {#if !compact}
    <label class="input-label">
      <span class="label-icon">💰</span>
      <span class="label-text">Precio (Neto)</span>
    </label>
  {/if}
  
  <div class="input-wrapper">
    <span class="currency-prefix">S/</span>
    <input
      type="text"
      class="price-input"
      placeholder="S/ 0.00"
      bind:value={displayValue}
      on:input={handleInput}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:keydown={handleKeyDown}
      inputmode="decimal"
      aria-invalid={!!error}
      aria-describedby={error ? 'price-error' : hint ? 'price-hint' : undefined}
    />
  </div>
  
  {#if error}
    <span class="input-error" id="price-error" role="alert">{error}</span>
  {:else if hint}
    <span class="input-hint" id="price-hint">{hint}</span>
  {/if}
</div>

<style>
  .price-input-container {
    padding: 1rem;
    margin-bottom: 0.75rem;
    background: transparent;
  }

  .price-input-container.compact {
    padding: 0;
    margin-bottom: 0;
  }
  
  .input-label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.4rem;
    font-weight: 700;
    color: var(--theme-text);
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.5px;
  }
  
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .currency-prefix {
    position: absolute;
    left: 0.75rem;
    color: var(--g360-accent);
    font-weight: 700;
    font-size: 0.9rem;
    pointer-events: none;
  }
  
  .price-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    font-size: var(--font-xl);
    font-weight: var(--weight-bold);
    text-align: right;
    background: var(--theme-surface);
    border: 1.5px solid var(--theme-border);
    border-radius: 12px;
    color: var(--theme-text);
    transition: all var(--transition-fast);
    font-family: var(--g360-font-mono, monospace);
    outline: none;
    min-height: var(--height-xl);
  }

  .compact .price-input {
    padding: 0.6rem 0.8rem 0.6rem 2rem;
    font-size: var(--font-lg);
    min-height: var(--height-md);
  }

  .price-input {
    min-height: var(--height-xl);
  }

  .compact .price-input {
    min-height: var(--height-md);
  }

  .compact .currency-prefix {
    left: 0.6rem;
    font-size: var(--font-sm);
  }
  
  .price-input:focus {
    border-color: var(--g360-accent);
    box-shadow: var(--neon-glow);
  }

  .has-error .price-input {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
  }

  .has-error .currency-prefix {
    color: #ef4444;
  }

  .input-error {
    display: block;
    margin-top: 0.35rem;
    font-size: 0.7rem;
    color: #ef4444;
    font-weight: 600;
  }

  .input-hint {
    display: block;
    margin-top: 0.35rem;
    font-size: 0.65rem;
    color: var(--theme-muted);
  }

  @media (max-width: 480px) {
    .price-input-container { padding: 0.75rem; margin-bottom: 0.5rem; }
    .price-input { font-size: 1.1rem; padding: 0.65rem 0.8rem 0.65rem 2.2rem; min-height: 48px; }
    .input-label { font-size: 0.65rem; }
    .currency-prefix { left: 0.65rem; font-size: 0.85rem; }
  }
</style>