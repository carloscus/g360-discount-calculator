# G360 Discount Calculator

## 📊 Descripción

**G360 Discount Calculator** es una aplicación web profesional desarrollada para calcular descuentos consecutivos y precios de venta con márgenes/markup. Forma parte del ecosistema G360 y está construida con **SvelteKit + TypeScript + Tailwind CSS v4**.

### Propósito

Esta herramienta permite a usuarios del área comercial y ventas calcular rápidamente:
- El descuento efectivo al aplicar múltiples descuentos en cadena
- El precio de venta óptimo basado en margen o markup
- El descuento requerido para alcanzar un precio objetivo
- Precios finales con inclusión de IGV (18%)

---

## 🚀 Características Principales

### ✨ Descuentos Consecutivos
- Hasta **8 descuentos** simultáneos en cadena
- Cálculo del descuento efectivo real (compuesto)
- Simulación de descuentos sin precio base
- Visualización en tiempo real del descuento acumulado

### 💰 Cálculo de Precios
- **Modo Margen**: Calcula precio desde margen bruto deseado
- **Modo Markup**: Calcula precio desde markup deseado
- **Modo Directo**: Ingresa costo y precio de venta directamente

### 🎯 Precio Objetivo
- Calcula automáticamente el descuento necesario para alcanzar un precio objetivo
- Ideal para negociaciones comerciales

### 💾 Persistencia y Historial
- Guardado automático en localStorage
- Historial de hasta 50 registros
- Datos del cliente: código, nombre, observaciones
- Exportación por WhatsApp

### 📱 Experiencia de Usuario
- Diseño responsive optimizado para móvil (390px) y desktop
- **Optimizado 90% móvil / 10% PC**
- Tema oscuro/claro con efectos glassmorphism y neón
- **PWA** - Instalable como aplicación nativa (APK)
- **Safe Area** - Compatible con notch iOS y Android
- **Haptic Feedback** - Vibración al interacturar (móvil)
- Interfaz táctil optimizada con botones grandes y textos legibles

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| SvelteKit | 2.x | Framework web |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | v4 | Estilos utility-first |
| Vite | 6.x | Build tool |
| TypeScript | 5.x | Lenguaje |

---

## 📁 Estructura del Proyecto

```
g360-discount-calculator/
├── src/
│   ├── lib/
│   │   ├── components/        # Componentes Svelte
│   │   │   ├── Header.svelte
│   │   │   ├── G360Signature.svelte
│   │   │   ├── Toast.svelte
│   │   │   ├── DiscountsPage.svelte
│   │   │   ├── PricingPage.svelte
│   │   │   ├── PriceInput.svelte
│   │   │   ├── DiscountRow.svelte
│   │   │   ├── ResultsCard.svelte
│   │   │   ├── ActionButtons.svelte
│   │   │   ├── HistoryModal.svelte
│   │   │   ├── ObservationModal.svelte
│   │   │   ├── SegmentedControl.svelte
│   │   │   ├── BottomNavigation.svelte
│   │   │   └── PricingResults.svelte
│   │   ├── stores/            # Estado reactivo
│   │   │   ├── theme.ts       # Control de tema
│   │   │   ├── discounts.ts   # Estado de descuentos
│   │   │   └── pricing.ts     # Estado de pricing
│   │   ├── utils/             # Funciones utilitarias
│   │   │   ├── calculations.ts  # Cálculos matemáticos
│   │   │   ├── formatting.ts    # Formateo de valores
│   │   │   ├── sharing.ts       # Compartir/WhatsApp
│   │   │   └── haptics.ts       # Vibración/tactil feedback
│   │   └── types/             # Definiciones TypeScript
│   │       └── index.ts
│   ├── routes/                # Rutas SvelteKit
│   ├── main.ts                # Punto de entrada
│   ├── app.html               # Template HTML
│   └── app.css                # Estilos globales
├── static/                    # Recursos estáticos
│   ├── logo-g360.svg
│   ├── logo-g360-light.svg
│   ├── favicon.svg
│   ├── icon-192.png
│   └── manifest.json          # PWA manifest
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── README.md
```

---

## 🧩 Arquitectura

### Stores de Estado

El proyecto utiliza **Svelte stores** para gestionar el estado reactivo:

```typescript
// Descuentos
discountStore          // Store principal de descuentos
discountResults        // Resultados calculados
hasActiveDiscounts     // Boolean: hay descuentos activos
simpleDiscountSum      // Suma simple de descuentos

// Pricing
pricingStore           // Store de pricing
pricingResults         // Resultados de pricing

// Tema
themeStore             // Control light/dark
```

### Funciones de Cálculo

```typescript
// Descuentos
calculateConsecutiveDiscounts()  // Descuento compuesto real
calculateSimpleDiscountSum()     // Suma aritmética simple
calculateSingleDiscount()        // Un solo descuento

// Pricing
calculatePriceFromMargin()      // Precio desde margen
calculatePriceFromMarkup()      // Precio desde markup
calculateMargin()               // Margen desde precio
calculateMarkup()               // Markup desde precio
```

---

## 📱 Guía de Uso

### 1. Calculadora de Descuentos

**Flujo de trabajo:**

1. Ingresa el **precio original** en soles (S/)
2. Agrega hasta **8 descuentos** consecutivos (ej: 25%, 4%, 2%)
3. Observa los resultados en tiempo real:
   - **Dcto. Real**: Descuento efectivo compuesto
   - **Precio Final**: Resultado después de descuentos
   - **Total (+IGV)**: Precio con IGV 18% incluido
4. Opcional: Establece un **precio objetivo** para calcular el descuento necesario

**Sin precio base:**
- Si ingresas descuentos sin precio, el sistema simula el cálculo sobre S/ 100
- Muestra el descuento efectivo como si existiera un precio

**Guardar cálculo:**
- Código de cliente (ej: CLI-001)
- Nombre del cliente
- Observaciones adicionales

**Compartir:**
- Botón WhatsApp genera mensaje con todos los datos
- Incluye: precio original, descuentos, precio final, IGV, observaciones

### 2. Calculadora de Pricing

**Flujo de trabajo:**

1. Selecciona el modo de cálculo:
   - **Margen % → Precio**: Precio desde margen deseado
   - **Markup % → Precio**: Precio desde markup deseado
   - **Costo + Precio**: Valores directos
2. Ingresa el **costo** del producto
3. Configura el **margen** o **markup** deseado
4. Activa **Incluir IGV** si necesitas precio con impuestos

**Resultados:**
- Precio de venta sugerido
- Margen bruto (%)
- Markup (%)
- Monto de IGV (si aplica)

---

## 🎨 Sistema de Diseño G360

### Paleta de Colores

#### Modo Oscuro (Default)

| Variable CSS | Hex | Uso |
|--------------|-----|-----|
| `--g360-bg` | `#0b1220` | Fondo principal |
| `--g360-surface` | `#151e2e` | Superficie de tarjetas |
| `--g360-accent` | `#00d084` | Color primario (verde) |
| `--g360-neon-purple` | `#a855f7` | Color secundario (púrpura) |
| `--g360-text` | `#f0f4f8` | Texto principal |
| `--g360-muted` | `#94a3b8` | Texto secundario |
| `--g360-border` | `#1e293b` | Bordes |

### Tipografía (Optimizado Móvil Nativo)

| Elemento | Tamaño | Peso |
|----------|--------|------|
| Títulos | 1.1-1.25rem | 700-800 |
| Valores | 1.1-1.25rem | 800 |
| Etiquetas | 0.8-0.85rem | 700-800 |
| Botones | 0.85rem | 700 |
| Inputs | 1.1-1.2rem | 700 |

> Base: 15px (14px en móviles pequeños ≤400px)

### Efectos Visuales

- **Glassmorphism**: Fondo blur en tarjetas (backdrop-filter)
- **Neón**: Brillo en estados hover/focus
- **Gradientes**: Transiciones de color suaves
- **Sombras**: Elevación en elementos interactivos

---

## 📐 Responsive Design

| Breakpoint | Ancho | Dispositivo |
|------------|-------|-------------|
| Base | 390px | Móvil portrait |
| sm | 576px | Móvil landscape |
| md | 768px | Tablet |
| lg | 992px | Desktop |
| xl | 1200px | Desktop grande |

---

## 🔧 Configuración

### localStorage

| Key | Descripción |
|-----|-------------|
| `g360-theme` | Tema actual (light/dark) |
| `g360-discounts` | Estado de descuentos |
| `g360-pricing` | Estado de pricing |
| `g360-history-discount` | Historial de descuentos |
| `g360-history-pricing` | Historial de pricing |

### Constantes

```typescript
// types/index.ts
MAX_DISCOUNTS = 8           // Máximo descuentos permitidos
IVA_RATE = 0.18             // IGV peruano (18%)
MAX_HISTORY = 50            // Registros máximos en historial
```

---

## 📤 Funcionalidades Avanzadas

### Simulación de Descuentos

Cuando no hay precio original pero existen descuentos activos, el sistema:
1. Simula cálculo sobre S/ 100
2. Aplica descuentos consecutivamente
3. Calcula el descuento efectivo compuesto
4. Muestra el resultado como "Dcto. Real"

**Ejemplo:**
- Input: 25%, 4%, 2% (sin precio)
- Simulación: S/ 100 - 25% - 4% - 2% = S/ 70.56
- Descuento efectivo: 29.44%

### Historial

- Almacena hasta 50 registros
- Cada registro incluye:
  - Fecha y hora
  - Código y nombre de cliente
  - Precio original
  - Descuentos aplicados
  - Descuento efectivo
  - Precio final
  - Precio con IGV
  - Observaciones

---

## 🧪 Comandos

```bash
# Instalar dependencias
npm install

# Servidor desarrollo
npm run dev

# Verificación de tipos
npm run check

# Build producción
npm run build

# Previsualizar build
npm run preview
```

---

## 🚀 Despliegue

### GitHub Pages

```bash
# Build de producción
npm run build

# Desplegar a gh-pages
npx gh-pages -d build -t true
```

**URL**: `https://carloscus.github.io/g360-discount-calculator/`

### Otras Opciones

- **Netlify**: Arrastre del directorio `build`
- **Vercel**: `npm i -g vercel` + `vercel`
- **Cloudflare Pages**: Conectar repositorio

---

## 📋 Changelog

### v2.3.0 (2026-03-27)
- ✨ **Optimización móvil nativo** - Interfaz 90% móvil / 10% PC
- ✨ **Tamaños aumentados** - Labels 0.85rem, valores 1.1rem, botones 52-56px
- ✨ **PWA completo** - manifest.json, meta tags, iconos
- ✨ **Safe Area** - Compatible con notch iOS/Android
- ✨ **Haptic Feedback** - Vibración al interacturar (navigator.vibrate)
- ✨ **Mensaje WhatsApp** - UTF-8 limpio, emojis animados
- 🎨 Mejoras en Experience de usuario móvil

### v2.2.0 (2026-03-26)
- ✨ Simulación de descuentos sin precio base
- ✨ Cálculo compuesto sobre S/ 100
- ✨ Display de "Dcto. Real" con descuento efectivo
- ✨ Modal de observaciones mejorado
- 🎨 Mejoras en ResultsCard

### v2.1.0 (2026-03-26)
- ✨ Modal de observaciones con código, cliente, obs
- ✨ Historial con registros colapsables
- ✨ Precio objetivo para descuento requerido
- ✨ Compartir WhatsApp completo
- 🎨 Mejoras visuales móvil

### v2.0.0 (2026-03-25)
- 🚀 Sistema de diseño G360 completo
- 🚀 Theme switcher (dark/light)
- 🚀 PWA ready
- 🎨 Glassmorphism y efectos neón

---

## 👨‍💻 Autor

**Carlos Cusi (CCUSI)**
- Rol: Desarrollador Full Stack
- Organización: G360 Ecosystem
- Año: 2026

---

## 📄 Licencia

© 2026 G360 Ecosystem. Todos los derechos reservados.

---

## 🔗 Enlaces

| Recurso | URL |
|---------|-----|
| Repositorio | [GitHub](https://github.com/carloscus/g360-discount-calculator) |
| G360 Ecosystem | [g360.com](https://g360.com) |
| Documentación | [docs.g360.com](https://docs.g360.com) |

---

*Desarrollado con ❤️ por CCUSI | G360 Ecosystem 2026*
