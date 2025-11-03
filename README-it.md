<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="Pegno logo"/>
</p>

<p align="center">
Il gestore globale di dipendenze per Bun che Bun ha dimenticato di fare
</p>

<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/pegno" target="_blank">
    <img src="https://img.shields.io/npm/v/pegno.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "Un workspace globale intelligente per Bun, fatto da qualcuno che si è stancato di aspettare che Bun finisca Bun."

---

## 🌍 Idiomas / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md) | 🇹🇷 [Türkçe](README-tr.md) | 🇸🇪 [Svenska](README-se.md) | 🇻🇳 [Tiếng Việt](README-vn.md) | 🇹🇭 [ไทย](README-th.md) | 🇮🇱 [עברית](README-he.md) | 🇮🇩 [Bahasa Indonesia](README-id.md)

---

<p align="center">
  <h1 align="center">Cos'è <br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="Pegno logo"/><br />?</h1>
</p>

**Pegno** è un gestore di dipendenze con **cache globale**, **auto-link**, **mini-workspace** e **modalità di sincronizzazione istantanea**, realizzato al 100% in **Bun + TypeScript**.

L'idea è nata perché Bun ha promesso "velocità e semplicità", ma in pratica manca ancora uno strato essenziale:  
**riutilizzo reale delle dipendenze tra progetti**.

Ogni progetto reinstalla le stesse librerie. Ogni build scarica di nuovo. Ogni dev perde tempo.

**Pegno** risolve questo creando un **workspace globale** sul tuo sistema, dove le dipendenze vengono installate una sola volta e riutilizzate tramite *symlink* (o copie, se preferisci).

---

## 🚀 Installazione

```bash
bun add -g pegno

npm i -g pegno

# o eseguendo direttamente
npx pegno
```

Verificare:
```bash
pegno --help
```

**⚠️ Windows:** Se il comando non viene riconosciuto, aggiungi la directory globale di Bun al PATH:
```powershell
# Aggiungere permanentemente al PATH (PowerShell come Admin)
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:USERPROFILE\.bun\bin", "User")
```

Output atteso:
```
pegno CLI 1.3.0

Uso:
  pegno axios@latest   → Installa pacchetto direttamente
  pegno use api        → Usa miniworkspace salvato
  pegno list           → Elenca miniworkspace
  pegno --dev          → Installa come devDependency
  pegno --copy         → Copia invece di collegare
  pegno sync           → Copia tutto il workspace globale
  pegno --verbose      → Log dettagliati
```

---

## 💡 Esempio d'uso

```bash
# Installa axios globalmente e collega al progetto corrente
pegno axios

# Installa più pacchetti
pegno fastify zod openai

# Aggiunge pacchetti di sviluppo
pegno --dev vitest typescript

# Crea e salva un mini-workspace
pegno use api
```

### 🪟 Utenti Windows

Su Windows, si raccomanda di usare la modalità `--copy` a causa delle restrizioni di permessi per creare symlink:

```bash
# Windows: usa --copy per evitare errori di permessi
pegno --copy axios fastify zod

# Modalità dev su Windows
pegno --dev --copy vitest typescript
```

**Perché usare `--copy` su Windows?**  
Windows richiede privilegi amministrativi speciali per creare symlink. La modalità `--copy` copia fisicamente i pacchetti in `node_modules`, garantendo piena compatibilità senza necessità di eseguire come amministratore.

---

## ⚡️ Caratteristiche principali

| Caratteristica | Descrizione |
|----------|------------|
| 💾 **Cache Globale Intelligente** | Ogni pacchetto viene installato una sola volta nel sistema. |
| 🪄 **Symlink automatici** | Nessuna duplicazione di `node_modules`, tutto punta alla cache globale. |
| 📚 **Modalità copia (`--copy`)** | Se vuoi le dipendenze anche in `node_modules`. |
| 📦 **Mini-Workspace** | Crea set di dipendenze nominati e riapplicali in secondi. |
| 🧩 **Compatibile con qualsiasi progetto Bun** | Usa solo API native (`fs`, `os`, `path`, `child_process`). |
| 🛠️ **Modalità `--dev`** | Aggiunge pacchetti direttamente a `devDependencies`. |
| 🔁 **Modalità `sync`** | Copia tutto il workspace globale in `node_modules` locale. |
| 🎨 **Log colorati (`kleur`)** | Livelli, icone e tempi di installazione per debug rapido. |
| 🤗 **Nessuna dipendenza esterna di runtime** | Solo `kleur` e Bun. |

---

## 🧑‍💻 Autore

**SuissAI**  
Sviluppatore senior appassionato di architetture distribuite, resilienti e IA.  
Creatore dell'ecosistema **Full Agentic Stack**, **Atomic Behavior Types**, e ora… **Pegno**.

---

## 📄 Licenza

MIT © Suissa, libero di usare, remixare e migliorare.  
Ma se si rompe, è colpa di Bun.