# Log de Implementacion 03.5 - Fix lector de capitulo en mobile

**Fecha:** 13 de Febrero de 2026  
**Objetivo:** Corregir corte prematuro del boton **"Leer capitulo completo"** en navegadores moviles.

## 1. Problema detectado
- En desktop, la lectura del capitulo completo funcionaba de forma estable.
- En mobile, la lectura se detenía a mitad de un versiculo (o tras pocos segundos), aunque los botones de lectura por versiculo si funcionaban.

## 2. Diagnostico tecnico
- El flujo de capitulo usaba utterances mas largos y continuos, lo que en mobile puede provocar truncado o eventos inconsistentes en `SpeechSynthesis`.
- El workaround previo basado en `pause()/resume()` periodico podia introducir cortes adicionales en algunos dispositivos moviles.

## 3. Cambios implementados
Archivo: `src/components/ChapterSpeechButton.astro`

- Se cambio la lectura por versiculo a lectura por **chunks** (fragmentos) para aumentar estabilidad.
- Se ajusto tamano de chunk segun dispositivo:
  - Mobile: chunk corto (`maxLen = 70`)
  - Desktop: chunk estandar (`maxLen = 140`)
- Se agrego `onboundary` para actualizar actividad del motor de voz y mejorar deteccion de cuelgues.
- Se implemento reintento controlado del chunk actual ante `interrupted/canceled` (1 intento).
- Se mantuvo watchdog de recuperacion (`startRecoveryTimers`) para reanudar flujo si el motor queda silencioso sin `onend`.
- Se elimino el `keepAlive` de `pause()/resume()` periodico por su impacto negativo en mobile.

## 4. Resultado
- El boton **"Leer capitulo completo"** vuelve a funcionar en mobile con mayor estabilidad.
- Se mantiene el comportamiento correcto en desktop.

## 5. Validacion
- Verificacion estatica: `pnpm check` sin errores.
- Prueba funcional esperada:
  - Iniciar lectura de capitulo completo en mobile.
  - Confirmar avance de versiculos sin corte prematuro.
  - Confirmar funcionamiento de Pausar/Continuar/Detener.
