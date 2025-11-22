<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="Pegno logo"/>
</p>

<p align="center">
De globale dependency manager voor Bun die Bun vergat te maken
</p>

<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/pegno" target="_blank">
    <img src="https://img.shields.io/npm/v/pegno.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "Een intelligente globale workspace voor Bun, gemaakt door iemand die het zat was om te wachten tot Bun Bun zou afmaken."

---

## 🌍 Talen / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md)

---

<p align="center">
  <h1 align="center">Wat is <br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="Pegno logo"/><br />?</h1>
</p>

**Pegno** is een dependency manager met **globale cache**, **auto-link**, **mini-workspaces** en **instant sync modus** — 100% gebouwd in **Bun + TypeScript**.

Het idee ontstond omdat Bun "snelheid en eenvoud" beloofde — maar in de praktijk ontbreekt er nog een essentiële laag:  
**echte hergebruik van dependencies tussen projecten**.

Elk project herinstalleert dezelfde bibliotheken. Elke build downloadt opnieuw. Elke ontwikkelaar verliest tijd.

**Pegno** lost dit op door een **globale workspace** op je systeem te creëren, waar dependencies eenmaal geïnstalleerd worden en hergebruikt via _symlinks_ (of kopieën, als je dat prefereert).

---

## 🫠🤌🏻💗 Motivatie: waarom heb ik dit voor Bun gemaakt?

Bun is snel.  
Maar snel **alleen** is niet genoeg.

npm en pnpm hebben al begrepen dat de toekomst **gedeelde cache en package atomiciteit** is — maar Bun hangt nog steeds af van lockfiles en redundante herinstallatie.

De **Pegno** filosofie is simpel:

> **Code is tijdelijk, cache is eeuwig.**

Wanneer je `axios@latest` in een project installeert, waarom zou je het opnieuw downloaden in een ander?  
**Pegno** creëert een globale repository (`~/.pegno_workspace/js`) en linkt packages direct naar projecten — als een dependency brein.

Daarnaast voegt het iets toe dat geen andere manager biedt:

### 🧠 Mini-workspaces (de "presets")

Je kunt dependency sets opslaan en toepassen op elk project:

```bash
pegno axios fastify zod
# Vraagt of je wilt opslaan als preset → typ "api"

pegno use api
# installeert alles opnieuw instantaan
```

---

## ⚡️ Hoofdfuncties

| Functie                                  | Beschrijving                                                       |
| ---------------------------------------- | ------------------------------------------------------------------ |
| 💾 **Intelligente Globale Cache**        | Elk package wordt slechts eenmaal op het systeem geïnstalleerd.    |
| 🪄 **Automatische Symlinks**             | Geen `node_modules` duplicatie, alles wijst naar de globale cache. |
| 📦 **Kopieer modus (`--copy`)**          | Als je volledig geïsoleerde builds wilt.                           |
| 📚 **Mini-Workspaces**                   | Creëer benoemde dependency sets en pas ze in seconden opnieuw toe. |
| 🧩 **Compatibel met elk Bun project**    | Gebruikt alleen native APIs (`fs`, `os`, `path`, `child_process`). |
| 🛠️ **`--dev` modus**                     | Voegt packages direct toe aan `devDependencies`.                   |
| 🧭 **`sync` modus**                      | Kopieert hele globale workspace naar lokale `node_modules`.        |
| 🎨 **Gekleurde logs (`kleur`)**          | Niveaus, pictogrammen en installatietijden voor snelle debugging.  |
| 🤗 **Geen externe runtime dependencies** | Alleen `kleur` en Bun. 💯🚀🎯                                      |

---

## 🚀 Installatie

```bash
bun add -g pegno

npm i -g pegno

# of direct uitvoeren
npx pegno
```

Verifieer:

```bash
pegno --help
```

Verwachte output:

```
pegno CLI 1.3.0

Gebruik:
  pegno axios@latest   → Installeert package direct
  pegno use api        → Gebruikt opgeslagen miniworkspace
  pegno list           → Toont miniworkspaces
  pegno --dev          → Installeert als devDependency
  pegno --copy         → Kopieert in plaats van linken
  pegno sync           → Kopieert hele globale workspace
  pegno --verbose      → Gedetailleerde logs
```

---

## 💡 Gebruiksvoorbeeld

```bash
# Installeert axios globaal en linkt naar huidige project
pegno axios

# Installeert meerdere packages
pegno fastify zod openai

# Voegt ontwikkelings packages toe
pegno --dev vitest typescript

# Creëert en slaat een mini-workspace op
pegno use api
```

---

## 📁 Interne structuur

Pegno creëert automatisch:

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

Elk package is een complete directory (fysieke en herbruikbare cache).
Presets zijn JSON beschrijvingen met dependency lijsten.

---

## 🧠 Ontwerp filosofie

Het project volgt drie principes:

1. **Nul redundantie** — Niets wordt twee keer geïnstalleerd.
2. **Intelligente linking** — Elke `node_modules` is een venster naar de globale workspace.
3. **Brutalistische eenvoud** — Alles in TypeScript, geen verborgen magie.

---

## 🔮 Roadmap

- [ ] Hash-gebaseerde registry (package checksum + versie)
- [ ] Interactieve CLI UI (`pegno ui`)

---

## 💬 Waarom "Pegno"?

Omdat **elke tool een goede provocatie nodig heeft.**  
Het idee is dat het "je module pakt", maar op een intelligente manier —  
de globale link maken van wat vanaf het begin globaal had moeten zijn.

De naam is een ironische hommage aan de Braziliaanse hacker cultuur:  
provocerend, humorvol en functioneel.

---

## 🧑‍💻 Auteur

**SuissAI**  
Senior ontwikkelaar gepassioneerd door gedistribueerde, veerkrachtige architecturen en AI.  
Maker van het **Full Agentic Stack**, **Atomic Behavior Types** ecosysteem, en nu… **Pegno**.

---

## 📄 Licentie

MIT © Suissa — vrij te gebruiken, remixen en verbeteren.  
Maar als het kapot gaat, was het Bun's schuld.
