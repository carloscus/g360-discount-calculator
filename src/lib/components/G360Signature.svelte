<script lang="ts">
  import { isDarkMode } from '../stores/theme';
  
  // Signature simplificada
  const badgeText = 'powered by G360';
</script>

<div class="g360-signature" class:dark={$isDarkMode}>
  <div class="signature-content">
    <div class="g360-dot"></div>
    <span class="badge">{badgeText}</span>
  </div>
</div>

<style>
  .g360-signature {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 100;
    opacity: 0.6;
    transition: all var(--transition-normal);
    pointer-events: auto;
  }
  
  .g360-signature:hover {
    opacity: 1;
    transform: translateY(-2px);
  }
  
  .signature-content {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 8px;
    font-family: var(--g360-font-mono, monospace);
    color: var(--theme-muted);
    letter-spacing: 0.5px;
    padding: 4px 10px;
    border-radius: 16px;
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    box-shadow: var(--neon-glow);
    text-transform: uppercase;
  }
  
  .g360-dot {
    width: 5px;
    height: 5px;
    background: var(--g360-accent);
    border-radius: 50%;
    box-shadow: 0 0 6px var(--g360-accent);
    animation: pulse 2s infinite;
  }
  
  .badge {
    font-weight: 800;
    color: var(--theme-text);
  }
  
  .engine {
    font-weight: 500;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
      box-shadow: 0 0 8px var(--g360-accent);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.2);
      box-shadow: 0 0 12px var(--g360-accent);
    }
  }
  
  /* Responsive */
  @media (max-width: 575px) {
    .g360-signature {
      bottom: 16px;
      right: 16px;
    }

    .signature-content {
      font-size: 8px;
      padding: 4px 10px;
      gap: 5px;
    }
  }
</style>