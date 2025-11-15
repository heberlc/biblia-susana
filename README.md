# 📖 Biblia Susana

Aplicación web accesible para leer y estudiar la Biblia en español, con herramientas de búsqueda inteligente y lectura en voz alta.

## ✨ Características

- 📚 **66 libros completos** - Antiguo y Nuevo Testamento
- 🔍 **Búsqueda inteligente** - Busca por texto, títulos y referencias
- 🔊 **Lectura en voz alta** - Escucha versículos individuales o capítulos completos
- 🌓 **Modo oscuro/claro** - Interfaz adaptable para cualquier momento
- ♿ **Accesible** - Diseñada con accesibilidad en mente
- 📱 **Responsive** - Funciona en móviles, tablets y desktop
- 🎯 **Títulos de versículos** - Títulos descriptivos en versículos clave

## 🚀 Estructura del Proyecto

```text
/
├── public/
│   └── data/
│       ├── biblia.json               # Datos originales de la Biblia
│       └── biblia-estructurada.json  # Biblia procesada con 31,139 versículos
├── src/
│   ├── components/
│   │   ├── ChapterSpeechButton.astro # Control de lectura de capítulos
│   │   └── SpeechButton.astro        # Control de lectura de versículos
│   ├── layouts/
│   │   └── Layout.astro              # Layout principal con header y footer
│   ├── lib/
│   │   ├── bible.ts                  # Carga de datos de la Biblia
│   │   └── speech.ts                 # Web Speech API
│   ├── pages/
│   │   ├── index.astro               # Página principal con lista de libros
│   │   ├── buscar-client.astro       # Búsqueda con Fuse.js
│   │   └── libro/
│   │       └── [nombre]/
│   │           ├── index.astro       # Lista de capítulos
│   │           └── [capitulo].astro  # Lectura de capítulo
│   ├── styles/
│   │   └── global.css                # Estilos globales con Tailwind
│   └── types/
│       └── bible.ts                  # TypeScript interfaces
├── scripts/
│   └── transformar-biblia.ts         # Script para procesar biblia.json
└── package.json
```

## 🧞 Comandos

Ejecuta estos comandos desde la raíz del proyecto:

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Instala dependencias                             |
| `pnpm dev`                | Inicia servidor de desarrollo en `localhost:4321`|
| `pnpm build`              | Construye el sitio para producción en `./dist/`  |
| `pnpm preview`            | Previsualiza la build antes de desplegar         |
| `pnpm astro ...`          | Ejecuta comandos CLI de Astro                    |

## 🛠️ Tecnologías

- **[Astro 5.15](https://astro.build)** - Framework web moderno
- **[Tailwind CSS 4.1](https://tailwindcss.com)** - Estilos utility-first
- **[Fuse.js 7.1](https://fusejs.io)** - Búsqueda fuzzy client-side
- **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)** - Síntesis de voz nativa del navegador
- **TypeScript** - Tipado estático

## 📊 Datos

- **66 libros bíblicos** (39 AT + 27 NT)
- **31,139 versículos** con texto completo
- **Títulos opcionales** en versículos clave
- Formato JSON estructurado jerárquicamente

## 👨‍💻 Autor

Creado con ❤️ por **HeberDev**

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
