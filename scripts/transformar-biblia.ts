// Script para transformar biblia.json de formato plano a formato estructurado
import fs from 'fs/promises';
import path from 'path';

interface VersiculoPlano {
  id: string;
  libro: string;
  capitulo: number;
  versiculo: number;
  titulo: string | null;
  texto: string;
}

interface Versiculo {
  numero: number;
  titulo?: string;
  texto: string;
}

interface Capitulo {
  numero: number;
  versiculos: Versiculo[];
}

interface Libro {
  nombre: string;
  capitulos: Capitulo[];
}

interface Biblia {
  version: string;
  libros: Libro[];
}

async function transformarBiblia() {
  try {
    console.log('Leyendo biblia.json...');
    const data = await fs.readFile('public/data/biblia.json', 'utf-8');
    const versiculosPlanos: VersiculoPlano[] = JSON.parse(data);
    
    console.log(`Total de versículos: ${versiculosPlanos.length}`);
    
    // Agrupar por libro
    const librosMap = new Map<string, Map<number, Versiculo[]>>();
    
    versiculosPlanos.forEach((v) => {
      if (!librosMap.has(v.libro)) {
        librosMap.set(v.libro, new Map());
      }
      
      const capitulosMap = librosMap.get(v.libro)!;
      if (!capitulosMap.has(v.capitulo)) {
        capitulosMap.set(v.capitulo, []);
      }
      
      const versiculo: Versiculo = {
        numero: v.versiculo,
        texto: v.texto
      };
      
      // Solo agregar título si existe
      if (v.titulo) {
        versiculo.titulo = v.titulo;
      }
      
      capitulosMap.get(v.capitulo)!.push(versiculo);
    });
    
    // Construir estructura final
    const libros: Libro[] = [];
    
    librosMap.forEach((capitulosMap, nombreLibro) => {
      const capitulos: Capitulo[] = [];
      
      // Ordenar capítulos
      const numerosCapitulos = Array.from(capitulosMap.keys()).sort((a, b) => a - b);
      
      numerosCapitulos.forEach((numCapitulo) => {
        const versiculos = capitulosMap.get(numCapitulo)!;
        // Ordenar versículos
        versiculos.sort((a, b) => a.numero - b.numero);
        
        capitulos.push({
          numero: numCapitulo,
          versiculos: versiculos
        });
      });
      
      libros.push({
        nombre: nombreLibro,
        capitulos: capitulos
      });
    });
    
    // Ordenar libros según el orden bíblico tradicional
    const ordenLibros = [
      // Antiguo Testamento (39 libros)
      'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
      'Josué', 'Jueces', 'Rut', 
      '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes',
      '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester',
      'Job', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares',
      'Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel',
      'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas', 
      'Nahúm', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías',
      // Nuevo Testamento (27 libros)
      'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos',
      'Romanos', '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios', 
      'Filipenses', 'Colosenses',
      '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo', '2 Timoteo', 
      'Tito', 'Filemón',
      'Hebreos', 'Santiago', '1 Pedro', '2 Pedro', 
      '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis'
    ];
    
    libros.sort((a, b) => {
      const indexA = ordenLibros.indexOf(a.nombre);
      const indexB = ordenLibros.indexOf(b.nombre);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
    
    const bibliaEstructurada: Biblia = {
      version: 'Reina-Valera 1960',
      libros: libros
    };
    
    console.log(`Total de libros: ${libros.length}`);
    console.log('Guardando biblia-estructurada.json...');
    
    await fs.writeFile(
      'public/data/biblia-estructurada.json',
      JSON.stringify(bibliaEstructurada, null, 2),
      'utf-8'
    );
    
    console.log('✅ Transformación completada!');
    console.log('Archivo creado: public/data/biblia-estructurada.json');
    
  } catch (error) {
    console.error('Error al transformar la Biblia:', error);
    process.exit(1);
  }
}

transformarBiblia();
