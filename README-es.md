<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="Pegno logo"/>
</p>

<p align="center">
El gestor global de dependencias para Bun que Bun olvidó hacer
</p>

<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/pegno" target="_blank">
    <img src="https://img.shields.io/npm/v/pegno.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "Un workspace global inteligente para Bun, hecho por alguien que se cansó de esperar a que Bun termine Bun."

---

## 🌍 Idiomas / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md) | 🇹🇷 [Türkçe](README-tr.md) | 🇸🇪 [Svenska](README-se.md) | 🇻🇳 [Tiếng Việt](README-vn.md) | 🇹🇭 [ไทย](README-th.md) | 🇮🇱 [עברית](README-he.md) | 🇮🇩 [Bahasa Indonesia](README-id.md)

---

<p align="center">
  <h1 align="center">¿Qué es <br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="Pegno logo"/><br />?</h1>
</p>

**Pegno** es un gestor de dependencias con **caché global**, **auto-enlace**, **mini-workspaces** y **modo de sincronización instantánea**, hecho 100% en **Bun + TypeScript**.

La idea nació porque Bun prometió "velocidad y simplicidad", pero en la práctica, aún falta una capa esencial:  
**reutilización real de dependencias entre proyectos**.

Cada proyecto reinstala las mismas librerías. Cada build descarga de nuevo. Cada dev pierde tiempo.

**Pegno** resuelve esto creando un **workspace global** en tu sistema, donde las dependencias se instalan una sola vez y se reutilizan mediante _symlinks_ (o copias, si prefieres).

---

## 🚀 Instalación

```bash
bun add -g pegno

npm i -g pegno

# o ejecutando directamente
npx pegno
```

Verificar:

```bash
pegno --help
```

**⚠️ Windows:** Si el comando no es reconocido, añade el directorio global de Bun al PATH:

```powershell
# Añadir permanentemente al PATH (PowerShell como Admin)
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:USERPROFILE\.bun\bin", "User")
```

Salida esperada:

```
pegno CLI 1.3.0

Uso:
  pegno axios@latest   → Instala paquete directamente
  pegno use api        → Usa miniworkspace guardado
  pegno list           → Lista miniworkspaces
  pegno --dev          → Instala como devDependency
  pegno --copy         → Copia en lugar de enlazar
  pegno sync           → Copia todo el workspace global
  pegno --verbose      → Logs detallados
```

---

## 💡 Ejemplo de uso

```bash
# Instala axios globalmente y enlaza al proyecto actual
pegno axios

# Instala múltiples paquetes
pegno fastify zod openai

# Añade paquetes de desarrollo
pegno --dev vitest typescript

# Crea y guarda un mini-workspace
pegno use api
```

### 🪟 Usuarios de Windows

En Windows, se recomienda usar el modo `--copy` debido a las restricciones de permisos para crear symlinks:

```bash
# Windows: usa --copy para evitar errores de permisos
pegno --copy axios fastify zod

# Modo dev en Windows
pegno --dev --copy vitest typescript
```

**¿Por qué usar `--copy` en Windows?**  
Windows requiere privilegios administrativos especiales para crear symlinks. El modo `--copy` copia físicamente los paquetes a `node_modules`, garantizando compatibilidad total sin necesidad de ejecutar como administrador.

---

## ⚡️ Características principales

| Característica                               | Descripción                                                         |
| -------------------------------------------- | ------------------------------------------------------------------- |
| 💾 **Caché Global Inteligente**              | Cada paquete se instala una sola vez en el sistema.                 |
| 🪄 **Symlinks automáticos**                  | Sin duplicación de `node_modules`, todo apunta al caché global.     |
| 📚 **Modo de copia (`--copy`)**              | Si quieres las dependencias en `node_modules` también.              |
| 📦 **Mini-Workspaces**                       | Crea conjuntos de dependencias nombrados y reaplícalos en segundos. |
| 🧩 **Compatible con cualquier proyecto Bun** | Usa solo APIs nativas (`fs`, `os`, `path`, `child_process`).        |
| 🛠️ **Modo `--dev`**                          | Añade paquetes directamente a `devDependencies`.                    |
| 🔁 **Modo `sync`**                           | Copia todo el workspace global a `node_modules` local.              |
| 🎨 **Logs coloridos (`kleur`)**              | Niveles, iconos y tiempos de instalación para depuración rápida.    |
| 🤗 **Sin dependencias externas de runtime**  | Solo `kleur` y Bun.                                                 |

---

## 🧑‍💻 Autor

**SuissAI**  
Desarrollador senior apasionado por arquitecturas distribuidas, resilientes e IA.  
Creador del ecosistema **Full Agentic Stack**, **Atomic Behavior Types**, y ahora… **Pegno**.

---

## 📄 Licencia

MIT © Suissa, libre para usar, remezclar y mejorar.  
Pero si se rompe, fue culpa de Bun.
