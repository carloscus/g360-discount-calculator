<script lang="ts">
  import { getContext } from 'svelte';
  import PricingPage from '../../lib/components/PricingPage.svelte';
  
  // Obtener función de toast del layout
  const showToast = getContext('showToast') as (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
</script>

<svelte:head>
  <title>Cálculo de Precio - Descuento Real</title>
  <meta name="description" content="Calcula precios de venta desde costo con margen, markup e IVA peruano" />
</svelte:head>

<PricingPage onShowToast={showToast} />