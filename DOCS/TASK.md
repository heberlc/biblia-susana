# Biblia Susana — Plan de Mejoras

## Fase 1 — Quick Wins
- [x] Eliminar `console.log` de debug en `Layout.astro`
- [x] Corregir redirect SPA en `netlify.toml`
- [x] Agregar meta tags OG/Twitter en `Layout.astro`
- [x] Agregar skip link + corregir ARIA de tabs (AT/NT)
- [x] Control de tamaño de fuente `A-/A+` en header

## Fase 2 — Mejoras de Audio
- [ ] Selector inteligente de voz española (auto-elegir Neural > Google > Apple)
- [ ] Lectura versículo por versículo (reemplazar chunking por caracteres)
- [ ] Highlight + auto-scroll del versículo activo durante lectura
- [ ] Barra de progreso (versículo X de Y)
- [ ] Control de velocidad (slider 0.5x–2.0x)
- [ ] Persistir preferencias de voz y velocidad en localStorage
- [ ] Eliminar console.logs de `ChapterSpeechButton.astro`
- [ ] Tip en la UI recomendando Edge para mejor calidad de voz

## Fase 3 — Features UX
- [ ] Guardar progreso de lectura (último capítulo, localStorage)
- [ ] Versículo del día en homepage
- [ ] Botón de compartir versículos (Web Share API + copiar enlace)
- [ ] Breadcrumbs en todas las páginas
- [ ] Búsqueda por referencia directa (ej: "Juan 3:16")

## Fase 4 — Migración Cloudflare Pages
- [ ] Configurar deploy estático en Cloudflare Pages (Git integration o wrangler)
- [ ] Verificar build y rutas estáticas en CF Pages
- [ ] Eliminar `netlify.toml` tras migración exitosa
- [ ] Configurar dominio personalizado (si aplica)

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
