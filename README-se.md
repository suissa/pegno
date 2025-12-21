<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="p3g logo"/>
</p>

<p align="center">
Den globala beroendehanteraren för Bun som Bun glömde att skapa
</p>

<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/p3g" target="_blank">
    <img src="https://img.shields.io/npm/v/p3g.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "En intelligent global arbetsyta för Bun, skapad av någon som tröttnade på att vänta på att Bun skulle färdigställa Bun."

---

## 🌍 Språk / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md) | 🇹🇷 [Türkçe](README-tr.md) | 🇸🇪 [Svenska](README-se.md) | 🇻🇳 [Tiếng Việt](README-vn.md) | 🇹🇭 [ไทย](README-th.md) | 🇮🇱 [עברית](README-he.md) | 🇮🇩 [Bahasa Indonesia](README-id.md)

---

<p align="center">
  <h1 align="center">Vad är <br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="p3g logo"/><br />?</h1>
</p>

**p3g** är en beroendehanterare med **global cache**, **auto-länkning**, **mini-arbetsytor** och **omedelbart synkroniseringsläge** — byggd 100% i **Bun + TypeScript**.

Idén föddes eftersom Bun lovade "hastighet och enkelhet" — men i praktiken saknas fortfarande ett väsentligt lager:  
**verklig återanvändning av beroenden mellan projekt**.

Varje projekt ominstallerar samma bibliotek. Varje bygge laddar ner igen. Varje utvecklare slösar tid.

**p3g** löser detta genom att skapa en **global arbetsyta** i ditt system, där beroenden installeras en gång och återanvänds via _symboliska länkar_ (eller kopior, om du föredrar).

---

## 🫠🤌🏻💗 Motivation: varför skapade jag detta för Bun?

Bun är snabb.  
Men snabb **ensam** räcker inte.

npm och pnpm har redan förstått att framtiden är **delad cache och paketatomicitet** — men Bun är fortfarande beroende av låsfiler och redundant ominstallation.

**p3g**s filosofi är enkel:

> **Kod är tillfällig, cache är evig.**

När du installerar `axios@latest` i ett projekt, varför ladda ner det igen i ett annat?  
**p3g** skapar ett globalt förråd (`~/.p3g_workspace/js`) och länkar paket direkt till projekt — som en beroendehjärna.

Dessutom lägger det till något som ingen annan hanterare erbjuder:

### 🧠 Mini-arbetsytor ("förinställningar")

Du kan spara beroendeuppsättningar och tillämpa dem på vilket projekt som helst:

```bash
p3g axios fastify zod
# Frågar om du vill spara som förinställning → skriv "api"

p3g use api
# installerar allt igen omedelbart
```

---

## ⚡️ Huvudfunktioner

| Funktion                               | Beskrivning                                                            |
| -------------------------------------- | ---------------------------------------------------------------------- |
| 💾 **Intelligent Global Cache**        | Varje paket installeras endast en gång i systemet.                     |
| 🪄 **Automatiska Symboliska Länkar**   | Ingen `node_modules` duplicering, allt pekar på global cache.          |
| 📦 **Kopieringsläge (`--copy`)**       | Om du vill ha helt isolerade byggen.                                   |
| 📚 **Mini-Arbetsytor**                 | Skapa namngivna beroendeuppsättningar och återanvänd på sekunder.      |
| 🧩 **Kompatibel med alla Bun-projekt** | Använder endast inbyggda API:er (`fs`, `os`, `path`, `child_process`). |
| 🛠️ **`--dev` läge**                    | Lägger till paket direkt i `devDependencies`.                          |
| 🧭 **`sync` läge**                     | Kopierar hela globala arbetsytan till lokala `node_modules`.           |
| 🖼️ **Färgade loggar (`kleur`)**        | Tydlig och rolig återkoppling.                                         |
| 🤗 **Inga externa runtime-beroenden**  | Endast `kleur` och Bun.                                                |

---

## 🚀 Installation

```bash
bun add -g p3g

npm i -g p3g

# eller kör direkt
npx p3g
```

Verifiera:

```bash
p3g --help
```

Förväntad utdata:

```
p3g CLI 1.3.0

Användning:
  p3g axios@latest   → Installerar paket direkt
  p3g use api        → Använder sparad miniarbetsyta
  p3g list           → Listar miniarbetsytor
  p3g --dev          → Installerar som devDependency
  p3g --copy         → Kopierar istället för att länka
  p3g sync           → Kopierar hela globala arbetsytan
  p3g --verbose      → Detaljerade loggar
```

---

## 💡 Användningsexempel

```bash
# Installerar axios globalt och länkar till aktuellt projekt
p3g axios

# Installerar flera paket
p3g fastify zod openai

# Lägger till utvecklingspaket
p3g --dev vitest typescript

# Skapar och sparar en mini-arbetsyta
p3g use api
```

---

## 📁 Intern struktur

p3g skapar automatiskt:

```
~/.p3g/
├── js/
│   ├── axios__latest/
│   ├── fastify__5.0.0/
│   └── zod__3.23.0/
└── presets/
    ├── api.json
    ├── web.json
    └── utils.json
```

Varje paket är en komplett katalog (fysisk och återanvändbar cache).
Förinställningar är JSON-beskrivningar med beroendelistor.

---

## 🧠 Designfilosofi

Projektet följer tre principer:

1. **Noll redundans** — Inget installeras två gånger.
2. **Intelligent länkning** — Varje `node_modules` är ett fönster till den globala arbetsytan.
3. **Brutalistisk enkelhet** — Allt i TypeScript, ingen dold magi.

---

## 🔮 Färdplan

- [ ] Hash-baserat register (paketets kontrollsumma + version)
- [ ] Interaktivt CLI-gränssnitt (`p3g ui`)

---

## 💬 Varför "p3g"?

För att **varje verktyg behöver en bra provokation.**  
Idén är att det "griper din modul", men intelligent —  
skapar den globala länken för det som borde ha varit globalt från början.

Namnet är en ironisk hyllning till brasiliansk hackerkultur:  
provokativ, humoristisk och funktionell.

---

## 🧑‍💻 Författare

**Suissera da Bahia**  
Senior utvecklare passionerad om distribuerade, motståndskraftiga arkitekturer och AI.  
Skapare av **Full Agentic Stack**, **EnzyChop.Tech**, **Virion.Delivery** ekosystemet, och nu… **p3g**.

---

## 📄 Licens

MIT © Suissa — fri att använda, remixa och förbättra.  
Men om det går sönder var det Buns fel.
