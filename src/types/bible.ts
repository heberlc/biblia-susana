// Tipos TypeScript para la estructura de la Biblia

export interface Versiculo {
  numero: number;
  texto: string;
}

export interface Capitulo {
  numero: number;
  versiculos: Versiculo[];
}

export interface Libro {
  nombre: string;
  abreviatura?: string;
  capitulos: Capitulo[];
}

export interface Biblia {
  version: string;
  libros: Libro[];
}

export interface ResultadoBusqueda {
  libro: string;
  capitulo: number;
  versiculo: number;
  texto: string;
  score?: number;
}
