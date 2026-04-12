<script lang="ts">
  import type { Page } from '../types';

  export let currentPage: Page = 'home';
  export let onNavigate: ((page: Page) => void) | undefined = undefined;

  function handleNavigation(page: Page) {
    if (onNavigate) {
      onNavigate(page);
    }
  }
</script>

<div class="bottom-nav glass-card">
  <div class="nav-content">
    <!-- Navegación -->
    <nav class="navigation">
      <button
        class="nav-btn {currentPage === 'home' ? 'active' : ''}"
        on:click={() => handleNavigation('home')}
      >
        <span class="nav-icon">💰</span>
        <span class="nav-text">Descuentos</span>
      </button>

      <button
        class="nav-btn {currentPage === 'pricing' ? 'active' : ''}"
        on:click={() => handleNavigation('pricing')}
      >
        <span class="nav-icon">📊</span>
        <span class="nav-text">Pricing</span>
      </button>
    </nav>

  </div>
</div>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 0.6rem 0.75rem;
    border-radius: 0;
    border-top: 1px solid var(--theme-border);
    border-left: none;
    border-right: none;
    border-bottom: none;
  }

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    gap: 1rem;
  }

  .navigation {
    display: flex;
    gap: 0.5rem;
    flex: 1;
    justify-content: center;
  }

  .nav-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    padding: 0.6rem 1.25rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 12px;
    color: var(--theme-muted);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 90px;
    min-height: 48px;
  }

  .nav-btn:hover {
    background: var(--glass-bg);
    color: var(--g360-accent);
    border-color: var(--glass-border);
  }

  .nav-btn.active {
    background: var(--g360-accent);
    color: white;
    border-color: var(--g360-accent);
    box-shadow: var(--neon-glow);
  }

  .nav-icon {
    font-size: 1.1rem;
  }
  
  .nav-text {
    font-size: 0.7rem;
    font-weight: 600;
    line-height: 1;
  }

  /* Desktop */
  @media (min-width: 576px) {
    .bottom-nav {
      display: none;
    }
  }

  /* Short screens */
  @media (max-height: 500px) {
    .bottom-nav {
      padding: 0.25rem;
    }
    .nav-btn {
      min-height: 40px;
      padding: 0.25rem;
    }
    .nav-icon {
      font-size: 0.9rem;
    }
    .nav-text {
      font-size: 0.6rem;
    }
  }

  @media (max-height: 400px) {
    .bottom-nav {
      padding: 0.2rem;
    }
    .nav-btn {
      min-height: 36px;
      padding: 0.2rem;
    }
    .nav-icon {
      font-size: 0.8rem;
    }
    .nav-text {
      display: none;
    }
  }
</style>