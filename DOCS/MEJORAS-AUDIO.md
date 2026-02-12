# 🔊 Mejoras del Lector de Audio — Biblia Susana

## Estado Actual del Audio

El proyecto usa **Web Speech API** nativa del navegador para toda la funcionalidad de audio:

| Componente | Función | Archivo |
|:-----------|:--------|:--------|
| `SpeechButton.astro` | Leer un versículo individual | 130 líneas |
| `ChapterSpeechButton.astro` | Leer capítulo completo (con chunks) | 290 líneas |
| `VoiceSearch.astro` | Búsqueda por voz (SpeechRecognition) | 59 líneas |
| `speech.ts` | Utilidades: read, stop, pause, resume, recognize | 95 líneas |

### Problemas Detectados

| Problema | Severidad | Detalle |
|:---------|:---------:|:--------|
| **Calidad de voz variable** | 🔴 | La voz en español depende del browser/OS. Chrome usa voces Google (decentes), Safari usa voces Apple (mejores), Firefox usa SAPI/eSpeak (peores) |
| **Sin selector de voz** | 🟡 | No permite elegir entre las voces disponibles del sistema |
| **Sin indicador de progreso** | 🟡 | No se sabe qué versículo se está leyendo |
| **Chunking hardcodeado** | 🟡 | Divide en chunks de 4000 chars pero sin considerar límites de versículos |
| **Sin control de velocidad** | 🟡 | Rate fijo en 0.9, sin UI para ajustar |
| **Console.logs de debug** | 🟢 | Muchos `console.log` de debug en producción |
| **Sin highlight activo** | 🟡 | No resalta el versículo que se está leyendo |
| **No persiste preferencias** | 🟢 | Voz y velocidad preferidas se pierden al recargar |

---

## Skills Encontradas

### `inference-sh/skills@text-to-speech`
- **Modelos**: Kokoro-TTS, DIA, Chatterbox, Higgs, VibeVoice
- **Tipo**: CLI server-side (`infsh app run ...`)
- **Uso**: Pre-generar archivos de audio (.mp3/.wav)
- **Idioma**: Kokoro-TTS soporta español, los otros son mayormente inglés
- **Veredicto**: ❌ **No viable para uso en tiempo real en el browser.** Sería útil solo para pre-generar audio offline

### `pvb-est...@elevenlabs-tts`
- **Tipo**: API de pago (ElevenLabs)
- **Calidad**: Excelente para español, voces muy naturales
- **Costo**: ~$5/mes por 30 min de audio, Free tier limitado
- **Veredicto**: ⚠️ Posible pero costoso para 31K versículos

---

## 3 Enfoques de Mejora

### Enfoque A: Optimizar Web Speech API (⭐ Recomendado)
> Costo: **$0** | Esfuerzo: **Medio** | Impacto: **Alto**

Mejorar significativamente la experiencia sin cambiar de tecnología:

1. **Selector de voz** — Listar voces del sistema, preferir voces en español
2. **Control de velocidad** — Slider 0.5x a 2.0x
3. **Barra de progreso** — Qué versículo se está leyendo
4. **Highlight activo** — Resaltar versículo actual durante lectura
5. **Chunks por versículo** — En vez de dividir por caracteres, leer versículo por versículo
6. **Persistir preferencias** — Guardar voz y velocidad en localStorage
7. **Limpiar console.logs** — Eliminar debug de producción
8. **Auto-scroll** — Seguir el versículo activo en pantalla

```javascript
// Ejemplo: Selector de voz mejorado
function getSpanishVoices() {
  return speechSynthesis.getVoices().filter(v => 
    v.lang.startsWith('es')
  ).sort((a, b) => {
    // Preferir voces "premium" (Google, Microsoft Neural)
    const aScore = a.name.includes('Google') || a.name.includes('Neural') ? 1 : 0;
    const bScore = b.name.includes('Google') || b.name.includes('Neural') ? 1 : 0;
    return bScore - aScore;
  });
}

// Ejemplo: Lectura versículo por versículo con highlight
async function readChapterByVerse(versiculos, onVerseStart, onVerseEnd) {
  for (const v of versiculos) {
    onVerseStart(v.numero); // highlight + scroll
    await speakAndWait(v.texto);
    onVerseEnd(v.numero);
  }
}
```

---

### Enfoque B: Pre-generar Audio (Calidad Premium)
> Costo: **$0-50 one-time** | Esfuerzo: **Alto** | Impacto: **Muy Alto**

Pre-generar archivos MP3 para versículos/capítulos clave usando Kokoro-TTS o ElevenLabs:

- Solo para capítulos populares (Juan 3, Salmo 23, Génesis 1, etc.)
- Archivos en R2/Cloudflare para servir estáticamente
- Fallback a Web Speech API para el resto

**Problema**: 31K versículos × ~5-15 seg/versículo = ~65-130 horas de audio = **~3-6 GB de MP3**. No viable para todo, pero sí para ~50 capítulos clave.

---

### Enfoque C: TTS API On-Demand (Premium + Costoso)
> Costo: **$5-20/mes** | Esfuerzo: **Alto** | Impacto: **Muy Alto**

Usar ElevenLabs o Google Cloud TTS vía un Worker de Cloudflare:

```
Usuario → Click "Escuchar" → Worker API → ElevenLabs/Google TTS → Audio stream
```

**Problema**: Costo por request, latencia de API, requiere Worker SSR.

---

## Recomendación

> [!TIP]
> **Enfoque A (Optimizar Web Speech API)** es la mejor relación costo-beneficio. Cero costo, mejora dramática en UX, y se puede implementar en ~4 horas.

### Mejoras concretas a implementar

| # | Mejora | Impacto | Esfuerzo |
|:-:|:-------|:-------:|:--------:|
| 1 | Leer versículo por versículo (no por chunks de chars) | 🔴 Alto | 🔧 Medio |
| 2 | Highlight + auto-scroll del versículo activo | 🔴 Alto | 🔧 Medio |
| 3 | Barra de progreso (versículo X de Y) | 🟡 Medio | 🔨 Bajo |
| 4 | Selector de voz española | 🟡 Medio | 🔨 Bajo |
| 5 | Control de velocidad (slider) | 🟡 Medio | 🔨 Bajo |
| 6 | Persistir preferencias (localStorage) | 🟢 Bajo | ⚡ Mínimo |
| 7 | Eliminar console.logs | 🟢 Bajo | ⚡ Mínimo |
| 8 | Botón reanudar desde versículo específico | 🟡 Medio | 🔧 Medio |

---

## 🎙️ Mejoras de Calidad de Voz

La calidad de voz depende del **browser + OS**, no solo del código. Aquí están las opciones reales:

### Ranking de calidad de voces en español (gratis, sin API)

| Browser/OS | Voces disponibles | Calidad |
|:-----------|:-----------------|:-------:|
| **Edge (Windows)** | Microsoft Neural voices (`es-ES-ElviraNeural`, `es-MX-DaliaNeural`) | ⭐⭐⭐⭐⭐ Casi humanas |
| **Chrome (cualquier OS)** | Google voices (`Google español`) | ⭐⭐⭐⭐ Muy buenas |
| **Safari (macOS/iOS)** | Apple voices (`Mónica`, `Paulina`) | ⭐⭐⭐⭐ Buenas |
| **Firefox (Windows)** | SAPI5/eSpeak | ⭐⭐ Robóticas |
| **Chrome (Android)** | Google TTS engine del dispositivo | ⭐⭐⭐⭐ Buenas |

> [!IMPORTANT]
> **El truco clave**: Las voces de Edge Neural son casi indistinguibles de una voz humana y son 100% gratis via la Web Speech API. Si Susana usa Edge en Windows, la experiencia será excelente con zero costo.

### Implementación: Selección inteligente de voz

En vez de dejar que el browser elija la voz por defecto, podemos **rankear y auto-seleccionar la mejor voz disponible**:

```javascript
// Algoritmo de selección inteligente de voz
function getBestSpanishVoice() {
  const voices = speechSynthesis.getVoices();
  const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
  
  // Priority ranking: Neural > Google > Apple > Default
  const priority = [
    'Neural',     // Edge Neural voices (best quality)
    'Google',     // Chrome voices (very good)
    'Mónica',     // Apple macOS
    'Paulina',    // Apple Latin American
    'Microsoft',  // Standard Microsoft (decent)
  ];
  
  for (const keyword of priority) {
    const match = spanishVoices.find(v => v.name.includes(keyword));
    if (match) return match;
  }
  
  return spanishVoices[0] || voices[0]; // Fallback
}
```

### Opciones para mejorar la voz aún más

| Opción | Calidad | Costo | Implementación |
|:-------|:-------:|:-----:|:--------------:|
| **A. Smart voice selector** (auto-elegir la mejor voz del sistema) | ⭐⭐⭐⭐ | $0 | ✅ Fácil — solo código JS |
| **B. Recomendar Edge** a Susana (tip en la UI) | ⭐⭐⭐⭐⭐ | $0 | ✅ Solo un banner/tooltip |
| **C. Google Cloud TTS API** (vía Cloudflare Worker) | ⭐⭐⭐⭐⭐ | ~$4/1M chars | 🔧 Medio — requiere Worker |
| **D. ElevenLabs API** | ⭐⭐⭐⭐⭐+ | ~$5/mes | 🔧 Medio — requiere Worker |
| **E. Pre-generar con Kokoro-TTS** (skill disponible) | ⭐⭐⭐⭐ | $0 | 🏗️ Alto — 3-6 GB de audio |

> [!TIP]
> **Mi recomendación**: Implementar **A + B** primero (costo $0). Si Susana usa Edge, la voz neural es espectacular. Si usa Chrome, las voces Google son muy buenas. El selector inteligente elegirá automáticamente la mejor opción disponible.

### Futuro opcional (Enfoque B)
- Pre-generar audio para los 20 capítulos más populares con Kokoro-TTS
- Servir desde R2 con `<audio>` HTML nativo
- Detectar disponibilidad: si existe MP3 → usarlo, si no → Web Speech API
