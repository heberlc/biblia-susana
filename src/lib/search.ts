// Módulo de búsqueda con Fuse.js
import Fuse from 'fuse.js';
import type { Biblia, ResultadoBusqueda } from '../types/bible';

let fuseInstance: Fuse<ResultadoBusqueda> | null = null;

export function initializeSearch(biblia: Biblia): void {
  // Crear un índice plano de todos los versículos
  const versiculos: ResultadoBusqueda[] = [];

  biblia.libros.forEach(libro => {
    libro.capitulos.forEach(capitulo => {
      capitulo.versiculos.forEach(versiculo => {
        versiculos.push({
          libro: libro.nombre,
          capitulo: capitulo.numero,
          versiculo: versiculo.numero,
          texto: versiculo.texto,
        });
      });
    });
  });

  // Configurar Fuse.js
  const options = {
    keys: ['texto'],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 3,
    ignoreLocation: true,
  };

  fuseInstance = new Fuse(versiculos, options);
}

export function buscar(query: string): ResultadoBusqueda[] {
  if (!fuseInstance) {
    console.warn('Fuse.js no ha sido inicializado');
    return [];
  }

  if (!query || query.trim().length < 2) {
    return [];
  }

  const resultados = fuseInstance.search(query);
  return resultados.map(r => ({
    ...r.item,
    score: r.score,
  }));
}

export function getSearchInstance(): Fuse<ResultadoBusqueda> | null {
  return fuseInstance;
}
