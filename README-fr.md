<p align="center">
  <img src="https://i.imgur.com/cB70gh8.png" width="480" alt="PegNoMeu logo"/>
</p>

<p align="center">
Le gestionnaire global de dépendances pour Bun que Bun a oublié de faire
</p>


[![Bun](https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun)](https://bun.sh)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/pegnomeu.svg)](https://www.npmjs.com/package/pegnomeu)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg)](https://www.typescriptlang.org/)

> "Un workspace global intelligent pour Bun, fait par quelqu'un qui en avait marre d'attendre que Bun finisse Bun."

---

<p align="center">
  <h1 align="center">Qu'est-ce que <br /><img src="https://i.imgur.com/cB70gh8.png" height="80" alt="PegNoMeu logo"/><br />?</h1>
</p>

**PegNoMeu** est un gestionnaire de dépendances avec **cache global**, **auto-lien**, **mini-workspaces** et **mode de synchronisation instantanée** — construit à 100% en **Bun + TypeScript**.

L'idée est née parce que Bun a promis "vitesse et simplicité" — mais en pratique, il manque encore une couche essentielle :  
**réutilisation réelle des dépendances entre projets**.

Chaque projet réinstalle les mêmes bibliothèques. Chaque build retélécharge. Chaque développeur perd du temps.

**PegNoMeu** résout cela en créant un **workspace global** sur votre système, où les dépendances sont installées une fois et réutilisées via des *symlinks* (ou des copies, si vous préférez).

---

## 🧪 Motivation : pourquoi avons-nous créé cela pour Bun ?

Bun est rapide.  
Mais rapide **seul** ne suffit pas.

npm et pnpm ont déjà compris que l'avenir est **cache partagé et atomicité des packages** — mais Bun dépend encore des lockfiles et de la réinstallation redondante.

La philosophie de **PegNoMeu** est simple :

> **Le code est éphémère, le cache est éternel.**

Quand vous installez `axios@latest` dans un projet, pourquoi le retélécharger dans un autre ?  
**PegNoMeu** crée un dépôt global (`~/.pegnomeu_workspace/js`) et lie les packages directement aux projets — comme un cerveau de dépendances.

De plus, il ajoute quelque chose qu'aucun autre gestionnaire n'offre :

### 🧠 Mini-workspaces (les "presets")

Vous pouvez sauvegarder des ensembles de dépendances et les appliquer à n'importe quel projet :
```bash
pegnomeu axios fastify zod
# Demande si vous voulez sauvegarder comme preset → tapez "api"

pegnomeu use api
# installe tout à nouveau instantanément
```

---

## ⚡️ Fonctionnalités principales

| Fonctionnalité | Description |
|----------|------------|
| 💾 **Cache Global Intelligent** | Chaque package est installé une seule fois sur le système. |
| 🪄 **Symlinks automatiques** | Pas de duplication de `node_modules`, tout pointe vers le cache global. |
| 📦 **Mode copie (`--copy`)** | Si vous voulez des builds complètement isolés. |
| 📚 **Mini-Workspaces** | Créez des ensembles de dépendances nommés et réappliquez en secondes. |
| 🧩 **Compatible avec tout projet Bun** | Utilise uniquement les APIs natives (`fs`, `os`, `path`, `child_process`). |
| 🛠️ **Mode `--dev`** | Ajoute les packages directement aux `devDependencies`. |
| 🧭 **Mode `sync`** | Copie tout le workspace global vers les `node_modules` locaux. |
| 🖼️ **Logs colorés (`kleur`)** | Retour clair et amusant. |
| 🤗 **Aucune dépendance externe de runtime** | Seulement `kleur` et Bun. |

---

## 🚀 Installation

```bash
bun add -g pegnomeu

npm i -g pegnomeu

# ou en exécutant directement
npx pegnomeu
```

Vérifiez :
```bash
pegnomeu --help
```

Sortie attendue :
```
pegnomeu CLI 1.3.0

Usage :
  pegnomeu axios@latest   → Installe le package directement
  pegnomeu use api        → Utilise le miniworkspace sauvegardé
  pegnomeu list           → Liste les miniworkspaces
  pegnomeu --dev          → Installe comme devDependency
  pegnomeu --copy         → Copie au lieu de lier
  pegnomeu sync           → Copie tout le workspace global
  pegnomeu --verbose      → Logs détaillés
```

---

## 💡 Exemple d'utilisation

```bash
# Installe axios globalement et lie au projet actuel
pegnomeu axios

# Installe plusieurs packages
pegnomeu fastify zod openai

# Ajoute des packages de développement
pegnomeu --dev vitest typescript

# Crée et sauvegarde un mini-workspace
pegnomeu use api
```

---

## 📁 Structure interne

PegNoMeu crée automatiquement :

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

Chaque package est un répertoire complet (cache physique et réutilisable).
Les presets sont des descriptions JSON avec des listes de dépendances.

---

## 🧠 Philosophie de conception

Le projet suit trois principes :

1. **Zéro redondance** — Rien n'est installé deux fois.
2. **Liaison intelligente** — Chaque `node_modules` est une fenêtre vers le workspace global.
3. **Simplicité brutaliste** — Tout en TypeScript, sans magie cachée.

---

## 🔮 Feuille de route

- [ ] Support multi-langages (`.pegnomeu/py`, `.pegnomeu/rust`)
- [ ] Registre basé sur le hash (checksum du package + version)
- [ ] Synchronisation distribuée via IPFS ou NFS
- [ ] UI CLI interactive (`pegnomeu ui`)
- [ ] Intégration avec `pegnomeu.json` local

---

## 💬 Pourquoi "PegNoMeu" ?

Parce que **tout outil a besoin d'une bonne provocation.**  
L'idée est qu'il "attrape ton module", mais de manière intelligente —  
faisant le lien global de ce qui aurait dû être global dès le début.

Le nom est un hommage ironique à la culture hacker brésilienne :  
provocatrice, pleine d'humour et fonctionnelle.

---

## 🧑‍💻 Auteur

**Suissera da Bahia**  
Développeur senior passionné par les architectures distribuées, résilientes et l'IA.  
Créateur de l'écosystème **Full Agentic Stack**, **EnzyChop.Tech**, **Virion.Delivery**, et maintenant… **PegNoMeu**.

---

## 📄 Licence

MIT © Suissa — libre d'utiliser, remixer et améliorer.  
Mais si ça casse, c'est la faute de Bun.