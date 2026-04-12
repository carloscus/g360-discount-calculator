<script lang="ts">
  import type { PricingMode } from '../types';
  
  export let value: PricingMode;
  export let onChange: (mode: PricingMode) => void;
  
  const options: { value: PricingMode; label: string; icon: string }[] = [
    { value: 'margin', label: 'Margen', icon: '📊' },
    { value: 'markup', label: 'Markup', icon: '📈' },
    { value: 'cost-price', label: 'Costo+Venta', icon: '💰' }
  ];
</script>

<div class="segmented-capsule glass-card">
  {#each options as option}
    <button 
      class="capsule-btn"
      class:active={value === option.value}
      on:click={() => onChange(option.value)}
      aria-pressed={value === option.value}
    >
      <span class="btn-icon">{option.icon}</span>
      <span class="btn-label">{option.label}</span>
    </button>
  {/each}
</div>

<style>
  .segmented-capsule {
    display: flex;
    padding: 0.25rem !important;
    gap: 0.25rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    margin-bottom: 1rem;
    border: 1px solid var(--theme-border);
  }
  
  .capsule-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.5rem 0.25rem;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--theme-muted);
    font-weight: 800;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 36px;
    text-transform: uppercase;
    font-size: 0.65rem;
    letter-spacing: 0.3px;
  }
  
  .capsule-btn:hover:not(.active) {
    color: var(--theme-text);
    background: rgba(255, 255, 255, 0.05);
  }
  
  .capsule-btn.active {
    background: var(--g360-accent);
    color: var(--g360-bg);
    box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3);
  }
  
  .btn-icon {
    font-size: 0.85rem;
  }
  
  .btn-label {
    white-space: nowrap;
  }
  
  /* Responsive extra para 390px */
  @media (max-width: 400px) {
    .btn-label {
      font-size: 0.6rem;
    }
    .btn-icon {
      display: none; /* Ocultar iconos en pantallas muy pequeñas para priorizar texto */
    }
    .capsule-btn {
      gap: 0;
    }
  }
</style>