<p align="center">
  <img src="https://i.imgur.com/cB70gh8.png" width="480" alt="PegNoMeu logo"/>
</p>

<p align="center">
Der globale Dependency-Manager für Bun, den Bun vergessen hat zu machen
</p>


[![Bun](https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun)](https://bun.sh)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/pegnomeu.svg)](https://www.npmjs.com/package/pegnomeu)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg)](https://www.typescriptlang.org/)

> "Ein intelligenter globaler Workspace für Bun, gemacht von jemandem, der es satt hatte, darauf zu warten, dass Bun Bun fertigstellt."

---

<p align="center">
  <h1 align="center">Was ist <br /><img src="https://i.imgur.com/cB70gh8.png" height="80" alt="PegNoMeu logo"/><br />?</h1>
</p>

**PegNoMeu** ist ein Dependency-Manager mit **globalem Cache**, **Auto-Link**, **Mini-Workspaces** und **Instant-Sync-Modus** — zu 100% in **Bun + TypeScript** entwickelt.

Die Idee entstand, weil Bun "Geschwindigkeit und Einfachheit" versprach — aber in der Praxis fehlt noch eine wesentliche Schicht:  
**echte Wiederverwendung von Dependencies zwischen Projekten**.

Jedes Projekt installiert dieselben Bibliotheken neu. Jeder Build lädt erneut herunter. Jeder Entwickler verliert Zeit.

**PegNoMeu** löst dies, indem es einen **globalen Workspace** auf Ihrem System erstellt, wo Dependencies einmal installiert und über *Symlinks* (oder Kopien, wenn Sie möchten) wiederverwendet werden.

---

## 🧪 Motivation: Warum haben wir das für Bun erstellt?

Bun ist schnell.  
Aber schnell **allein** reicht nicht aus.

npm und pnpm haben bereits verstanden, dass die Zukunft **geteilter Cache und Package-Atomarität** ist — aber Bun hängt immer noch von Lockfiles und redundanter Neuinstallation ab.

Die **PegNoMeu**-Philosophie ist einfach:

> **Code ist vergänglich, Cache ist ewig.**

Wenn Sie `axios@latest` in einem Projekt installieren, warum sollten Sie es in einem anderen erneut herunterladen?  
**PegNoMeu** erstellt ein globales Repository (`~/.pegnomeu_workspace/js`) und verlinkt Pakete direkt zu Projekten — wie ein Dependency-Gehirn.

Zusätzlich fügt es etwas hinzu, was kein anderer Manager bietet:

### 🧠 Mini-Workspaces (die "Presets")

Sie können Dependency-Sets speichern und auf jedes Projekt anwenden:
```bash
pegnomeu axios fastify zod
# Fragt, ob Sie als Preset speichern möchten → geben Sie "api" ein

pegnomeu use api
# installiert alles sofort erneut
```

---

## ⚡️ Hauptfunktionen

| Funktion | Beschreibung |
|----------|------------|
| 💾 **Intelligenter Globaler Cache** | Jedes Paket wird nur einmal im System installiert. |
| 🪄 **Automatische Symlinks** | Keine `node_modules`-Duplikation, alles zeigt auf den globalen Cache. |
| 📦 **Kopiermodus (`--copy`)** | Wenn Sie vollständig isolierte Builds wollen. |
| 📚 **Mini-Workspaces** | Erstellen Sie benannte Dependency-Sets und wenden Sie sie in Sekunden erneut an. |
| 🧩 **Kompatibel mit jedem Bun-Projekt** | Verwendet nur native APIs (`fs`, `os`, `path`, `child_process`). |
| 🛠️ **`--dev`-Modus** | Fügt Pakete direkt zu `devDependencies` hinzu. |
| 🧭 **`sync`-Modus** | Kopiert den gesamten globalen Workspace zu lokalen `node_modules`. |
| 🖼️ **Farbige Logs (`kleur`)** | Klares und unterhaltsames Feedback. |
| 🤗 **Keine externen Runtime-Dependencies** | Nur `kleur` und Bun. |

---

## 🚀 Installation

```bash
bun add -g pegnomeu

npm i -g pegnomeu

# oder direkt ausführen
npx pegnomeu
```

Überprüfen:
```bash
pegnomeu --help
```

Erwartete Ausgabe:
```
pegnomeu CLI 1.3.0

Verwendung:
  pegnomeu axios@latest   → Installiert Paket direkt
  pegnomeu use api        → Verwendet gespeicherten Miniworkspace
  pegnomeu list           → Listet Miniworkspaces auf
  pegnomeu --dev          → Installiert als devDependency
  pegnomeu --copy         → Kopiert statt zu verlinken
  pegnomeu sync           → Kopiert gesamten globalen Workspace
  pegnomeu --verbose      → Detaillierte Logs
```

---

## 💡 Verwendungsbeispiel

```bash
# Installiert axios global und verlinkt zum aktuellen Projekt
pegnomeu axios

# Installiert mehrere Pakete
pegnomeu fastify zod openai

# Fügt Entwicklungspakete hinzu
pegnomeu --dev vitest typescript

# Erstellt und speichert einen Mini-Workspace
pegnomeu use api
```

---

## 📁 Interne Struktur

PegNoMeu erstellt automatisch:

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

Jedes Paket ist ein vollständiges Verzeichnis (physischer und wiederverwendbarer Cache).
Presets sind JSON-Beschreibungen mit Dependency-Listen.

---

## 🧠 Design-Philosophie

Das Projekt folgt drei Prinzipien:

1. **Null Redundanz** — Nichts wird zweimal installiert.
2. **Intelligente Verlinkung** — Jede `node_modules` ist ein Fenster zum globalen Workspace.
3. **Brutalistische Einfachheit** — Alles in TypeScript, keine versteckte Magie.

---

## 🔮 Roadmap

- [ ] Multi-Sprachen-Unterstützung (`.pegnomeu/py`, `.pegnomeu/rust`)
- [ ] Hash-basierte Registry (Package-Checksum + Version)
- [ ] Verteilte Synchronisation via IPFS oder NFS
- [ ] Interaktive CLI-UI (`pegnomeu ui`)
- [ ] Integration mit lokaler `pegnomeu.json`

---

## 💬 Warum "PegNoMeu"?

Weil **jedes Tool eine gute Provokation braucht.**  
Die Idee ist, dass es "dein Modul greift", aber intelligent —  
die globale Verlinkung dessen macht, was von Anfang an global hätte sein sollen.

Der Name ist eine ironische Hommage an die brasilianische Hacker-Kultur:  
provokativ, humorvoll und funktional.

---

## 🧑‍💻 Autor

**Suissera da Bahia**  
Senior-Entwickler mit Leidenschaft für verteilte, resiliente Architekturen und KI.  
Schöpfer des **Full Agentic Stack**, **EnzyChop.Tech**, **Virion.Delivery**-Ökosystems und jetzt… **PegNoMeu**.

---

## 📄 Lizenz

MIT © Suissa — frei zu verwenden, zu remixen und zu verbessern.  
Aber wenn es kaputt geht, war es Buns Schuld.