// Módulo para cargar la Biblia una sola vez
import type { Biblia } from '../types/bible';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

let bibliaCache: Biblia | null = null;

export async function loadBible(): Promise<Biblia> {
  if (bibliaCache) {
    return bibliaCache;
  }

  try {
    // En el servidor (Astro build), leer con fs
    if (typeof window === 'undefined') {
      // Servidor: usar fs para leer el JSON
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const bibliaPath = join(__dirname, '..', '..', 'public', 'data', 'biblia-estructurada.json');
      const data = await readFile(bibliaPath, 'utf-8');
      bibliaCache = JSON.parse(data);
    } else {
      // Cliente: usar fetch
      const response = await fetch('/data/biblia-estructurada.json');
      if (!response.ok) {
        throw new Error(`Error al cargar biblia-estructurada.json: ${response.statusText}`);
      }
      bibliaCache = await response.json();
    }
    return bibliaCache as Biblia;
  } catch (error) {
    console.error('Error al cargar la Biblia:', error);
    throw error;
  }
}

export function getBibleFromCache(): Biblia | null {
  return bibliaCache;
}
