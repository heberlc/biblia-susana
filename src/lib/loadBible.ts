// Módulo para cargar la Biblia una sola vez
import type { Biblia, Libro } from '../types/bible';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

let bibliaCache: Biblia | null = null;
type BooksIndex = { version: string; libros: { nombre: string; slug: string; capitulos: number }[] };
let booksIndexCache: BooksIndex | null = null;

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

export async function loadBooksIndex(): Promise<BooksIndex> {
  if (booksIndexCache) return booksIndexCache;

  if (typeof window === 'undefined') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const indexPath = join(__dirname, '..', '..', 'public', 'data', 'books', 'index.json');
    const raw = await readFile(indexPath, 'utf-8');
    const parsed = JSON.parse(raw) as BooksIndex;
    booksIndexCache = parsed;
    return parsed;
  }

  const response = await fetch('/data/books/index.json');
  if (!response.ok) {
    throw new Error(`Error al cargar books/index.json: ${response.statusText}`);
  }
  const parsed = (await response.json()) as BooksIndex;
  booksIndexCache = parsed;
  return parsed;
}

export async function loadBookBySlug(slug: string): Promise<{ version: string; libro: Libro }> {
  if (typeof window === 'undefined') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const bookPath = join(__dirname, '..', '..', 'public', 'data', 'books', `${slug}.json`);
    const raw = await readFile(bookPath, 'utf-8');
    return JSON.parse(raw);
  }

  const response = await fetch(`/data/books/${encodeURIComponent(slug)}.json`);
  if (!response.ok) {
    throw new Error(`Error al cargar books/${slug}.json: ${response.statusText}`);
  }
  return response.json();
}
