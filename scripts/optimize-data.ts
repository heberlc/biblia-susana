import fs from "fs/promises";
import path from "path";
import Fuse from "fuse.js";

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

interface SearchDoc {
  libro: string;
  capitulo: number;
  versiculo: number;
  titulo: string | null;
  texto: string;
}

function slugifyBookName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function optimizeData(): Promise<void> {
  const projectRoot = process.cwd();
  const dataDir = path.join(projectRoot, "public", "data");
  const bibleFile = path.join(dataDir, "biblia-estructurada.json");
  const booksDir = path.join(dataDir, "books");

  const bibleRaw = await fs.readFile(bibleFile, "utf-8");
  const bible: Biblia = JSON.parse(bibleRaw);

  await ensureDir(booksDir);

  const booksIndex = bible.libros.map((libro) => ({
    nombre: libro.nombre,
    slug: slugifyBookName(libro.nombre),
    capitulos: libro.capitulos.length,
  }));

  await fs.writeFile(
    path.join(booksDir, "index.json"),
    JSON.stringify({ version: bible.version, libros: booksIndex }, null, 2),
    "utf-8",
  );

  await Promise.all(
    bible.libros.map(async (libro) => {
      const slug = slugifyBookName(libro.nombre);
      const outFile = path.join(booksDir, `${slug}.json`);
      await fs.writeFile(
        outFile,
        JSON.stringify(
          {
            version: bible.version,
            libro: {
              nombre: libro.nombre,
              capitulos: libro.capitulos,
            },
          },
          null,
          2,
        ),
        "utf-8",
      );
    }),
  );

  const searchDocs: SearchDoc[] = [];
  for (const libro of bible.libros) {
    for (const capitulo of libro.capitulos) {
      for (const versiculo of capitulo.versiculos) {
        searchDocs.push({
          libro: libro.nombre,
          capitulo: capitulo.numero,
          versiculo: versiculo.numero,
          titulo: versiculo.titulo ?? null,
          texto: versiculo.texto,
        });
      }
    }
  }

  const fuseOptions = {
    keys: ["texto", "titulo"],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 3,
    ignoreLocation: true,
  };

  const fuseIndex = Fuse.createIndex(fuseOptions.keys, searchDocs);
  await fs.writeFile(
    path.join(dataDir, "search-index.json"),
    JSON.stringify(
      {
        options: fuseOptions,
        docs: searchDocs,
        index: fuseIndex.toJSON(),
      },
      null,
      2,
    ),
    "utf-8",
  );

  console.log(
    `Data optimized: ${booksIndex.length} books split + ${searchDocs.length} search docs indexed.`,
  );
}

optimizeData().catch((error) => {
  console.error("Error optimizing data:", error);
  process.exit(1);
});
