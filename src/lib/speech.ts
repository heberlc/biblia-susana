// Módulo para Web Speech API con selección inteligente de voz
// Solo funciona en el navegador

let synth: SpeechSynthesis | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

// ====== Preferencias persistentes ======
const STORAGE_KEYS = {
  voice: 'biblia-voice-name',
  rate: 'biblia-speech-rate',
} as const;

function getStoredRate(): number {
  if (typeof localStorage === 'undefined') return 0.9;
  const saved = localStorage.getItem(STORAGE_KEYS.rate);
  return saved ? parseFloat(saved) : 0.9;
}

function getStoredVoiceName(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.voice);
}

export function setRate(rate: number): void {
  const clamped = Math.max(0.5, Math.min(2.0, rate));
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.rate, clamped.toString());
  }
}

export function getRate(): number {
  return getStoredRate();
}

export function setVoiceName(name: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.voice, name);
  }
}

// ====== Selección inteligente de voz ======
export function getSpanishVoices(): SpeechSynthesisVoice[] {
  if (!synth) return [];
  return synth.getVoices().filter(v => v.lang.startsWith('es'));
}

export function getBestSpanishVoice(): SpeechSynthesisVoice | null {
  const voices = getSpanishVoices();
  if (voices.length === 0) return null;

  // Si hay una voz guardada, intentar usarla
  const savedName = getStoredVoiceName();
  if (savedName) {
    const saved = voices.find(v => v.name === savedName);
    if (saved) return saved;
  }

  // Ranking de prioridad: Neural > Google > Apple > Microsoft > default
  const priority = ['Neural', 'Google', 'Mónica', 'Paulina', 'Jorge', 'Microsoft'];
  for (const keyword of priority) {
    const match = voices.find(v => v.name.includes(keyword));
    if (match) return match;
  }

  return voices[0];
}

// ====== Inicialización ======
export function initSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    synth = window.speechSynthesis;
    // Forzar carga de voces (en móvil son async)
    synth.getVoices();
    synth.onvoiceschanged = () => {
      synth?.getVoices();
    };
  }
}

// ====== TTS ======
export function speechRead(text: string, onEnd?: () => void): void {
  if (!synth) return;

  speechStop();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'es-ES';
  currentUtterance.rate = getStoredRate();
  currentUtterance.pitch = 1.0;
  currentUtterance.volume = 1.0;

  const voice = getBestSpanishVoice();
  if (voice) {
    currentUtterance.voice = voice;
    currentUtterance.lang = voice.lang;
  }

  if (onEnd) {
    currentUtterance.onend = onEnd;
  }

  synth.speak(currentUtterance);
}

export function speechStop(): void {
  if (synth) {
    synth.cancel();
    currentUtterance = null;
  }
}

export function speechPause(): void {
  if (synth && synth.speaking) {
    synth.pause();
  }
}

export function speechResume(): void {
  if (synth && synth.paused) {
    synth.resume();
  }
}

export function isSpeaking(): boolean {
  return synth ? synth.speaking : false;
}

export function isPaused(): boolean {
  return synth ? synth.paused : false;
}

// ====== Reconocimiento de voz ======
export function speechRecognize(
  callback: (text: string) => void,
  errorCallback?: (error: string) => void
): void {
  if (typeof window === 'undefined') {
    errorCallback?.('Web Speech API no disponible en el servidor');
    return;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    errorCallback?.('Reconocimiento de voz no disponible en este navegador');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    callback(transcript);
  };

  recognition.onerror = (event: any) => {
    errorCallback?.(event.error);
  };

  recognition.start();
}
