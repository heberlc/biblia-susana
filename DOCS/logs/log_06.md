# Log de Implementacion 06 - PWA, Offline y Wake Lock en audio

**Fecha:** 13 de Febrero de 2026  
**Objetivo:** Completar Fase 5 (PWA & Offline) y mejorar experiencia mobile durante reproduccion de audio.

## 1. PWA base
- Se creo `public/manifest.json` con:
  - `name`, `short_name`, `start_url`, `scope`, `display: "standalone"`.
  - `theme_color` y `background_color`.
  - Iconos PWA (`192` y `512`).
- Se agregaron iconos:
  - `public/icons/icon-192.svg`
  - `public/icons/icon-512.svg`

## 2. Meta tags PWA
En `src/layouts/Layout.astro` se agrego:
- `<link rel="manifest" href="/manifest.json">`
- `<link rel="apple-touch-icon" href="/icons/icon-192.svg">`
- Meta tags de `theme-color`, `apple-mobile-web-app-capable`, `mobile-web-app-capable` y `apple-mobile-web-app-title`.

## 3. Service Worker y offline
- Se implemento `public/sw.js` con estrategias:
  - `network-first` para navegacion.
  - `cache-first` para `/data/*` (lectura biblica offline).
  - `stale-while-revalidate` para recursos estaticos.
- Se agrego fallback offline:
  - `public/offline.html`
- Se registro el Service Worker en `Layout.astro`.

## 4. Mobile audio: evitar apagado de pantalla
- Se integro `Screen Wake Lock API` durante reproduccion de audio:
  - `src/lib/speech.ts` (audio por versiculo).
  - `src/components/ChapterSpeechButton.astro` (audio por capitulo).
- Se libera Wake Lock en pausa/detener/fin y se reintenta al volver a primer plano.
- Se mantuvo fallback silencioso para navegadores sin soporte.

## 5. Estado de tarea
- `DOCS/TASK.md` actualizado:
  - Fase 5 marcada como completada.

## 6. Validacion
- Comando ejecutado: `pnpm check`
- Resultado: sin errores de compilacion/tipos (solo hints menores preexistentes).
