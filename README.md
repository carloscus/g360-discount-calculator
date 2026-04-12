# G360 Descuentos - Calculadora de Descuentos Consecutivos

## 📊 Descripción

**G360 Descuentos** es una aplicación web progresiva (PWA) para calcular descuentos consecutivos y precios de venta con margen/markup. Desarrollada con **SvelteKit 5 + TypeScript + Tailwind v4** como parte del ecosistema G360.

### Características Principales

- **Descuentos Consecutivos** (15%+10%+3% = 25.80%)
- **Dual Guardar + WhatsApp** - Guarda y comparte en un paso
- **Historial con Selección** - Selecciona registros para compartir
- **Filtros** - Busca por cliente, código u observación
- **Compartir Historial** - Exporta historial por WhatsApp/TXT
- **IVA Peruano** - IGV del 18% incluido
- **Precio Objetivo** - Calcula descuento necesario
- **Modo Oscuro/Claro** - Tema G360 con neón
- **Responsive Short Screen** - Pantallas ≤400px altura
- **PWA** - Instalable como app nativa

## 🚀 Tecnologías

- **Framework**: SvelteKit 2.x
- **Lenguaje**: TypeScript 5.x
- **Estilos**: Tailwind CSS v4
- **Build Tool**: Vite 6.x
- **Adapter**: Static (para despliegue estático)

## 📁 Estructura del Proyecto

```
g360-discount-calculator/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml      # CI/CD para gh-pages
│   └── AUDIT_REPORT.md     # Reporte de auditoría
├── .vscode/                # Configuración VS Code
├── src/
│   ├── lib/
│   │   ├── components/     # Componentes Svelte
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
│   │   ├── stores/         # Stores de Svelte
│   │   │   ├── theme.ts
│   │   │   ├── discounts.ts
│   │   │   └── pricing.ts
│   │   ├── utils/          # Utilidades
│   │   │   ├── calculations.ts
│   │   │   ├── formatting.ts
│   │   │   ├── sharing.ts
│   │   │   └── haptics.ts
│   │   └── types/          # Tipos TypeScript
│   │       └── index.ts
│   ├── routes/             # Rutas de SvelteKit
│   │   ├── +layout.svelte
│   │   ├── +page.svelte    # Descuentos
│   │   └── pricing/
│   │       └── +page.svelte # Pricing
│   ├── core/               # Integración G360
│   │   ├── g360-skill-client.js
│   │   └── g360-theme.css
│   ├── App.svelte          # Componente raíz
│   ├── main.ts             # Punto de entrada
│   ├── app.html            # Template HTML
│   └── app.css             # Estilos globales
├── static/                 # Archivos estáticos (generados en build/)
│   ├── android-chrome-192x192.png
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── icon-g360.png
│   ├── logo-g360.svg
│   ├── logo-g360-light.svg
│   ├── manifest.json       # PWA Manifest
│   ├── g360-manifest.json  # Configuración G360
│   └── skill.json          # Skills de VS Code
├── g360/                   # Configuración del ecosistema
│   └── package.json
├── .gitignore
├── package.json
├── package-lock.json
├── svelte.config.js        # Configuración SvelteKit
├── vite.config.ts          # Configuración Vite
├── tsconfig.json           # Configuración TypeScript
└── README.md               # Este archivo
```

### 📦 Archivos Importantes

- **`svelte.config.js`**: Adapter estático para despliegue en gh-pages
- **`.github/workflows/deploy.yml`**: Pipeline de GitHub Actions para CI/CD
- **`static/manifest.json`**: Configuración PWA (instalable)
- **`src/core/g360-theme.css`**: Tema y estilos del ecosistema G360

## 🛠️ Instalación y Desarrollo

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/carloscus/g360-discount-calculator.git
cd g360-discount-calculator

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (http://localhost:5173)
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

### Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con hot-reload |
| `npm run build` | Compila el proyecto para producción |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run check` | Valida código TypeScript y componentes |
| `npm run check:watch` | Modo watch para validación |

## 🚀 Despliegue en GitHub Pages

### Despliegue Automático (CI/CD)

El proyecto está configurado para desplegar automáticamente en **GitHub Pages** cuando hagas push a la rama `main`:

1. **Commit y Push a main**:
   ```bash
   git add .
   git commit -m "feat: actualizar proyecto"
   git push origin main
   ```

2. **GitHub Actions ejecutará automáticamente**:
   - ✅ Checkout del código
   - ✅ Setup de Node.js 20
   - ✅ Instalación de dependencias
   - ✅ Build del proyecto
   - ✅ Despliegue automático a `gh-pages`

3. **Accede a la aplicación**:
   - URL: `https://<tu-usuario>.github.io/g360-discount-calculator/`

### Configuración del Despliegue

- **Framework**: SvelteKit con adapter static (`@sveltejs/adapter-static`)
- **Output Path**: `./build` (compilado al directorio `build/`)
- **Base URL**: `/g360-discount-calculator/` (configurable en `vite.config.ts`)
- **Fallback**: `index.html` (para rutas del cliente)

### Monitoreo del Despliegue

1. Ve a la pestaña **"Actions"** en tu repositorio GitHub
2. Visualiza el estado de cada workflow
3. Revisa los logs si hay algún error

## 📋 .gitignore Configurado

```
node_modules/
build/
dist/
_app/
index.html
pricing.html
.svelte-kit/
.env
.vscode/
```

Los archivos compilados **NO** se versionar, solo el código fuente.

## 📱 Uso

### Pantalla 1: Descuentos Consecutivos

1. Ingresa el **precio original** (en Soles peruanos)
2. Agrega hasta **8 descuentos** consecutivos
3. Opcional: Ingresa un **precio objetivo** para calcular el descuento necesario
4. Visualiza en tiempo real:
   - Descuento efectivo total
   - Precio final
   - Ahorro total
   - Precio con IGV (18%)
5. Guarda el cálculo con:
   - Código de cliente
   - Nombre del cliente
   - Observaciones
6. Comparte por WhatsApp

### Pantalla 2: Cálculo de Precio

1. Selecciona el modo de cálculo:
   - **Margen % → Precio**: Calcula precio desde margen deseado
   - **Markup % → Precio**: Calcula precio desde markup deseado
   - **Costo + Precio**: Ingresa ambos valores directamente
2. Ingresa el **costo** del producto
3. Configura el **margen** o **markup** deseado
4. Opcional: Activa **Incluir IGV 18%**
5. Visualiza:
   - Precio de venta recomendado
   - Margen bruto
   - Markup
   - Monto de IGV (si aplica)

### Historial

- Accede al historial desde el botón "Historial"
- Ver registros guardados con:
  - Fecha y hora
  - Código y nombre de cliente
  - Precio original, descuentos aplicados, precio final
  - Observaciones
- Los registros son colapsables para ver más detalles
- Persistencia en localStorage

## 🎨 Sistema de Diseño G360

### Colores (Modo Oscuro)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `--g360-bg` | `#0b1220` | Fondo principal |
| `--g360-surface` | `#151e2e` | Superficie de cards |
| `--g360-accent` | `#00d084` | Color principal (verde) |
| `--g360-text` | `#f0f4f8` | Texto principal |
| `--g360-muted` | `#94a3b8` | Texto secundario |
| `--g360-border` | `#1e293b` | Bordes |

### Tipografía Optimizada para Móvil

- **Etiquetas**: 0.7rem (antes 0.65rem)
- **Valores**: 1rem (antes 0.875rem)
- **Títulos**: 1.25rem
- **Botones**: 1rem, altura 48px

### Efectos

- **Glassmorphism**: Cards con backdrop-filter blur
- **Neón**: Efectos de brillo en hover y focus
- **Gradientes**: Transiciones de color suaves
- **Sombras**: Elevación en elementos interactivos

## 📐 Responsive Breakpoints

| Breakpoint | Ancho | Dispositivo |
|------------|-------|-------------|
| Base | 390px | Móvil (portrait) |
| `sm` | 576px | Móvil (landscape) |
| `md` | 768px | Tablet |
| `lg` | 992px | Desktop |
| `xl` | 1200px | Desktop grande |

## 🔧 Configuración

### Variables de Entorno

No se requieren variables de entorno para esta aplicación.

### localStorage Keys

| Key | Descripción |
|-----|-------------|
| `g360-theme` | Preferencia de tema (light/dark) |
| `g360-discounts` | Estado de descuentos |
| `g360-pricing` | Estado de pricing |
| `g360-history-discount` | Historial de descuentos |
| `g360-history-pricing` | Historial de pricing |

## 📤 Funcionalidades

### Guardar Cálculo

Al guardar un descuento:
- Código de cliente (ej: CLI-001)
- Nombre del cliente
- Observaciones adicionales
- Fecha y hora del registro

### Compartir por WhatsApp

El mensaje incluye:
- Código y nombre del cliente
- Precio original
- Descuentos aplicados
- Precio final con IGV
- Observaciones

### Historial

- Registro colapsable con información resumida
- Al expandir muestra:
  - Precio original
  - Cada descuento aplicado
  - Descuento efectivo total
  - Precio final
  - Monto de IGV
  - Observaciones completas

## 🧪 Testing

```bash
# Verificación de tipos
npm run check

# Modo watch
npm run check:watch
```

## 📦 Build

```bash
# Build de producción
npm run build

# Salida en directorio: build/
```

## 🚀 Despliegue

### GitHub Pages

El proyecto está configurado para despliegue en GitHub Pages mediante la rama `gh-pages`:

```bash
# 1. Asegúrate de estar en la rama main
git checkout main

# 2. Build de producción
npm run build

# 3. Desplegar a gh-pages
npx gh-pages -d build -t true

# Opcional: Configurar GitHub Actions para deploy automático
```

### Configuración Adicional

1. Ve a **Settings** → **Pages** en el repositorio
2. En **Source**, selecciona:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
3. Save los cambios
4. La app estará disponible en: `https://carloscus.github.io/g360-discount-calculator/`

### Otras Opciones de Despliegue

- Netlify
- Vercel
- Cloudflare Pages
- Cualquier servidor estático

## 📋 Changelog

### v2.2.0 (2026-04-11)
- ✨ Dual Guardar + WhatsApp en un paso
- ✨ Historial con selección múltiple
- ✨ Compartir historial por WhatsApp/TXT
- ✨ Filtros en historial (cliente, código, nota)
- ✨ Descuento efectivo sin precio base
- ✨ Pricing dual (guardar + WhatsApp)
- 🎨 Tipografía normalizada con variables CSS
- 🎨 Alturas responsivas (700px, 400px breakpoints)
- 🎨 Short screen support (≤400px altura)
- 🎨 Fichas de historial más grandes
- ♿ WCAG contraste mejorado

### v2.1.0 (2026-03-26)
- ✨ Modal de observaciones
- ✨ Historial colapsable
- ✨ Precio objetivo
- ✨ Compartir WhatsApp

### v2.0.0 (2026-03-xx)
- 🚀 Sistema de diseño G360

## 👨‍💻 Autor

**Carlos Cusi (CCUSI)**
- Ecosistema: G360
- Año: 2026

## 📄 Licencia

© 2026 G360 Ecosystem. Todos los derechos reservados.

## 🔗 Enlaces

- [G360 Ecosystem](https://g360.com)
- [Documentación G360](https://docs.g360.com)
- [Repositorio](https://github.com/carloscus/g360-discount-calculator)

---

**Powered by G360 | CCUSI 2026**
