<script lang="ts">
  import { getContext } from 'svelte';
  import DiscountsPage from '../lib/components/DiscountsPage.svelte';
  
  // Obtener función de toast del layout
  const showToast = getContext('showToast') as (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
</script>

<svelte:head>
  <title>G360 Descuentos - Calculadora de Descuentos Consecutivos</title>
  <meta name="description" content="Calcula descuentos consecutivos de forma rápida y precisa con IVA peruano" />
</svelte:head>

<DiscountsPage onShowToast={showToast} />