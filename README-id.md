<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="p3g logo"/>
</p>

<p align="center">
Manajer dependensi global untuk Bun yang Bun lupa buat
</p>

<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/p3g" target="_blank">
    <img src="https://img.shields.io/npm/v/p3g.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "Workspace global yang cerdas untuk Bun, dibuat oleh seseorang yang bosan menunggu Bun menyelesaikan Bun."

---

## 🌍 Bahasa / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md) | 🇹🇷 [Türkçe](README-tr.md) | 🇸🇪 [Svenska](README-se.md) | 🇻🇳 [Tiếng Việt](README-vn.md) | 🇹🇭 [ไทย](README-th.md) | 🇮🇱 [עברית](README-he.md) | 🇮🇩 [Bahasa Indonesia](README-id.md)

---

<p align="center">
  <h1 align="center">Apa itu <br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="p3g logo"/><br />?</h1>
</p>

**p3g** adalah manajer dependensi dengan **cache global**, **auto-link**, **mini-workspace** dan **mode sinkronisasi instan** — dibangun 100% dengan **Bun + TypeScript**.

Ide ini lahir karena Bun menjanjikan "kecepatan dan kesederhanaan" — tetapi dalam praktiknya, masih ada lapisan penting yang hilang:  
**penggunaan ulang dependensi yang nyata antar proyek**.

Setiap proyek menginstal ulang library yang sama. Setiap build mengunduh lagi. Setiap developer membuang waktu.

**p3g** menyelesaikan ini dengan membuat **workspace global** di sistem Anda, di mana dependensi diinstal sekali dan digunakan ulang melalui _symbolic links_ (atau salinan, jika Anda suka).

---

## 🫠🤌🏻💗 Motivasi: mengapa saya membuat ini untuk Bun?

Bun cepat.  
Tapi cepat **sendiri** tidak cukup.

npm dan pnpm sudah memahami bahwa masa depan adalah **cache bersama dan atomisitas paket** — tetapi Bun masih bergantung pada lockfiles dan instalasi ulang yang berlebihan.

Filosofi **p3g** sederhana:

> **Kode bersifat sementara, cache bersifat abadi.**

Ketika Anda menginstal `axios@latest` di satu proyek, mengapa mengunduhnya lagi di proyek lain?  
**p3g** membuat repositori global (`~/.p3g_workspace/js`) dan menghubungkan paket langsung ke proyek — seperti otak dependensi.

Selain itu, ia menambahkan sesuatu yang tidak ditawarkan manajer lain:

### 🧠 Mini-workspace ("preset")

Anda dapat menyimpan set dependensi dan menerapkannya ke proyek mana pun:

```bash
p3g axios fastify zod
# Menanyakan apakah Anda ingin menyimpan sebagai preset → ketik "api"

p3g use api
# menginstal semuanya lagi secara instan
```

---

## ⚡️ Fitur utama

| Fitur                                         | Deskripsi                                                              |
| --------------------------------------------- | ---------------------------------------------------------------------- |
| 💾 **Cache Global Cerdas**                    | Setiap paket diinstal hanya sekali di sistem.                          |
| 🪄 **Symbolic Links Otomatis**                | Tidak ada duplikasi `node_modules`, semuanya menunjuk ke cache global. |
| 📦 **Mode copy (`--copy`)**                   | Jika Anda ingin build yang benar-benar terisolasi.                     |
| 📚 **Mini-Workspace**                         | Buat set dependensi bernama dan terapkan ulang dalam hitungan detik.   |
| 🧩 **Kompatibel dengan proyek Bun apa pun**   | Hanya menggunakan API native (`fs`, `os`, `path`, `child_process`).    |
| 🛠️ **Mode `--dev`**                           | Menambahkan paket langsung ke `devDependencies`.                       |
| 🧭 **Mode `sync`**                            | Menyalin seluruh workspace global ke `node_modules` lokal.             |
| 🖼️ **Log berwarna (`kleur`)**                 | Umpan balik yang jelas dan menyenangkan.                               |
| 🤗 **Tidak ada dependensi runtime eksternal** | Hanya `kleur` dan Bun.                                                 |

---

## 🚀 Instalasi

```bash
bun add -g p3g

npm i -g p3g

# atau jalankan langsung
npx p3g
```

Verifikasi:

```bash
p3g --help
```

Output yang diharapkan:

```
p3g CLI 1.3.0

Penggunaan:
  p3g axios@latest   → Menginstal paket langsung
  p3g use api        → Menggunakan miniworkspace yang disimpan
  p3g list           → Menampilkan daftar miniworkspace
  p3g --dev          → Menginstal sebagai devDependency
  p3g --copy         → Menyalin alih-alih menghubungkan
  p3g sync           → Menyalin seluruh workspace global
  p3g --verbose      → Log detail
```

---

## 💡 Contoh penggunaan

```bash
# Menginstal axios secara global dan menghubungkan ke proyek saat ini
p3g axios

# Menginstal beberapa paket
p3g fastify zod openai

# Menambahkan paket pengembangan
p3g --dev vitest typescript

# Membuat dan menyimpan mini-workspace
p3g use api
```

---

## 📁 Struktur internal

p3g secara otomatis membuat:

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

Setiap paket adalah direktori lengkap (cache fisik dan dapat digunakan ulang).
Preset adalah deskripsi JSON dengan daftar dependensi.

---

## 🧠 Filosofi desain

Proyek mengikuti tiga prinsip:

1. **Nol redundansi** — Tidak ada yang diinstal dua kali.
2. **Linking cerdas** — Setiap `node_modules` adalah jendela ke workspace global.
3. **Kesederhanaan brutalis** — Semuanya dalam TypeScript, tanpa sihir tersembunyi.

---

## 🔮 Roadmap

- [ ] Dukungan multi-bahasa (`.p3g/py`, `.p3g/rust`)
- [ ] Registry berbasis hash (checksum paket + versi)
- [ ] Sinkronisasi terdistribusi melalui IPFS atau NFS
- [ ] UI CLI interaktif (`p3g ui`)
- [ ] Integrasi dengan `p3g.json` lokal

---

## 💬 Mengapa "p3g"?

Karena **setiap alat membutuhkan provokasi yang baik.**  
Idenya adalah ia "mengambil modul Anda", tetapi dengan cerdas —  
membuat tautan global dari apa yang seharusnya global sejak awal.

Nama ini adalah penghormatan ironis terhadap budaya hacker Brasil:  
provokatif, humoris, dan fungsional.

---

## 🧑‍💻 Penulis

**Suissera da Bahia**  
Developer senior yang bersemangat tentang arsitektur terdistribusi, resilient, dan AI.  
Pencipta ekosistem **Full Agentic Stack**, **EnzyChop.Tech**, **Virion.Delivery**, dan sekarang… **p3g**.

---

## 📄 Lisensi

MIT © Suissa — bebas untuk digunakan, remix, dan ditingkatkan.  
Tapi jika rusak, itu salah Bun.
