# Log de Implementación 02 — Mejoras de Audio (TTS)

**Fecha:** 12 de Febrero de 2026
**Objetivo:** Reemplazar la lectura básica por bloque con un sistema robusto, accesible y compatible con móviles.

## 1. Arquitectura de Voz (`src/lib/speech.ts`)
- **Selección Inteligente:** Algoritmo que prioriza voces de alta calidad (`Neural` > `Google` > `Apple` > `Microsoft`) sobre las genéricas del sistema.
- **Persistencia:** Almacenamiento en `localStorage` de:
  - Voz seleccionada (`biblia-voice-name`)
  - Velocidad de lectura (`biblia-speech-rate`)
- **API Unificada:** Métodos `speechRead`, `speechStop`, `speechPause`, `speechResume` que encapsulan la complejidad de `window.speechSynthesis`.

## 2. Componente de Lectura (`ChapterSpeechButton.astro`)
- **Lectura Versículo a Versículo:** Se abandonó la lectura por chunks de caracteres. Ahora se itera sobre el array de versículos, permitiendo control granular.
- **Highlight Activo:** El versículo que se está leyendo recibe la clase `.verse-highlight` (borde verde + fondo suave).
- **Auto-scroll:** El navegador hace scroll suave automáticamente para mantener el versículo activo en el centro de la pantalla.
- **Controles Completos:** Play, Pausa, Continuar, Detener, y Slider de Velocidad (0.5x a 2.0x).
- **Barra de Progreso:** Indicador visual "Versículo X de Y".

## 3. Compatibilidad Móvil (Reto Principal)
Los navegadores móviles (iOS Safari, Chrome Android) tienen restricciones severas para el audio:
1. **User Gesture:** El audio solo puede iniciar por un toque directo del usuario.
2. **Async Voices:** Las voces se cargan asíncronamente; `getVoices()` devuelve vacío inicialmente.
3. **Chrome Bug:** En Android, `speechSynthesis` se congela si dura más de ~15s.

**Soluciones Implementadas:**
- **Pre-carga de Voces:** Se llama a `getVoices()` y se escucha `onvoiceschanged` desde el inicio (`initSpeech`).
- **Sincronía Estricta:** Se eliminaron promesas (`await`) dentro del handler de `click`. La llamada a `speechSynthesis.speak()` ocurre en el mismo tick del evento touch.
- **Chrome Keepalive:** Un timer (`setInterval`) que hace `pause()/resume()` cada 5 segundos para evitar que el proceso de fondo de Chrome mate el audio.
- **Fallback de Error:** Si un versículo falla, el sistema intenta saltar automáticamente al siguiente en lugar de detenerse.
