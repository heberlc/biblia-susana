// Módulo para Web Speech API (solo cliente)
// Este código solo funciona en el navegador

let speechSynthesis: SpeechSynthesis | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

// Inicializar en el cliente
export function initSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis;
  }
}

// Leer texto en voz alta
export function speechRead(text: string): void {
  if (!speechSynthesis) {
    console.warn('Web Speech API no está disponible');
    return;
  }

  // Detener cualquier lectura anterior
  speechStop();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'es-ES';
  currentUtterance.rate = 0.9; // Velocidad ligeramente más lenta
  currentUtterance.pitch = 1.0;
  currentUtterance.volume = 1.0;

  speechSynthesis.speak(currentUtterance);
}

// Detener la lectura
export function speechStop(): void {
  if (speechSynthesis) {
    speechSynthesis.cancel();
    currentUtterance = null;
  }
}

// Verificar si está hablando
export function isSpeaking(): boolean {
  return speechSynthesis ? speechSynthesis.speaking : false;
}

// Reconocimiento de voz (búsqueda por voz)
export function speechRecognize(callback: (text: string) => void, errorCallback?: (error: string) => void): void {
  if (typeof window === 'undefined') {
    errorCallback?.('Web Speech API no disponible en el servidor');
    return;
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

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
