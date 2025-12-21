<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="p3g logo"/>
</p>

<p align="center">
BunがBunを作り忘れたBun用グローバル依存関係マネージャー
</p>

<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/p3g" target="_blank">
    <img src="https://img.shields.io/npm/v/p3g.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "BunがBunを完成させるのを待つのに疲れた人によって作られた、Bun用のインテリジェントなグローバルワークスペース。"

---

## 🌍 Idiomas / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md) | 🇹🇷 [Türkçe](README-tr.md) | 🇸🇪 [Svenska](README-se.md) | 🇻🇳 [Tiếng Việt](README-vn.md) | 🇹🇭 [ไทย](README-th.md) | 🇮🇱 [עברית](README-he.md) | 🇮🇩 [Bahasa Indonesia](README-id.md)

---

<p align="center">
  <h1 align="center"><br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="p3g logo"/><br />とは？</h1>
</p>

**p3g**は**グローバルキャッシュ**、**オートリンク**、**ミニワークスペース**、**インスタント同期モード**を備えた依存関係マネージャーで、100% **Bun + TypeScript**で作られています。

このアイデアは、Bunが「速度とシンプルさ」を約束したものの、実際にはまだ重要な層が欠けているからです：  
**プロジェクト間での依存関係の真の再利用**。

各プロジェクトが同じライブラリを再インストールします。各ビルドが再ダウンロードします。各開発者が時間を無駄にします。

**p3g**は、システム上に**グローバルワークスペース**を作成し、依存関係を一度だけインストールして*シンボリックリンク*（またはお好みでコピー）で再利用することでこれを解決します。

---

## 🚀 インストール

```bash
bun add -g p3g

npm i -g p3g

# または直接実行
npx p3g
```

確認：

```bash
p3g --help
```

**⚠️ Windows:** コマンドが認識されない場合、BunのグローバルディレクトリをPATHに追加してください：

```powershell
# PATHに永続的に追加（管理者としてPowerShell）
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:USERPROFILE\.bun\bin", "User")
```

期待される出力：

```
p3g CLI 1.3.0

使用法:
  p3g axios@latest   → パッケージを直接インストール
  p3g use api        → 保存されたミニワークスペースを使用
  p3g list           → ミニワークスペースをリスト
  p3g --dev          → devDependencyとしてインストール
  p3g --copy         → リンクの代わりにコピー
  p3g sync           → グローバルワークスペース全体をコピー
  p3g --verbose      → 詳細ログ
```

---

## 💡 使用例

```bash
# axiosをグローバルにインストールし、現在のプロジェクトにリンク
p3g axios

# 複数のパッケージをインストール
p3g fastify zod openai

# 開発パッケージを追加
p3g --dev vitest typescript

# ミニワークスペースを作成・保存
p3g use api
```

### 🪟 Windowsユーザー

Windowsでは、シンボリックリンク作成の権限制限により`--copy`モードの使用を推奨します：

```bash
# Windows: 権限エラーを避けるため--copyを使用
p3g --copy axios fastify zod

# WindowsでのDevモード
p3g --dev --copy vitest typescript
```

**なぜWindowsで`--copy`を使うのか？**  
Windowsはシンボリックリンクの作成に特別な管理者権限を必要とします。`--copy`モードはパッケージを物理的に`node_modules`にコピーし、管理者として実行する必要なく完全な互換性を保証します。

---

## ⚡️ 主な機能

| 機能                                        | 説明                                                               |
| ------------------------------------------- | ------------------------------------------------------------------ |
| 💾 **インテリジェントグローバルキャッシュ** | 各パッケージはシステムに一度だけインストールされます。             |
| 🪄 **自動シンボリックリンク**               | `node_modules`の重複なし、すべてがグローバルキャッシュを指します。 |
| 📚 **コピーモード（`--copy`）**             | `node_modules`にも依存関係が欲しい場合。                           |
| 📦 **ミニワークスペース**                   | 名前付き依存関係セットを作成し、数秒で再適用。                     |
| 🧩 **あらゆるBunプロジェクトと互換**        | ネイティブAPIのみ使用（`fs`、`os`、`path`、`child_process`）。     |
| 🛠️ **`--dev`モード**                        | パッケージを直接`devDependencies`に追加。                          |
| 🔁 **`sync`モード**                         | グローバルワークスペース全体をローカル`node_modules`にコピー。     |
| 🎨 **カラーログ（`kleur`）**                | レベル、アイコン、インストール時間で高速デバッグ。                 |
| 🤗 **外部ランタイム依存関係なし**           | `kleur`とBunのみ。                                                 |

---

## 🧑‍💻 作者

**SuissAI**  
分散型、レジリエントアーキテクチャとAIに情熱を注ぐシニア開発者。  
**Full Agentic Stack**、**Atomic Behavior Types**エコシステムの創造者、そして今…**p3g**。

---

## 📄 ライセンス

MIT © Suissa、自由に使用、リミックス、改善してください。  
でも壊れたら、それはBunのせいです。
