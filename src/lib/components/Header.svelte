<script lang="ts">
  import { themeStore, toggleTheme, isDarkMode } from '../stores/theme';
  import type { Page } from '../types';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  export let currentPage: Page = 'home';
  export let onNavigate: ((page: Page) => void) | undefined = undefined;
  
  // Estado reactivo del tema
  let darkMode = false;
  
  // Suscribirse al store de tema
  themeStore.subscribe(value => {
    darkMode = value === 'dark';
  });
  
  function handleThemeToggle() {
    toggleTheme();
  }
  
  function handleNavigation(page: Page) {
    if (onNavigate) {
      onNavigate(page);
    } else {
      goto(page === 'pricing' ? '/pricing' : '/');
    }
  }
</script>

<header class="header glass-card">
  <div class="header-content">
    <!-- Logo y Título -->
    <div class="logo-section">
      <div class="logo-wrapper">
        <div class="logo-backlight"></div>
        <img 
          src={darkMode ? `${base}/logo-g360.svg` : `${base}/logo-g360-light.svg`} 
          alt="G360 Logo" 
          class="logo"
        />
      </div>
      <div class="title-section">
        <h1 class="app-title neon-text">G360 Descuentos</h1>
        <p class="app-subtitle">Calculadora de descuentos consecutivos</p>
      </div>
    </div>
    
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

    <!-- Botón de Tema -->
    <button 
      class="theme-btn"
      on:click={handleThemeToggle}
      aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={darkMode ? 'Modo claro' : 'Modo oscuro'}
    >
      <span class="theme-icon">{darkMode ? '☀️' : '🌙'}</span>
    </button>
  </div>
</header>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 0.75rem 1rem;
    border-radius: 0;
    border-top: none;
    border-left: none;
    border-right: none;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    gap: 1rem;
    position: relative;
  }
  
  .logo-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .logo-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-backlight {
    position: absolute;
    width: 80%;
    height: 80%;
    background: var(--g360-accent);
    filter: blur(15px);
    opacity: 0.3;
    border-radius: 50%;
    z-index: -1;
    animation: pulse-backlight 3s infinite ease-in-out;
  }

  @keyframes pulse-backlight {
    0%, 100% { transform: scale(1); opacity: 0.2; }
    50% { transform: scale(1.2); opacity: 0.4; }
  }
  
  .logo {
    width: 120px;
    height: 30px;
    transition: all var(--transition-normal);
    position: relative;
    z-index: 1;
  }
  
  .logo:hover {
    transform: scale(1.05);
  }
  
  .title-section {
    display: flex;
    flex-direction: column;
  }
  
  .app-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
  }
  
  .app-subtitle {
    font-size: 0.7rem;
    color: var(--theme-muted);
    margin: 0;
    line-height: 1.2;
  }
  
  .navigation {
    display: flex;
    gap: 0.5rem;
    margin-left: auto;
  }

  /* Desktop: mostrar navegación en header */
  @media (min-width: 576px) {
    .navigation {
      display: flex;
    }
  }

  /* Mobile: ocultar, usar BottomNavigation */
  @media (max-width: 575px) {
    .navigation {
      display: none;
    }
  }

  .theme-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 50%;
    cursor: pointer;
    transition: all var(--transition-fast);
    flex-shrink: 0;
  }

  .theme-btn:hover {
    background: var(--g360-accent);
    border-color: var(--g360-accent);
    transform: scale(1.1);
  }

  .theme-icon {
    font-size: 1.1rem;
    line-height: 1;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 10px;
    color: var(--theme-muted);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: 0.8rem;
    font-weight: 600;
    min-height: 40px;
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

  /* Responsive */
  @media (min-width: 576px) {
    .app-title {
      font-size: 1.25rem;
    }
    
    .app-subtitle {
      font-size: 0.8rem;
    }
  }
  
  @media (max-width: 575px) {
    .logo {
      width: 100px;
      height: 25px;
    }
  }
  
  @media (max-width: 400px) {
    .header-content {
      flex-wrap: wrap;
    }
    
    .logo-section {
      order: 1;
    }
    
    .navigation {
      order: 2;
      width: 100%;
      justify-content: center;
      margin-top: 0.5rem;
    }
    
    .theme-btn {
      order: 3;
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
    }
    
    .nav-btn {
      padding: 0.3rem 0.6rem;
    }
  }

  @media (max-height: 500px) {
    .header {
      padding: 0.3rem 0.5rem;
    }
    .logo-section {
      transform: scale(0.85);
    }
    .logo-img {
      height: 22px;
    }
    .theme-btn {
      width: 30px;
      height: 30px;
    }
  }

  @media (max-height: 400px) {
    .header {
      padding: 0.25rem 0.4rem;
    }
    .logo-section {
      transform: scale(0.7);
    }
    .logo-img {
      height: 18px;
    }
    .theme-btn {
      width: 26px;
      height: 26px;
    }
  }
</style>