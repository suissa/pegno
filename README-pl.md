<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="p3g logo"/>
</p>

<p align="center">
Globalny menedżer zależności dla Bun, którego Bun zapomniał stworzyć
</p>

<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/p3g" target="_blank">
    <img src="https://img.shields.io/npm/v/p3g.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "Inteligentny globalny workspace dla Bun, stworzony przez kogoś, kto zmęczył się czekaniem, aż Bun skończy Bun."

---

## 🌍 Języki / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md)

---

<p align="center">
  <h1 align="center">Czym jest <br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="p3g logo"/><br />?</h1>
</p>

**p3g** to menedżer zależności z **globalnym cache**, **auto-linkowaniem**, **mini-workspace'ami** i **trybem natychmiastowej synchronizacji** — zbudowany w 100% w **Bun + TypeScript**.

Pomysł narodził się, ponieważ Bun obiecał "szybkość i prostotę" — ale w praktyce wciąż brakuje istotnej warstwy:  
**prawdziwe ponowne wykorzystanie zależności między projektami**.

Każdy projekt reinstaluje te same biblioteki. Każdy build pobiera ponownie. Każdy deweloper traci czas.

**p3g** rozwiązuje to, tworząc **globalny workspace** w twoim systemie, gdzie zależności są instalowane raz i ponownie wykorzystywane przez _symlinki_ (lub kopie, jeśli wolisz).

---

## 🧪 Motywacja: dlaczego stworzyliśmy to dla Bun?

Bun jest szybki.  
Ale szybki **sam** nie wystarczy.

npm i pnpm już zrozumiały, że przyszłość to **współdzielony cache i atomowość pakietów** — ale Bun wciąż zależy od lockfiles i redundantnej reinstalacji.

Filozofia **p3g** jest prosta:

> **Kod jest efemeryczny, cache jest wieczny.**

Kiedy instalujesz `axios@latest` w jednym projekcie, po co pobierać go ponownie w innym?  
**p3g** tworzy globalne repozytorium (`~/.p3g_workspace/js`) i linkuje pakiety bezpośrednio do projektów — jak mózg zależności.

Dodatkowo dodaje coś, czego nie oferuje żaden inny menedżer:

### 🧠 Mini-workspace'y ("presety")

Możesz zapisywać zestawy zależności i stosować je w dowolnym projekcie:

```bash
p3g axios fastify zod
# Pyta, czy chcesz zapisać jako preset → wpisz "api"

p3g use api
# instaluje wszystko ponownie natychmiast
```

---

## ⚡️ Główne funkcje

| Funkcja                                     | Opis                                                                 |
| ------------------------------------------- | -------------------------------------------------------------------- |
| 💾 **Inteligentny Globalny Cache**          | Każdy pakiet jest instalowany tylko raz w systemie.                  |
| 🪄 **Automatyczne Symlinki**                | Brak duplikacji `node_modules`, wszystko wskazuje na globalny cache. |
| 📦 **Tryb kopiowania (`--copy`)**           | Jeśli chcesz całkowicie izolowane buildy.                            |
| 📚 **Mini-Workspace'y**                     | Twórz nazwane zestawy zależności i stosuj w sekundach.               |
| 🧩 **Kompatybilny z każdym projektem Bun**  | Używa tylko natywnych API (`fs`, `os`, `path`, `child_process`).     |
| 🛠️ **Tryb `--dev`**                         | Dodaje pakiety bezpośrednio do `devDependencies`.                    |
| 🧭 **Tryb `sync`**                          | Kopiuje cały globalny workspace do lokalnych `node_modules`.         |
| 🖼️ **Kolorowe logi (`kleur`)**              | Jasny i zabawny feedback.                                            |
| 🤗 **Brak zewnętrznych zależności runtime** | Tylko `kleur` i Bun.                                                 |

---

## 🚀 Instalacja

```bash
bun add -g p3g

npm i -g p3g

# lub uruchom bezpośrednio
npx p3g
```

Sprawdź:

```bash
p3g --help
```

Oczekiwane wyjście:

```
p3g CLI 1.3.0

Użycie:
  p3g axios@latest   → Instaluje pakiet bezpośrednio
  p3g use api        → Używa zapisanego miniworkspace
  p3g list           → Listuje miniworkspace'y
  p3g --dev          → Instaluje jako devDependency
  p3g --copy         → Kopiuje zamiast linkować
  p3g sync           → Kopiuje cały globalny workspace
  p3g --verbose      → Szczegółowe logi
```

---

## 💡 Przykład użycia

```bash
# Instaluje axios globalnie i linkuje do bieżącego projektu
p3g axios

# Instaluje wiele pakietów
p3g fastify zod openai

# Dodaje pakiety deweloperskie
p3g --dev vitest typescript

# Tworzy i zapisuje mini-workspace
p3g use api
```

---

## 📁 Struktura wewnętrzna

p3g automatycznie tworzy:

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

Każdy pakiet to kompletny katalog (fizyczny i wielokrotnego użytku cache).
Presety to opisy JSON z listami zależności.

---

## 🧠 Filozofia designu

Projekt podąża za trzema zasadami:

1. **Zero redundancji** — Nic nie jest instalowane dwukrotnie.
2. **Inteligentne linkowanie** — Każdy `node_modules` to okno do globalnego workspace.
3. **Brutalistyczna prostota** — Wszystko w TypeScript, bez ukrytej magii.

---

## 🔮 Mapa drogowa

- [ ] Rejestr oparty na hash (suma kontrolna pakietu + wersja)
- [ ] Interaktywny CLI UI (`p3g ui`)

---

## 💬 Dlaczego "p3g"?

Bo **każde narzędzie potrzebuje dobrej prowokacji.**  
Pomysł polega na tym, że "chwyta twój moduł", ale inteligentnie —  
tworząc globalny link tego, co powinno być globalne od początku.

Nazwa to ironiczny hołd dla brazylijskiej kultury hakerskiej:  
prowokacyjnej, humorystycznej i funkcjonalnej.

---

## 🧑‍💻 Autor

**SuissAI**  
Senior developer pasjonujący się rozproszonymi, odpornymi architekturami i AI.  
Twórca ekosystemu **Full Agentic Stack**, **Atomic Behavior Types**, a teraz… **p3g**.

---

## 📄 Licencja

MIT © Suissa — wolne do użycia, remiksowania i ulepszania.  
Ale jeśli się zepsuje, to wina Bun.
