<script lang="ts">
  import type { ToastType } from '../types';
  
  export let message: string = '';
  export let type: ToastType = 'info';
  export let onClose: () => void;
  
  // Iconos según tipo
  const icons: Record<ToastType, string> = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };
  
  function handleClose() {
    onClose();
  }
</script>

<div class="toast {type}" role="alert">
  <span class="toast-icon">{icons[type]}</span>
  <span class="toast-message">{message}</span>
  <button class="toast-close" on:click={handleClose} aria-label="Cerrar">
    ✕
  </button>
</div>

<style>
  .toast {
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 10px 16px;
    color: var(--theme-text);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideUp 0.3s ease-out;
    max-width: 90%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .toast.success {
    border-color: var(--success-color);
  }
  
  .toast.error {
    border-color: var(--danger-color);
  }
  
  .toast.info {
    border-color: var(--info-color);
  }
  
  .toast.warning {
    border-color: var(--warning-color);
  }
  
  .toast-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }
  
  .toast-message {
    flex: 1;
    font-size: 0.75rem;
    line-height: 1.4;
  }
  
  .toast-close {
    background: transparent;
    border: none;
    color: var(--theme-muted);
    cursor: pointer;
    padding: 0.25rem;
    font-size: 0.75rem;
    line-height: 1;
    transition: color var(--transition-fast);
    flex-shrink: 0;
  }
  
  .toast-close:hover {
    color: var(--theme-text);
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  /* Responsive */
  @media (max-width: 575px) {
    .toast {
      bottom: 50px;
      left: 10px;
      right: 10px;
      transform: none;
      max-width: none;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
</style>