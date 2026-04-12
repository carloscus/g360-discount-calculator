/**
 * G360 Skill Client - Configuración unificada para proyectos de terceros (Powered by G360)
 * 
 * @description Skill maestro para clientes. Permite alternar entre contextos de uso
 * (Desktop/PC o Mobile/Order) manteniendo la misma identidad visual "Powered by G360".
 * 
 * VERSIÓN 3.1: Incluye características de pedidos (anteriormente en g360-skill-order.js)
 * 
 * @skill client
 * @variant desktop | mobile
 * @author Carlos Cusi (CCUSI)
 * @version 3.1.0
 * @updated 2026-03-21
 * 
 * @example
 * // Uso en proyecto cliente para PC
 * import { getClientSkill } from '@assets/engine/g360-skill-client.js';
 * export const G360_CONFIG = { ...getClientSkill('desktop'), branding: { ... } };
 * 
 * // Uso en proyecto cliente para móvil con pedidos
 * import { getClientSkill } from '@assets/engine/g360-skill-client.js';
 * export const G360_CONFIG = { ...getClientSkill('mobile'), branding: { ... } };
 */

export const getClientSkill = (context = 'desktop') => {
  const isMobile = context === 'mobile';

  return {
    skill: 'client',
    context: context, // 'desktop' o 'mobile'
    
    // Identidad Base G360 (Inmutable)
    author: 'Carlos Cusi',
    signature: 'CCUSI',
    brand: 'G360',
    colors: {
      bg: isMobile ? '#f8fafc' : '#0b1220',
      surface: isMobile ? '#ffffff' : '#151e2e',
      accent: isMobile ? '#008f5d' : '#00d084',
      text: isMobile ? '#1f2937' : '#f0f4f8',
      muted: isMobile ? '#6b7280' : '#94a3b8'
    },

    // Tema claro/oscuro
    theme: {
      darkMode: true,
      lightMode: true,
      defaultTheme: isMobile ? 'light' : 'dark',
      toggle: true,
      colors: {
        dark: {
          bg: '#0b1220',
          surface: '#151e2e',
          accent: '#00d084',
          text: '#f0f4f8',
          muted: '#94a3b8'
        },
        light: {
          bg: isMobile ? '#f8fafc' : '#ffffff',
          surface: isMobile ? '#ffffff' : '#f8fafc',
          accent: isMobile ? '#008f5d' : '#00d084',
          text: '#1f2937',
          muted: '#6b7280'
        }
      }
    },

    effects: {
      glassmorphism: true,
      blur: '16px',
      glow: !isMobile,
      rounded: isMobile ? '20px' : '16px'
    },

    // Layout Adaptativo según contexto
    layout: {
      sidebar: isMobile ? '0px' : '280px',
      navigation: isMobile ? 'bottom-bar' : 'sidebar',
      asymmetry: !isMobile,
      mobileFirst: isMobile,
      floatingUI: isMobile,
      responsive: true
    },

    // Branding Configurable (Powered by G360)
    branding: {
      clientName: '[CLIENT_NAME]',
      appTitle: '[APP_TITLE]',
      clientLogoFile: '/assets/brand/logo.svg',       // Ruta estándar G360
      clientFavicon: '/assets/brand/favicon.ico',    // Ruta estándar G360
      g360Badge: 'powered by G360',
      g360Logo: '/assets/engine/logo-g360.svg',      // Ruta estándar G360
      g360Position: isMobile ? 'footer' : 'header-secondary',
      signatureText: 'Engine by Carlos Cusi (CCUSI)'
    },

    // Módulos Funcionales (Habilitar según necesidad)
    features: {
      darkMode: true,
      themeToggle: true,
      responsiveDesign: true,
      glassmorphism: true,
      orderManagement: isMobile, // Activo por defecto en móvil
      inventoryControl: true,
      analytics: !isMobile,      // Activo por defecto en PC
      offlineSupport: false,
      mobileNavigation: isMobile,
      productSearch: true,
      cartManagement: isMobile,
      orderExport: isMobile,
      clientDataModal: isMobile,
      stockValidation: isMobile,
      categoryFilters: isMobile,
      floatingActions: isMobile,
      modalStateManagement: isMobile,
      floatingPanelAutoHide: isMobile
    },

    // Configuración específica para pedidos (contexto mobile)
    order: isMobile ? {
      enableStockBypass: false,
      exportFormats: ['xlsx', 'whatsapp', 'email'],
      maxProducts: 100,
      sharing: {
        universalMode: true,      // Funciona en localhost y producción
        autoDownload: true,       // Descarga automática antes de compartir
        fallbackMessages: true,   // Mensajes instructivos cuando no hay adjuntos directos
        excelDisclaimer: true     // Incluye nota de precios referenciales en Excel
      },
      pricing: {
        referentialPrices: true,  // Precios sin descuentos ni IGV
        showDisclaimer: true,     // Mostrar disclaimer en UI
        excelFooterNote: true     // Nota en pie de Excel
      },
      validation: {
        requireRUC: true,         // Requerir RUC del cliente
        requireClientData: true,  // Requerir datos del cliente
        stockCheck: true          // Verificar stock disponible
      },
      ux: {
        loadingStates: true,          // Indicadores de carga en botones
        modalStateSync: true,         // Estados sincronizados entre modales
        floatingPanelSmartHide: true  // Panel se oculta durante modales
      }
    } : null // No aplica en contexto desktop
  };
};
