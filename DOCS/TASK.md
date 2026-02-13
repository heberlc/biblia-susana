# Biblia Susana — Plan de Mejoras

## Fase 1 — Quick Wins
- [x] Eliminar `console.log` de debug en `Layout.astro`
- [x] Corregir redirect SPA en `netlify.toml`
- [x] Agregar meta tags OG/Twitter en `Layout.astro`
- [x] Agregar skip link + corregir ARIA de tabs (AT/NT)
- [x] Control de tamaño de fuente `A-/A+` en header

## Fase 2 — Mejoras de Audio
- [x] Selector inteligente de voz española (auto-elegir Neural > Google > Apple)
- [x] Lectura versículo por versículo (reemplazar chunking por caracteres)
- [x] Highlight + auto-scroll del versículo activo durante lectura
- [x] Barra de progreso (versículo X de Y)
- [x] Control de velocidad (slider 0.5x–2.0x)
- [x] Persistir preferencias de voz y velocidad en localStorage
- [x] Eliminar console.logs de `ChapterSpeechButton.astro`
- [x] Tip en la UI recomendando Edge para mejor calidad de voz

## Fase 3 — Features UX
- [x] Guardar progreso de lectura (último capítulo, localStorage)
- [x] Versículo del día en homepage
- [x] Botón de compartir versículos (Web Share API + copiar enlace)
- [x] Breadcrumbs en todas las páginas
- [x] Búsqueda por referencia directa (ej: "Juan 3:16")

## Fase 4 — Migración Cloudflare Pages
- [x] Configurar deploy estático en Cloudflare Pages (wrangler.jsonc + scripts)
- [x] Headers de seguridad y caché (public/_headers)
- [x] Eliminar `netlify.toml`
- [x] Ejecutar primer deploy (`pnpm deploy`) y verificar
- [x] Configurar dominio personalizado (si aplica)

## Fase 5 — PWA & Offline
- [ ] Crear `manifest.json` con iconos
- [ ] Implementar Service Worker con cache para lectura offline
- [ ] Agregar meta tags PWA en `Layout.astro`

## Fase 6 — Optimización & Polish
- [ ] Mejora visual (tipografía premium, gradientes, iconos SVG)
- [ ] Dividir `biblia-estructurada.json` por libro
- [ ] Optimizar índice de búsqueda (pre-computar en build)
- [ ] Lazy loading de versículos en capítulos largos

## Fase 7 — Testing
- [ ] Tests unitarios para `search.ts` y `loadBible.ts`
- [ ] Tests E2E con Playwright (navegación, búsqueda, audio)

## Futuro
- [ ] Soporte multi-versión bíblica (RVR1960, NVI, etc.)
- [ ] Plan de lectura diaria (365 días)
- [ ] Pre-generar audio MP3 para capítulos populares (Kokoro-TTS)
- [ ] Pages Function para búsqueda server-side con KV
