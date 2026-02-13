# Log de Implementación 04 — Migración a Cloudflare Pages

**Fecha:** 12 de Febrero de 2026
**Objetivo:** Migrar de una configuración genérica a un deploy optimizado para Cloudflare Pages, aprovechando su red global y caché.

## 1. Configuración de Build
- **Wrangler:** Se instaló `wrangler` como dependencia de desarrollo y se creó `wrangler.jsonc` para definir el directorio de salida (`dist`) y la compatibilidad.
- **Scripts NPM:** Se añadieron comandos específicos para evitar conflictos:
  - `cf:deploy`: `astro build && wrangler pages deploy dist`
  - `cf:preview`: Deploy a rama de preview.

## 2. Seguridad y Rendimiento (`public/_headers`)
Se creó un archivo `_headers` nativo de Cloudflare para definir políticas HTTP:
- **Seguridad:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` (evita clickjacking)
  - `Permissions-Policy`: Bloqueo de cámara/micrófono/geolocalización por defecto.
- **Caché (Cache-Control):**
  - Assets inmutables (`/_astro/*`, `/assets/*`): 1 año (`max-age=31536000`).
  - Datos JSON (`/data/*`): 1 día.
  - HTML/Páginas: Default (revalidación).

## 3. Limpieza
- Se eliminó `netlify.toml` para evitar confusiones en el CI/CD.
- Se verificó que el build estático de Astro (`output: 'static'`) genera correctamente los 1,257 archivos HTML necesarios.
