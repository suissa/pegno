<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="Pegno logo"/>
</p>

<p align="center">
The global dependency manager for Bun that Bun forgot to make
</p>

<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/pegno" target="_blank">
    <img src="https://img.shields.io/npm/v/pegno.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "An intelligent global workspace for Bun, made by someone who got tired of waiting for Bun to finish Bun."

---

## 🌍 Languages / Idiomas

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md) | 🇹🇷 [Türkçe](README-tr.md) | 🇸🇪 [Svenska](README-se.md) | 🇻🇳 [Tiếng Việt](README-vn.md) | 🇹🇭 [ไทย](README-th.md) | 🇮🇱 [עברית](README-he.md) | 🇮🇩 [Bahasa Indonesia](README-id.md)

---

<p align="center">
  <h1 align="center">What is <br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="Pegno logo"/><br />?</h1>
</p>

**Pegno** is a dependency manager with **global cache**, **auto-link**, **mini-workspaces** and **instant sync mode** — built 100% in **Bun + TypeScript**.

The idea was born because Bun promised "speed and simplicity" — but in practice, an essential layer is still missing:  
**real dependency reuse between projects**.

Each project reinstalls the same libs. Each build downloads again. Each dev wastes time.

**Pegno** solves this by creating a **global workspace** on your system, where dependencies are installed once and reused via _symlinks_ (or copies, if you prefer).

---

## 🫠🤌🏻💗 Motivation: why did I create this for Bun?

Bun is fast.  
But fast **alone** is not enough.

npm and pnpm already understood that the future is **shared cache and package atomicity** — but Bun still depends on lockfiles and redundant reinstallation.

The **Pegno** philosophy is simple:

> **Code is ephemeral, cache is eternal.**

When you install `axios@latest` in one project, why download it again in another?  
**Pegno** creates a global repository (`~/.pegno_workspace/js`) and links packages directly to projects — like a dependency brain.

Additionally, it adds something no other manager offers:

### 🧠 Mini-workspaces (the "presets")

You can save dependency sets and apply them to any project:

```bash
pegno axios fastify zod
# Asks if you want to save as preset → type "api"

pegno use api
# installs everything again instantly
```

---

## ⚡️ Main features

| Feature                                 | Description                                                       |
| --------------------------------------- | ----------------------------------------------------------------- |
| 💾 **Intelligent Global Cache**         | Each package is installed only once on the system.                |
| 🪄 **Automatic Symlinks**               | No `node_modules` duplication, everything points to global cache. |
| 📦 **Copy mode (`--copy`)**             | If you want completely isolated builds.                           |
| 📚 **Mini-Workspaces**                  | Create named dependency sets and reapply in seconds.              |
| 🧩 **Compatible with any Bun project**  | Uses only native APIs (`fs`, `os`, `path`, `child_process`).      |
| 🛠️ **`--dev` mode**                     | Adds packages directly to `devDependencies`.                      |
| 🧭 **`sync` mode**                      | Copies entire global workspace to local `node_modules`.           |
| 🎨 **Colored logs (`kleur`)**           | Levels, icons and installation times for quick debugging.         |
| 🤗 **No external runtime dependencies** | Only `kleur` and Bun. 💯🚀🎯                                      |

---

## 🚀 Installation

```bash
bun add -g pegno

npm i -g pegno

# or running directly
npx pegno
```

Verify:

```bash
pegno --help
```

**⚠️ Windows:** If the command is not recognized, add Bun's global directory to PATH:

```powershell
# Add permanently to PATH (PowerShell as Admin)
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:USERPROFILE\.bun\bin", "User")
```

Expected output:

```
pegno CLI 1.3.0

Usage:
  pegno axios@latest   → Installs package directly
  pegno use api        → Uses saved miniworkspace
  pegno list           → Lists miniworkspaces
  pegno --dev          → Installs as devDependency
  pegno --copy         → Copies instead of linking
  pegno sync           → Copies entire global workspace
  pegno --verbose      → Detailed logs
```

---

## 💡 Usage example

```bash
# Installs axios globally and links to current project
pegno axios

# Installs multiple packages
pegno fastify zod openai

# Adds development packages
pegno --dev vitest typescript

# Creates and saves a mini-workspace
pegno use api
```

### 🪟 Windows Users

On Windows, it's recommended to use `--copy` mode due to permission restrictions for creating symlinks:

```bash
# Windows: use --copy to avoid permission errors
pegno --copy axios fastify zod

# Dev mode on Windows
pegno --dev --copy vitest typescript
```

**Why use `--copy` on Windows?**  
Windows requires special administrative privileges to create symlinks. The `--copy` mode physically copies packages to `node_modules`, ensuring full compatibility without needing to run as administrator.

---

## 📁 Internal structure

Pegno automatically creates:

```
~/.pegno/
├── js/
│   ├── axios__latest/
│   ├── fastify__5.0.0/
│   └── zod__3.23.0/
└── presets/
    ├── api.json
    ├── web.json
    └── utils.json
```

Each package is a complete directory (physical and reusable cache).
Presets are JSON descriptions with dependency lists.

---

## 🧠 Design philosophy

The project follows three principles:

1. **Zero redundancy** — Nothing is installed twice.
2. **Intelligent linking** — Each `node_modules` is a window to the global workspace.
3. **Brutalist simplicity** — Everything in TypeScript, no hidden magic.

---

## 🔮 Roadmap

- [ ] Hash-based registry (package checksum + version)
- [ ] Interactive CLI UI (`pegno ui`)

---

## 💬 Why "Pegno"?

Because **every tool needs a good provocation.**  
The idea is that it "grabs your module", but intelligently —  
making the global link of what should have been global from the beginning.

The name is an ironic homage to Brazilian hacker culture:  
provocative, good-humored and functional.

---

## 🧑‍💻 Author

**SuissAI**  
Senior developer passionate about distributed, resilient architectures and AI.  
Creator of the **Full Agentic Stack**, **Atomic Behavior Types** ecosystem, and now… **Pegno**.

---

## 📄 License

MIT © Suissa — free to use, remix and improve.  
But if it breaks, it was Bun's fault.
