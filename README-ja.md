<p align="center">
  <img src="https://i.imgur.com/cB70gh8.png" width="480" alt="PegNoMeu logo"/>
</p>

<p align="center">
Bunが作り忘れたBun用のグローバル依存関係マネージャー
</p>


[![Bun](https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun)](https://bun.sh)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/pegnomeu.svg)](https://www.npmjs.com/package/pegnomeu)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg)](https://www.typescriptlang.org/)

> "BunがBunを完成させるのを待つのに疲れた人によって作られた、Bun用のインテリジェントなグローバルワークスペース。"

---

<p align="center">
  <h1 align="center"><br /><img src="https://i.imgur.com/cB70gh8.png" height="80" alt="PegNoMeu logo"/><br />とは？</h1>
</p>

**PegNoMeu**は**グローバルキャッシュ**、**オートリンク**、**ミニワークスペース**、**インスタント同期モード**を備えた依存関係マネージャーです — 100% **Bun + TypeScript**で構築されています。

このアイデアは、Bunが「速度とシンプルさ」を約束したにも関わらず、実際にはまだ重要な層が欠けているからです：  
**プロジェクト間での依存関係の真の再利用**。

各プロジェクトが同じライブラリを再インストールします。各ビルドが再ダウンロードします。各開発者が時間を無駄にします。

**PegNoMeu**は、システム上に**グローバルワークスペース**を作成し、依存関係を一度インストールして*シンボリックリンク*（またはお好みでコピー）で再利用することでこれを解決します。

---

## 🧪 動機：なぜBun用にこれを作ったのか？

Bunは高速です。  
しかし高速**だけ**では十分ではありません。

npmとpnpmは、未来が**共有キャッシュとパッケージの原子性**であることをすでに理解しています — しかしBunはまだロックファイルと冗長な再インストールに依存しています。

**PegNoMeu**の哲学はシンプルです：

> **コードは一時的、キャッシュは永続的。**

あるプロジェクトで`axios@latest`をインストールしたとき、なぜ別のプロジェクトで再ダウンロードするのでしょうか？  
**PegNoMeu**はグローバルリポジトリ（`~/.pegnomeu_workspace/js`）を作成し、パッケージを直接プロジェクトにリンクします — 依存関係の脳のように。

さらに、他のマネージャーが提供していない機能を追加します：

### 🧠 ミニワークスペース（「プリセット」）

依存関係セットを保存し、任意のプロジェクトに適用できます：
```bash
pegnomeu axios fastify zod
# プリセットとして保存するか尋ねられます → "api"と入力

pegnomeu use api
# すべてを瞬時に再インストール
```

---

## ⚡️ 主な機能

| 機能 | 説明 |
|----------|------------|
| 💾 **インテリジェントグローバルキャッシュ** | 各パッケージはシステムに一度だけインストールされます。 |
| 🪄 **自動シンボリックリンク** | `node_modules`の重複なし、すべてがグローバルキャッシュを指します。 |
| 📦 **コピーモード（`--copy`）** | 完全に分離されたビルドが必要な場合。 |
| 📚 **ミニワークスペース** | 名前付き依存関係セットを作成し、数秒で再適用。 |
| 🧩 **あらゆるBunプロジェクトと互換** | ネイティブAPIのみ使用（`fs`、`os`、`path`、`child_process`）。 |
| 🛠️ **`--dev`モード** | パッケージを直接`devDependencies`に追加。 |
| 🧭 **`sync`モード** | グローバルワークスペース全体をローカル`node_modules`にコピー。 |
| 🖼️ **カラーログ（`kleur`）** | 明確で楽しいフィードバック。 |
| 🤗 **外部ランタイム依存関係なし** | `kleur`とBunのみ。 |

---

## 🚀 インストール

```bash
bun add -g pegnomeu

npm i -g pegnomeu

# または直接実行
npx pegnomeu
```

確認：
```bash
pegnomeu --help
```

期待される出力：
```
pegnomeu CLI 1.3.0

使用法：
  pegnomeu axios@latest   → パッケージを直接インストール
  pegnomeu use api        → 保存されたミニワークスペースを使用
  pegnomeu list           → ミニワークスペースをリスト
  pegnomeu --dev          → devDependencyとしてインストール
  pegnomeu --copy         → リンクではなくコピー
  pegnomeu sync           → グローバルワークスペース全体をコピー
  pegnomeu --verbose      → 詳細ログ
```

---

## 💡 使用例

```bash
# axiosをグローバルにインストールし、現在のプロジェクトにリンク
pegnomeu axios

# 複数のパッケージをインストール
pegnomeu fastify zod openai

# 開発パッケージを追加
pegnomeu --dev vitest typescript

# ミニワークスペースを作成・保存
pegnomeu use api
```

---

## 📁 内部構造

PegNoMeuは自動的に作成します：

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

各パッケージは完全なディレクトリ（物理的で再利用可能なキャッシュ）です。
プリセットは依存関係リストを含むJSON記述です。

---

## 🧠 設計哲学

プロジェクトは3つの原則に従います：

1. **ゼロ冗長性** — 何も二度インストールされません。
2. **インテリジェントリンク** — 各`node_modules`はグローバルワークスペースへの窓です。
3. **ブルータリストなシンプルさ** — すべてTypeScriptで、隠された魔法はありません。

---

## 🔮 ロードマップ

- [ ] 多言語サポート（`.pegnomeu/py`、`.pegnomeu/rust`）
- [ ] ハッシュベースレジストリ（パッケージチェックサム + バージョン）
- [ ] IPFSまたはNFS経由の分散同期
- [ ] インタラクティブCLI UI（`pegnomeu ui`）
- [ ] ローカル`pegnomeu.json`との統合

---

## 💬 なぜ「PegNoMeu」？

なぜなら**すべてのツールには良い挑発が必要**だからです。  
アイデアは「あなたのモジュールを掴む」ことですが、インテリジェントに —  
最初からグローバルであるべきだったもののグローバルリンクを作ります。

この名前はブラジルのハッカー文化への皮肉な敬意です：  
挑発的で、ユーモラスで、機能的。

---

## 🧑‍💻 作者

**Suissera da Bahia**  
分散型で回復力のあるアーキテクチャとAIに情熱を注ぐシニア開発者。  
**Full Agentic Stack**、**EnzyChop.Tech**、**Virion.Delivery**エコシステムの創造者、そして今…**PegNoMeu**。

---

## 📄 ライセンス

MIT © Suissa — 自由に使用、リミックス、改善してください。  
しかし壊れたら、それはBunのせいです。