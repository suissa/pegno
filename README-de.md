<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="Pegno logo"/>
</p>

<p align="center">
Der globale Dependency-Manager für Bun, den Bun vergessen hat zu machen
</p>

<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/pegno" target="_blank">
    <img src="https://img.shields.io/npm/v/pegno.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "Ein intelligenter globaler Workspace für Bun, gemacht von jemandem, der es satt hatte, darauf zu warten, dass Bun Bun fertigstellt."

---

## 🌍 Idiomas / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md) | 🇹🇷 [Türkçe](README-tr.md) | 🇸🇪 [Svenska](README-se.md) | 🇻🇳 [Tiếng Việt](README-vn.md) | 🇹🇭 [ไทย](README-th.md) | 🇮🇱 [עברית](README-he.md) | 🇮🇩 [Bahasa Indonesia](README-id.md)

---

<p align="center">
  <h1 align="center">Was ist <br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="Pegno logo"/><br />?</h1>
</p>

**Pegno** ist ein Dependency-Manager mit **globalem Cache**, **Auto-Link**, **Mini-Workspaces** und **Instant-Sync-Modus**, zu 100% in **Bun + TypeScript** erstellt.

Die Idee entstand, weil Bun "Geschwindigkeit und Einfachheit" versprach, aber in der Praxis fehlt noch eine wesentliche Schicht:  
**echte Wiederverwendung von Dependencies zwischen Projekten**.

Jedes Projekt installiert dieselben Libs neu. Jeder Build lädt erneut herunter. Jeder Dev verliert Zeit.

**Pegno** löst dies, indem es einen **globalen Workspace** auf Ihrem System erstellt, wo Dependencies einmal installiert und über _Symlinks_ (oder Kopien, wenn Sie möchten) wiederverwendet werden.

---

## 🚀 Installation

```bash
bun add -g pegno

npm i -g pegno

# oder direkt ausführen
npx pegno
```

Überprüfen:

```bash
pegno --help
```

**⚠️ Windows:** Wenn der Befehl nicht erkannt wird, fügen Sie das globale Bun-Verzeichnis zum PATH hinzu:

```powershell
# Dauerhaft zum PATH hinzufügen (PowerShell als Admin)
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:USERPROFILE\.bun\bin", "User")
```

Erwartete Ausgabe:

```
pegno CLI 1.3.0

Verwendung:
  pegno axios@latest   → Installiert Paket direkt
  pegno use api        → Verwendet gespeicherten Miniworkspace
  pegno list           → Listet Miniworkspaces auf
  pegno --dev          → Installiert als devDependency
  pegno --copy         → Kopiert statt zu verlinken
  pegno sync           → Kopiert gesamten globalen Workspace
  pegno --verbose      → Detaillierte Logs
```

---

## 💡 Verwendungsbeispiel

```bash
# Installiert axios global und verlinkt zum aktuellen Projekt
pegno axios

# Installiert mehrere Pakete
pegno fastify zod openai

# Fügt Entwicklungspakete hinzu
pegno --dev vitest typescript

# Erstellt und speichert einen Mini-Workspace
pegno use api
```

### 🪟 Windows-Benutzer

Unter Windows wird empfohlen, den `--copy`-Modus zu verwenden, da es Berechtigungseinschränkungen für das Erstellen von Symlinks gibt:

```bash
# Windows: verwenden Sie --copy, um Berechtigungsfehler zu vermeiden
pegno --copy axios fastify zod

# Dev-Modus unter Windows
pegno --dev --copy vitest typescript
```

**Warum `--copy` unter Windows verwenden?**  
Windows erfordert spezielle Administratorrechte zum Erstellen von Symlinks. Der `--copy`-Modus kopiert Pakete physisch nach `node_modules` und gewährleistet vollständige Kompatibilität ohne die Notwendigkeit, als Administrator zu laufen.

---

## ⚡️ Hauptfunktionen

| Funktion                                   | Beschreibung                                                                     |
| ------------------------------------------ | -------------------------------------------------------------------------------- |
| 💾 **Intelligenter Globaler Cache**        | Jedes Paket wird nur einmal im System installiert.                               |
| 🪄 **Automatische Symlinks**               | Keine `node_modules`-Duplikation, alles zeigt auf den globalen Cache.            |
| 📚 **Kopiermodus (`--copy`)**              | Wenn Sie die Dependencies auch in `node_modules` haben möchten.                  |
| 📦 **Mini-Workspaces**                     | Erstellen Sie benannte Dependency-Sets und wenden Sie sie in Sekunden erneut an. |
| 🧩 **Kompatibel mit jedem Bun-Projekt**    | Verwendet nur native APIs (`fs`, `os`, `path`, `child_process`).                 |
| 🛠️ **`--dev`-Modus**                       | Fügt Pakete direkt zu `devDependencies` hinzu.                                   |
| 🔁 **`sync`-Modus**                        | Kopiert gesamten globalen Workspace zu lokalem `node_modules`.                   |
| 🎨 **Farbige Logs (`kleur`)**              | Level, Icons und Installationszeiten für schnelles Debugging.                    |
| 🤗 **Keine externen Runtime-Dependencies** | Nur `kleur` und Bun.                                                             |

---

## 🧑‍💻 Autor

**SuissAI**  
Senior-Entwickler mit Leidenschaft für verteilte, resiliente Architekturen und KI.  
Schöpfer des **Full Agentic Stack**, **Atomic Behavior Types** Ökosystems und jetzt… **Pegno**.

---

## 📄 Lizenz

MIT © Suissa, frei zu verwenden, zu remixen und zu verbessern.  
Aber wenn es kaputt geht, war es Buns Schuld.
