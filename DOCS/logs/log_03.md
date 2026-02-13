# Log de Implementación 03 — Experiencia de Usuario (UX)

**Fecha:** 12 de Febrero de 2026
**Objetivo:** Aumentar el engagement y la usabilidad mediante funcionalidades modernas de lectura y navegación.

## 1. "Continuar Leyendo"
- **Tracking:** Cada vez que se visita un capítulo, se guarda en `localStorage` (key: `biblia-reading-progress`) el libro, capítulo y timestamp.
- **Homepage Card:** En la página de inicio, un script verifica este storage. Si existe, hidrata dinámicamente una tarjeta "Continuar Leyendo" que lleva al usuario directo a donde se quedó.

## 2. Versículo del Día
- **Determinismo:** Se implementó un algoritmo basado en "Día del Año" (1-366). Esto asegura que el versículo sea el mismo para todos los usuarios ese día, sin necesitar base de datos ni servidor.
- **Generación en Build:** El versículo se selecciona durante el `pnpm build`, asegurando cero impacto en el rendimiento client-side.

## 3. Compartir Versículos (`ShareButton.astro`)
- **API Híbrida:**
  - **Móvil:** Usa `navigator.share()` nativo para abrir el menú de compartir de iOS/Android (WhatsApp, Telegram, etc.).
  - **Desktop:** Fallback automático a `navigator.clipboard.writeText()` para copiar al portapapeles.
- **Feedback Visual:** El icono cambia a ✅ temporalmente cuando se copia exitosamente.

## 4. Navegación Profunda
- **Breadcrumbs:** Se implementó un componente `Breadcrumbs.astro` con microdatos semánticos (`nav`, `ol`), mejorando la navegación y el SEO en páginas de libro y capítulo.
- **Búsqueda por Referencia:** El buscador principal ahora detecta patrones como "Juan 3:16" o "Génesis 1:1" y redirige directamente a la lectura en vez de intentar una búsqueda de texto completo.
