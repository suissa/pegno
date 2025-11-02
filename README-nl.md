<p align="center">
  <img src="https://i.imgur.com/cB70gh8.png" width="480" alt="PegNoMeu logo"/>
</p>

<p align="center">
De globale dependency manager voor Bun die Bun vergat te maken
</p>


[![Bun](https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun)](https://bun.sh)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/pegnomeu.svg)](https://www.npmjs.com/package/pegnomeu)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg)](https://www.typescriptlang.org/)

> "Een intelligente globale workspace voor Bun, gemaakt door iemand die het zat was om te wachten tot Bun Bun zou afmaken."

---

<p align="center">
  <h1 align="center">Wat is <br /><img src="https://i.imgur.com/cB70gh8.png" height="80" alt="PegNoMeu logo"/><br />?</h1>
</p>

**PegNoMeu** is een dependency manager met **globale cache**, **auto-link**, **mini-workspaces** en **instant sync modus** — 100% gebouwd in **Bun + TypeScript**.

Het idee ontstond omdat Bun "snelheid en eenvoud" beloofde — maar in de praktijk ontbreekt er nog een essentiële laag:  
**echte hergebruik van dependencies tussen projecten**.

Elk project herinstalleert dezelfde bibliotheken. Elke build downloadt opnieuw. Elke ontwikkelaar verliest tijd.

**PegNoMeu** lost dit op door een **globale workspace** op je systeem te creëren, waar dependencies eenmaal geïnstalleerd worden en hergebruikt via *symlinks* (of kopieën, als je dat prefereert).

---

## 🧪 Motivatie: waarom hebben we dit voor Bun gemaakt?

Bun is snel.  
Maar snel **alleen** is niet genoeg.

npm en pnpm hebben al begrepen dat de toekomst **gedeelde cache en package atomiciteit** is — maar Bun hangt nog steeds af van lockfiles en redundante herinstallatie.

De **PegNoMeu** filosofie is simpel:

> **Code is tijdelijk, cache is eeuwig.**

Wanneer je `axios@latest` in een project installeert, waarom zou je het opnieuw downloaden in een ander?  
**PegNoMeu** creëert een globale repository (`~/.pegnomeu_workspace/js`) en linkt packages direct naar projecten — als een dependency brein.

Daarnaast voegt het iets toe dat geen andere manager biedt:

### 🧠 Mini-workspaces (de "presets")

Je kunt dependency sets opslaan en toepassen op elk project:
```bash
pegnomeu axios fastify zod
# Vraagt of je wilt opslaan als preset → typ "api"

pegnomeu use api
# installeert alles opnieuw instantaan
```

---

## ⚡️ Hoofdfuncties

| Functie | Beschrijving |
|----------|------------|
| 💾 **Intelligente Globale Cache** | Elk package wordt slechts eenmaal op het systeem geïnstalleerd. |
| 🪄 **Automatische Symlinks** | Geen `node_modules` duplicatie, alles wijst naar de globale cache. |
| 📦 **Kopieer modus (`--copy`)** | Als je volledig geïsoleerde builds wilt. |
| 📚 **Mini-Workspaces** | Creëer benoemde dependency sets en pas ze in seconden opnieuw toe. |
| 🧩 **Compatibel met elk Bun project** | Gebruikt alleen native APIs (`fs`, `os`, `path`, `child_process`). |
| 🛠️ **`--dev` modus** | Voegt packages direct toe aan `devDependencies`. |
| 🧭 **`sync` modus** | Kopieert hele globale workspace naar lokale `node_modules`. |
| 🖼️ **Gekleurde logs (`kleur`)** | Duidelijke en leuke feedback. |
| 🤗 **Geen externe runtime dependencies** | Alleen `kleur` en Bun. |

---

## 🚀 Installatie

```bash
bun add -g pegnomeu

npm i -g pegnomeu

# of direct uitvoeren
npx pegnomeu
```

Verifieer:
```bash
pegnomeu --help
```

Verwachte output:
```
pegnomeu CLI 1.3.0

Gebruik:
  pegnomeu axios@latest   → Installeert package direct
  pegnomeu use api        → Gebruikt opgeslagen miniworkspace
  pegnomeu list           → Toont miniworkspaces
  pegnomeu --dev          → Installeert als devDependency
  pegnomeu --copy         → Kopieert in plaats van linken
  pegnomeu sync           → Kopieert hele globale workspace
  pegnomeu --verbose      → Gedetailleerde logs
```

---

## 💡 Gebruiksvoorbeeld

```bash
# Installeert axios globaal en linkt naar huidige project
pegnomeu axios

# Installeert meerdere packages
pegnomeu fastify zod openai

# Voegt ontwikkelings packages toe
pegnomeu --dev vitest typescript

# Creëert en slaat een mini-workspace op
pegnomeu use api
```

---

## 📁 Interne structuur

PegNoMeu creëert automatisch:

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

- [ ] Multi-taal ondersteuning (`.pegnomeu/py`, `.pegnomeu/rust`)
- [ ] Hash-gebaseerde registry (package checksum + versie)
- [ ] Gedistribueerde synchronisatie via IPFS of NFS
- [ ] Interactieve CLI UI (`pegnomeu ui`)
- [ ] Integratie met lokale `pegnomeu.json`

---

## 💬 Waarom "PegNoMeu"?

Omdat **elke tool een goede provocatie nodig heeft.**  
Het idee is dat het "je module pakt", maar op een intelligente manier —  
de globale link maken van wat vanaf het begin globaal had moeten zijn.

De naam is een ironische hommage aan de Braziliaanse hacker cultuur:  
provocerend, humorvol en functioneel.

---

## 🧑‍💻 Auteur

**Suissera da Bahia**  
Senior ontwikkelaar gepassioneerd door gedistribueerde, veerkrachtige architecturen en AI.  
Maker van het **Full Agentic Stack**, **EnzyChop.Tech**, **Virion.Delivery** ecosysteem, en nu… **PegNoMeu**.

---

## 📄 Licentie

MIT © Suissa — vrij te gebruiken, remixen en verbeteren.  
Maar als het kapot gaat, was het Bun's schuld.