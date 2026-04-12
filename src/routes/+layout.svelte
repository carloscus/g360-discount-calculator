<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { initTheme } from '../lib/stores/theme';
  import Header from '../lib/components/Header.svelte';
  import BottomNavigation from '../lib/components/BottomNavigation.svelte';
  import G360Signature from '../lib/components/G360Signature.svelte';
  import Toast from '../lib/components/Toast.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  // Estado del toast
  let showToast = false;
  let toastMessage = '';
  let toastType: 'success' | 'error' | 'info' | 'warning' = 'info';
  
  // Inicializar tema al montar
  onMount(() => {
    initTheme();
  });
  
  // Determinar página actual basada en la ruta
  let currentPage: 'home' | 'pricing' = 'home';
  $: currentPage = $page.url.pathname === '/pricing' ? 'pricing' : 'home';

  function navigateTo(page: 'home' | 'pricing') {
    goto(page === 'pricing' ? '/pricing' : '/');
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
  
  // Exponer función de toast para las páginas hijas
  import { setContext } from 'svelte';
  setContext('showToast', showNotification as (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void);
</script>

<div class="app-container">
  <!-- Efecto Backlight G360 -->
  <div class="g360-backlight"></div>
  
  <Header {currentPage} />

  <main class="main-content">
    <slot />
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
    position: relative;
    overflow-x: hidden;
    background: var(--theme-bg);
    transition: background var(--transition-slow);
  }
  
  .g360-backlight {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100vw;
    height: 100vh;
    background: var(--backlight-accent);
    pointer-events: none;
    z-index: 0;
    opacity: 0.8;
  }
  
  .main-content {
    flex: 1;
    padding: 0.5rem;
    padding-top: 70px;
    padding-bottom: 5px;
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 575px) {
    .main-content {
      padding: 0.25rem;
      padding-top: 65px;
      padding-bottom: 5px;
    }
  }

  @media (max-height: 500px) {
    .main-content {
      padding-top: 55px;
      padding-bottom: 4px;
    }
  }

  @media (max-height: 400px) {
    .main-content {
      padding-top: 50px;
      padding-bottom: 2px;
    }
  }

</style>