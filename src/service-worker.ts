/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const worker = self as unknown as ServiceWorkerGlobalScope;

// Cache versionado: cada build nuevo genera un nombre distinto
const CACHE = `g360-v${version}`;

// Assets del build (hasheados) + archivos de static/
const ASSETS: string[] = [...build, ...files];

// Alcance del worker = base path del sitio (ej: /g360-discount-calculator/)
const SCOPE = new URL(worker.registration.scope).pathname;

// Páginas HTML principales a precachear para funcionar offline
const PAGES: string[] = [SCOPE, `${SCOPE}pricing`];

// ------------------------------------------------------------------
// Install: precachea todo sin abortar si un archivo individual falla
// ------------------------------------------------------------------
worker.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const candidates = [...ASSETS, ...PAGES];
      await Promise.all(
        candidates.map((path) =>
          cache.add(path).catch(() => {
            // Ignorar fallos individuales: el instal no debe abortar
          })
        )
      );
      await worker.skipWaiting();
    })()
  );
});

// ------------------------------------------------------------------
// Activate: limpia caches antiguos y toma control de las pestañas
// ------------------------------------------------------------------
worker.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
      await worker.clients.claim();
    })()
  );
});

// ------------------------------------------------------------------
// Fetch:
//  - Navegación (HTML): network-first, fallback al shell cacheado
//  - Assets same-origin: cache-first, luego red + rellena caché
//  - Lo demás (WhatsApp, cross-origin, no-GET): se deja pasar
// ------------------------------------------------------------------
worker.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== worker.location.origin) return;

  // Navegación
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(CACHE);
            cache.put(url.origin + SCOPE, response.clone());
          }
          return response;
        } catch {
          const cache = await caches.open(CACHE);
          const cached = await cache.match(SCOPE);
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  // Assets
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch {
        return Response.error();
      }
    })()
  );
});