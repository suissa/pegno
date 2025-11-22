<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="Pegno logo"/>
</p>

<p align="center">
O gerenciador global de dependências pro Bun que o Bun esqueceu de fazer
</p>

<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/pegno" target="_blank">
    <img src="https://img.shields.io/npm/v/pegno.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> “Um workspace global inteligente pra Bun, feito por quem cansou de esperar o Bun terminar o Bun.”

---

## 🌍 Idiomas / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md) | 🇹🇷 [Türkçe](README-tr.md) | 🇸🇪 [Svenska](README-se.md) | 🇻🇳 [Tiếng Việt](README-vn.md) | 🇹🇭 [ไทย](README-th.md) | 🇮🇱 [עברית](README-he.md) | 🇮🇩 [Bahasa Indonesia](README-id.md)

---

<p align="center">
  <h1 align="center">O que é o <br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="Pegno logo"/><br />?</h1>
</p>

**Pegno** é um gerenciador de dependências com **cache global**, **auto-link**, **mini-workspaces** e **modo de sincronização instantânea**, feito 100% em **Bun + TypeScript**.

A ideia nasceu porque o Bun prometeu “velocidade e simplicidade”, mas, na prática, ainda falta uma camada essencial:  
**reutilização real de dependências entre projetos**.

Cada projeto reinstala as mesmas libs. Cada build baixa de novo. Cada dev perde tempo.

O **Pegno** resolve isso criando um **workspace global** no seu sistema, onde as dependências são instaladas uma única vez e reaproveitadas por _symlinks_ (ou cópias, se preferir).

---

## 🫠🤌🏻💗 Motivação: por que criei isso pro Bun?

Bun é rápido.  
Mas rápido **sozinho** não é suficiente.

O npm e o pnpm já entenderam que o futuro é **cache compartilhado e atomicidade de pacotes**, mas o Bun ainda depende de lockfiles e reinstalação redundante.

A filosofia do **Pegno** é simples:

> **O código é efêmero, o cache é eterno.**

Quando você instala `axios@latest` num projeto, por que baixar de novo em outro?  
O **Pegno** cria um repositório global (`~/.pegno_workspace/js`) e linka os pacotes direto nos projetos, como um cérebro de dependências.

Além disso, ele adiciona algo que nenhum outro gerenciador oferece:

### 📦 Mini-workspaces (os “presets”)

Você pode salvar conjuntos de dependências e aplicá-los em qualquer projeto:

```bash
pegno axios fastify zod
# Pergunta se quer salvar como preset → digite "api"

pegno use api
# instala tudo de novo instantaneamente
```

---

## ⚡️ Principais recursos

| Recurso                                     | Descrição                                                        |
| ------------------------------------------- | ---------------------------------------------------------------- |
| 💾 **Cache Global Inteligente**             | Cada pacote é instalado uma única vez no sistema.                |
| 🪄 **Symlinks automáticos**                 | Sem duplicação de `node_modules`, tudo aponta pro cache global.  |
| 📚 **Modo de cópia (`--copy`)**             | Se quiser as dependências na `node_modules` também.              |
| 📦 **Mini-Workspaces**                      | Crie conjuntos de dependências nomeados e reaplique em segundos. |
| 🧩 **Compatível com qualquer projeto Bun**  | Usa apenas APIs nativas (`fs`, `os`, `path`, `child_process`).   |
| 🛠️ **`--dev` mode**                         | Adiciona pacotes direto em `devDependencies`.                    |
| 🔁 **`sync` mode**                          | Copia todo o workspace global para `node_modules` local.         |
| 🎨 **Logs coloridos (`kleur`)**             | Níveis, ícones e tempos de instalação para depuração rápida.     |
| 🤗 **Sem dependências externas de runtime** | Apenas `kleur` e Bun. 💯🚀🎯                                     |

---

## 🚀 Instalação

```bash
bun add -g pegno

npm i -g pegno

# ou executando diretamente
npx pegno
```

Verifique:

```bash
pegno --help
```

**⚠️ Windows:** Se o comando não for reconhecido, adicione o diretório global do Bun ao PATH:

```powershell
# Adicionar permanentemente ao PATH (PowerShell como Admin)
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:USERPROFILE\.bun\bin", "User")
```

Saída esperada:

```
pegno CLI 1.3.0

Uso:
  pegno axios@latest   → Instala pacote direto
  pegno use api        → Usa miniworkspace salvo
  pegno list           → Lista miniworkspaces
  pegno --dev          → Instala como devDependency
  pegno --copy         → Copia em vez de linkar
  pegno sync           → Copia todo workspace global
  pegno --verbose      → Logs detalhados
```

---

## 💡 Exemplo de uso

```bash
# Instala axios globalmente e linka no projeto atual
pegno axios

# Instala múltiplos pacotes
pegno fastify zod openai

# Adiciona pacotes de desenvolvimento
pegno --dev vitest typescript

# Cria e salva um mini-workspace
pegno use api
```

### 🪟 Usuários Windows

No Windows, recomenda-se usar o modo `--copy` devido às restrições de permissão para criação de symlinks:

```bash
# Windows: use --copy para evitar erros de permissão
pegno --copy axios fastify zod

# Modo dev no Windows
pegno --dev --copy vitest typescript
```

**Por que usar `--copy` no Windows?**  
O Windows requer privilégios administrativos especiais para criar symlinks. O modo `--copy` copia fisicamente os pacotes para `node_modules`, garantindo compatibilidade total sem necessidade de executar como administrador.

---

## 📁 Estrutura interna

O Pegno cria automaticamente:

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

Cada pacote é um diretório completo (cache físico e reutilizável).
Os presets são descrições JSON com listas de dependências.

---

## 🧠 Filosofia de design

O projeto segue três princípios:

1. **Zero redundância**, Nada é instalado duas vezes.
2. **Link inteligente**, Cada `node_modules` é uma janela pro workspace global.
3. **Simplicidade brutalista**, Tudo em TypeScript, sem mágica oculta.

---

## 🔮 Roadmap

- [ ] Hash-based registry (checksum do pacote + versão)
- [ ] UI CLI interativa (`pegno ui`)

---

## 💬 Por que “Pegno”?

Porque **toda ferramenta precisa de uma boa provocação.**  
A ideia é que ele “pega no teu módulo”, mas de forma inteligente,  
fazendo o link global do que deveria ser global desde o começo.

O nome é uma homenagem irônica à cultura hacker brasileira:  
provocadora, bem-humorada e funcional.

---

## 🧑‍💻 Autor

**SuissAI**  
Desenvolvedor sênior apaixonado por arquiteturas distribuídas, resilientes e IA.  
Criador do ecossistema **Full Agentic Stack**, **Atomic Behavior Types**, e agora… **Pegno**.

---

## 📄 Licença

MIT © Suissa, livre pra usar, remixar e aprimorar.  
Mas se quebrar, foi o Bun.
