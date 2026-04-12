<script lang="ts">
  import { onMount } from 'svelte';
  import { initTheme } from './lib/stores/theme';
  import Header from './lib/components/Header.svelte';
  import BottomNavigation from './lib/components/BottomNavigation.svelte';
  import DiscountsPage from './lib/components/DiscountsPage.svelte';
  import PricingPage from './lib/components/PricingPage.svelte';
  import G360Signature from './lib/components/G360Signature.svelte';
  import Toast from './lib/components/Toast.svelte';
  
  // Estado de la página actual
  let currentPage: 'home' | 'pricing' = 'home';
  
  // Estado del toast
  let showToast = false;
  let toastMessage = '';
  let toastType: 'success' | 'error' | 'info' | 'warning' = 'info';
  
  // Inicializar tema al montar
  onMount(() => {
    initTheme();
  });
  
  // Función para cambiar de página
  function navigateTo(page: 'home' | 'pricing') {
    currentPage = page;
  }
  
  // Función para mostrar toast
  function showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    toastMessage = message;
    toastType = type;
    showToast = true;

    setTimeout(() => {
      showToast = false;
    }, 3000);
  }
  
  // Función para cerrar toast
  function closeToast() {
    showToast = false;
  }
</script>

<div class="app-container">
  <Header {currentPage} onNavigate={navigateTo} />
  
  <main class="main-content">
    {#if currentPage === 'home'}
      <DiscountsPage onShowToast={showNotification} />
    {:else if currentPage === 'pricing'}
      <PricingPage onShowToast={showNotification} />
    {/if}
  </main>

  <BottomNavigation {currentPage} onNavigate={navigateTo} />

  <G360Signature />
  
  {#if showToast}
    <Toast message={toastMessage} type={toastType} onClose={closeToast} />
  {/if}
</div>

<style>
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .main-content {
    flex: 1;
    padding: 1rem;
    padding-top: 80px; /* Espacio para header fijo */
    padding-bottom: 120px; /* Espacio para bottom nav y signature */
  }
  
  .page-container {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .page-subtitle {
    color: var(--theme-muted);
    margin-bottom: 2rem;
    font-size: 1rem;
  }
  
  .coming-soon {
    padding: 3rem 2rem;
    text-align: center;
  }
  
  .coming-soon-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .coming-soon h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--g360-accent);
  }
  
  .coming-soon p {
    color: var(--theme-muted);
    line-height: 1.6;
  }
  
  /* Responsive */
  @media (max-width: 575px) {
    .main-content {
      padding: 0.75rem;
      padding-top: 70px;
      padding-bottom: 100px;
    }
    
    .page-title {
      font-size: 1.5rem;
    }
    
    .coming-soon {
      padding: 2rem 1rem;
    }
    
    .coming-soon-icon {
      font-size: 3rem;
    }
  }
</style>