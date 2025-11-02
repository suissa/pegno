<p align="center">
  <img src="https://i.imgur.com/cB70gh8.png" width="480" alt="PegNoMeu logo"/>
</p>

<p align="center">
El gestor global de dependencias para Bun que Bun olvidó hacer
</p>


[![Bun](https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun)](https://bun.sh)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/pegnomeu.svg)](https://www.npmjs.com/package/pegnomeu)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg)](https://www.typescriptlang.org/)

> "Un workspace global inteligente para Bun, hecho por alguien que se cansó de esperar a que Bun termine Bun."

---

<p align="center">
  <h1 align="center">¿Qué es <br /><img src="https://i.imgur.com/cB70gh8.png" height="80" alt="PegNoMeu logo"/><br />?</h1>
</p>

**PegNoMeu** es un gestor de dependencias con **caché global**, **auto-enlace**, **mini-workspaces** y **modo de sincronización instantánea** — construido 100% en **Bun + TypeScript**.

La idea nació porque Bun prometió "velocidad y simplicidad" — pero en la práctica, aún falta una capa esencial:  
**reutilización real de dependencias entre proyectos**.

Cada proyecto reinstala las mismas librerías. Cada build descarga de nuevo. Cada dev pierde tiempo.

**PegNoMeu** resuelve esto creando un **workspace global** en tu sistema, donde las dependencias se instalan una vez y se reutilizan mediante *symlinks* (o copias, si prefieres).

---

## 🧪 Motivación: ¿por qué creamos esto para Bun?

Bun es rápido.  
Pero rápido **solo** no es suficiente.

npm y pnpm ya entendieron que el futuro es **caché compartido y atomicidad de paquetes** — pero Bun aún depende de lockfiles y reinstalación redundante.

La filosofía de **PegNoMeu** es simple:

> **El código es efímero, el caché es eterno.**

Cuando instalas `axios@latest` en un proyecto, ¿por qué descargarlo de nuevo en otro?  
**PegNoMeu** crea un repositorio global (`~/.pegnomeu_workspace/js`) y enlaza los paquetes directamente a los proyectos — como un cerebro de dependencias.

Además, añade algo que ningún otro gestor ofrece:

### 🧠 Mini-workspaces (los "presets")

Puedes guardar conjuntos de dependencias y aplicarlos a cualquier proyecto:
```bash
pegnomeu axios fastify zod
# Pregunta si quieres guardar como preset → escribe "api"

pegnomeu use api
# instala todo de nuevo instantáneamente
```

---

## ⚡️ Características principales

| Característica | Descripción |
|----------|------------|
| 💾 **Caché Global Inteligente** | Cada paquete se instala solo una vez en el sistema. |
| 🪄 **Symlinks automáticos** | Sin duplicación de `node_modules`, todo apunta al caché global. |
| 📦 **Modo copia (`--copy`)** | Si quieres builds completamente aislados. |
| 📚 **Mini-Workspaces** | Crea conjuntos de dependencias nombrados y reaplica en segundos. |
| 🧩 **Compatible con cualquier proyecto Bun** | Usa solo APIs nativas (`fs`, `os`, `path`, `child_process`). |
| 🛠️ **Modo `--dev`** | Añade paquetes directamente a `devDependencies`. |
| 🧭 **Modo `sync`** | Copia todo el workspace global a `node_modules` local. |
| 🖼️ **Logs coloreados (`kleur`)** | Feedback claro y divertido. |
| 🤗 **Sin dependencias externas de runtime** | Solo `kleur` y Bun. |

---

## 🚀 Instalación

```bash
bun add -g pegnomeu

npm i -g pegnomeu

# o ejecutando directamente
npx pegnomeu
```

Verifica:
```bash
pegnomeu --help
```

Salida esperada:
```
pegnomeu CLI 1.3.0

Uso:
  pegnomeu axios@latest   → Instala paquete directamente
  pegnomeu use api        → Usa miniworkspace guardado
  pegnomeu list           → Lista miniworkspaces
  pegnomeu --dev          → Instala como devDependency
  pegnomeu --copy         → Copia en lugar de enlazar
  pegnomeu sync           → Copia todo el workspace global
  pegnomeu --verbose      → Logs detallados
```

---

## 💡 Ejemplo de uso

```bash
# Instala axios globalmente y enlaza al proyecto actual
pegnomeu axios

# Instala múltiples paquetes
pegnomeu fastify zod openai

# Añade paquetes de desarrollo
pegnomeu --dev vitest typescript

# Crea y guarda un mini-workspace
pegnomeu use api
```

---

## 📁 Estructura interna

PegNoMeu crea automáticamente:

```
~/.pegnomeu/
├── js/
│   ├── axios__latest/
│   ├── fastify__5.0.0/
│   └── zod__3.23.0/
└── presets/
    ├── api.json
    ├── web.json
    └── utils.json
```

Cada paquete es un directorio completo (caché físico y reutilizable).
Los presets son descripciones JSON con listas de dependencias.

---

## 🧠 Filosofía de diseño

El proyecto sigue tres principios:

1. **Cero redundancia** — Nada se instala dos veces.
2. **Enlace inteligente** — Cada `node_modules` es una ventana al workspace global.
3. **Simplicidad brutalista** — Todo en TypeScript, sin magia oculta.

---

## 🔮 Roadmap

- [ ] Soporte multi-lenguaje (`.pegnomeu/py`, `.pegnomeu/rust`)
- [ ] Registro basado en hash (checksum del paquete + versión)
- [ ] Sincronización distribuida vía IPFS o NFS
- [ ] UI CLI interactiva (`pegnomeu ui`)
- [ ] Integración con `pegnomeu.json` local

---

## 💬 ¿Por qué "PegNoMeu"?

Porque **toda herramienta necesita una buena provocación.**  
La idea es que "agarra tu módulo", pero de forma inteligente —  
haciendo el enlace global de lo que debería haber sido global desde el principio.

El nombre es un homenaje irónico a la cultura hacker brasileña:  
provocativa, divertida y funcional.

---

## 🧑‍💻 Autor

**Suissera da Bahia**  
Desarrollador senior apasionado por arquitecturas distribuidas, resilientes e IA.  
Creador del ecosistema **Full Agentic Stack**, **EnzyChop.Tech**, **Virion.Delivery**, y ahora… **PegNoMeu**.

---

## 📄 Licencia

MIT © Suissa — libre para usar, remezclar y mejorar.  
Pero si se rompe, fue culpa de Bun.