<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="Pegno logo"/>
</p>

<p align="center">
Bun 忘记制作的全局依赖管理器
</p>

<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/pegno" target="_blank">
    <img src="https://img.shields.io/npm/v/pegno.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "为 Bun 打造的智能全局工作空间，由厌倦了等待 Bun 完善 Bun 的人制作。"

---

## 🌍 语言 / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md)

---

<p align="center">
  <h1 align="center">什么是 <br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="Pegno logo"/><br />？</h1>
</p>

**Pegno** 是一个具有**全局缓存**、**自动链接**、**迷你工作空间**和**即时同步模式**的依赖管理器 — 100% 使用 **Bun + TypeScript** 构建。

这个想法的诞生是因为 Bun 承诺了"速度和简单性" — 但在实践中，仍然缺少一个重要层面：  
**项目间依赖的真正重用**。

每个项目都重新安装相同的库。每次构建都重新下载。每个开发者都在浪费时间。

**Pegno** 通过在你的系统上创建一个**全局工作空间**来解决这个问题，依赖项只安装一次，通过*符号链接*（或复制，如果你愿意）重复使用。

---

## 🧪 动机：为什么我们为 Bun 创建这个？

Bun 很快。  
但**仅仅**快是不够的。

npm 和 pnpm 已经理解了未来是**共享缓存和包原子性** — 但 Bun 仍然依赖于锁文件和冗余重装。

**Pegno** 的哲学很简单：

> **代码是短暂的，缓存是永恒的。**

当你在一个项目中安装 `axios@latest` 时，为什么要在另一个项目中重新下载？  
**Pegno** 创建一个全局仓库（`~/.pegno_workspace/js`）并将包直接链接到项目 — 就像一个依赖大脑。

此外，它还添加了其他管理器都没有提供的功能：

### 🧠 迷你工作空间（"预设"）

你可以保存依赖集合并将它们应用到任何项目：

```bash
pegno axios fastify zod
# 询问是否要保存为预设 → 输入 "api"

pegno use api
# 立即重新安装所有内容
```

---

## ⚡️ 主要功能

| 功能                        | 描述                                                    |
| --------------------------- | ------------------------------------------------------- |
| 💾 **智能全局缓存**         | 每个包在系统中只安装一次。                              |
| 🪄 **自动符号链接**         | 无 `node_modules` 重复，一切都指向全局缓存。            |
| 📦 **复制模式（`--copy`）** | 如果你想要完全隔离的构建。                              |
| 📚 **迷你工作空间**         | 创建命名的依赖集合并在几秒钟内重新应用。                |
| 🧩 **与任何 Bun 项目兼容**  | 仅使用原生 API（`fs`、`os`、`path`、`child_process`）。 |
| 🛠️ **`--dev` 模式**         | 直接将包添加到 `devDependencies`。                      |
| 🧭 **`sync` 模式**          | 将整个全局工作空间复制到本地 `node_modules`。           |
| 🖼️ **彩色日志（`kleur`）**  | 清晰有趣的反馈。                                        |
| 🤗 **无外部运行时依赖**     | 仅 `kleur` 和 Bun。                                     |

---

## 🚀 安装

```bash
bun add -g pegno

npm i -g pegno

# 或直接运行
npx pegno
```

验证：

```bash
pegno --help
```

预期输出：

```
pegno CLI 1.3.0

用法：
  pegno axios@latest   → 直接安装包
  pegno use api        → 使用保存的迷你工作空间
  pegno list           → 列出迷你工作空间
  pegno --dev          → 作为 devDependency 安装
  pegno --copy         → 复制而不是链接
  pegno sync           → 复制整个全局工作空间
  pegno --verbose      → 详细日志
```

---

## 💡 使用示例

```bash
# 全局安装 axios 并链接到当前项目
pegno axios

# 安装多个包
pegno fastify zod openai

# 添加开发包
pegno --dev vitest typescript

# 创建并保存迷你工作空间
pegno use api
```

---

## 📁 内部结构

Pegno 自动创建：

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

每个包都是一个完整的目录（物理和可重用的缓存）。
预设是包含依赖列表的 JSON 描述。

---

## 🧠 设计哲学

该项目遵循三个原则：

1. **零冗余** — 没有任何东西被安装两次。
2. **智能链接** — 每个 `node_modules` 都是全局工作空间的窗口。
3. **野蛮主义简单性** — 一切都用 TypeScript，没有隐藏的魔法。

---

## 🔮 路线图

- [ ] 基于哈希的注册表（包校验和 + 版本）
- [ ] 交互式 CLI UI（`pegno ui`）

---

## 💬 为什么叫 "Pegno"？

因为**每个工具都需要一个好的挑衅。**  
这个想法是它"抓住你的模块"，但以智能的方式 —  
对从一开始就应该是全局的东西进行全局链接。

这个名字是对巴西黑客文化的讽刺致敬：  
挑衅性、幽默且实用。

---

## 🧑‍💻 作者

**Suissera da Bahia**  
热衷于分布式、弹性架构和 AI 的高级开发者。  
**Full Agentic Stack**、**EnzyChop.Tech**、**Virion.Delivery** 生态系统的创造者，现在还有… **Pegno**。

---

## 📄 许可证

MIT © Suissa — 自由使用、重新混合和改进。  
但如果坏了，那是 Bun 的错。
