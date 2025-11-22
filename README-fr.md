<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="Pegno logo"/>
</p>

<p align="center">
Le gestionnaire global de dépendances pour Bun que Bun a oublié de faire
</p>

<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/pegno" target="_blank">
    <img src="https://img.shields.io/npm/v/pegno.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "Un workspace global intelligent pour Bun, fait par quelqu'un qui en avait marre d'attendre que Bun finisse Bun."

---

## 🌍 Idiomas / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md) | 🇹🇷 [Türkçe](README-tr.md) | 🇸🇪 [Svenska](README-se.md) | 🇻🇳 [Tiếng Việt](README-vn.md) | 🇹🇭 [ไทย](README-th.md) | 🇮🇱 [עברית](README-he.md) | 🇮🇩 [Bahasa Indonesia](README-id.md)

---

<p align="center">
  <h1 align="center">Qu'est-ce que <br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="Pegno logo"/><br />?</h1>
</p>

**Pegno** est un gestionnaire de dépendances avec **cache global**, **auto-link**, **mini-workspaces** et **mode de synchronisation instantanée**, fait 100% en **Bun + TypeScript**.

L'idée est née parce que Bun a promis "vitesse et simplicité", mais en pratique, il manque encore une couche essentielle :  
**réutilisation réelle des dépendances entre projets**.

Chaque projet réinstalle les mêmes libs. Chaque build télécharge à nouveau. Chaque dev perd du temps.

**Pegno** résout cela en créant un **workspace global** sur votre système, où les dépendances sont installées une seule fois et réutilisées via des _symlinks_ (ou des copies, si vous préférez).

---

## 🚀 Installation

```bash
bun add -g pegno

npm i -g pegno

# ou en exécutant directement
npx pegno
```

Vérifier :

```bash
pegno --help
```

**⚠️ Windows :** Si la commande n'est pas reconnue, ajoutez le répertoire global de Bun au PATH :

```powershell
# Ajouter définitivement au PATH (PowerShell en tant qu'Admin)
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:USERPROFILE\.bun\bin", "User")
```

Sortie attendue :

```
pegno CLI 1.3.0

Usage:
  pegno axios@latest   → Installe le paquet directement
  pegno use api        → Utilise le miniworkspace sauvegardé
  pegno list           → Liste les miniworkspaces
  pegno --dev          → Installe comme devDependency
  pegno --copy         → Copie au lieu de lier
  pegno sync           → Copie tout le workspace global
  pegno --verbose      → Logs détaillés
```

---

## 💡 Exemple d'utilisation

```bash
# Installe axios globalement et lie au projet actuel
pegno axios

# Installe plusieurs paquets
pegno fastify zod openai

# Ajoute des paquets de développement
pegno --dev vitest typescript

# Crée et sauvegarde un mini-workspace
pegno use api
```

### 🪟 Utilisateurs Windows

Sur Windows, il est recommandé d'utiliser le mode `--copy` en raison des restrictions de permissions pour créer des symlinks :

```bash
# Windows : utilisez --copy pour éviter les erreurs de permissions
pegno --copy axios fastify zod

# Mode dev sur Windows
pegno --dev --copy vitest typescript
```

**Pourquoi utiliser `--copy` sur Windows ?**  
Windows nécessite des privilèges administratifs spéciaux pour créer des symlinks. Le mode `--copy` copie physiquement les paquets vers `node_modules`, garantissant une compatibilité totale sans avoir besoin d'exécuter en tant qu'administrateur.

---

## ⚡️ Fonctionnalités principales

| Fonctionnalité                              | Description                                                                |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| 💾 **Cache Global Intelligent**             | Chaque paquet est installé une seule fois sur le système.                  |
| 🪄 **Symlinks automatiques**                | Pas de duplication de `node_modules`, tout pointe vers le cache global.    |
| 📚 **Mode copie (`--copy`)**                | Si vous voulez les dépendances dans `node_modules` aussi.                  |
| 📦 **Mini-Workspaces**                      | Créez des ensembles de dépendances nommés et réappliquez-les en secondes.  |
| 🧩 **Compatible avec tout projet Bun**      | Utilise uniquement les APIs natives (`fs`, `os`, `path`, `child_process`). |
| 🛠️ **Mode `--dev`**                         | Ajoute les paquets directement dans `devDependencies`.                     |
| 🔁 **Mode `sync`**                          | Copie tout le workspace global vers `node_modules` local.                  |
| 🎨 **Logs colorés (`kleur`)**               | Niveaux, icônes et temps d'installation pour un débogage rapide.           |
| 🤗 **Aucune dépendance externe de runtime** | Seulement `kleur` et Bun.                                                  |

---

## 🧑‍💻 Auteur

**SuissAI**  
Développeur senior passionné par les architectures distribuées, résilientes et l'IA.  
Créateur de l'écosystème **Full Agentic Stack**, **Atomic Behavior Types**, et maintenant… **Pegno**.

---

## 📄 Licence

MIT © Suissa, libre d'utiliser, remixer et améliorer.  
Mais si ça casse, c'est la faute de Bun.
