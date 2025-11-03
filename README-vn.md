<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="Pegno logo"/>
</p>

<p align="center">
Trình quản lý dependency toàn cục cho Bun mà Bun đã quên tạo ra
</p>


<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/pegno" target="_blank">
    <img src="https://img.shields.io/npm/v/pegno.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "Một workspace toàn cục thông minh cho Bun, được tạo bởi ai đó đã mệt mỏi chờ đợi Bun hoàn thành Bun."

---

## 🌍 Ngôn ngữ / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md) | 🇹🇷 [Türkçe](README-tr.md) | 🇸🇪 [Svenska](README-se.md) | 🇻🇳 [Tiếng Việt](README-vn.md) | 🇹🇭 [ไทย](README-th.md) | 🇮🇱 [עברית](README-he.md) | 🇮🇩 [Bahasa Indonesia](README-id.md)

---

<p align="center">
  <h1 align="center"><br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="Pegno logo"/><br /> là gì?</h1>
</p>

**Pegno** là một trình quản lý dependency với **cache toàn cục**, **tự động liên kết**, **mini-workspace** và **chế độ đồng bộ tức thì** — được xây dựng 100% bằng **Bun + TypeScript**.

Ý tưởng ra đời vì Bun hứa hẹn "tốc độ và đơn giản" — nhưng trong thực tế, vẫn thiếu một lớp quan trọng:  
**tái sử dụng thực sự các dependency giữa các dự án**.

Mỗi dự án đều cài đặt lại những thư viện giống nhau. Mỗi lần build đều tải xuống lại. Mỗi developer đều lãng phí thời gian.

**Pegno** giải quyết điều này bằng cách tạo một **workspace toàn cục** trong hệ thống của bạn, nơi các dependency được cài đặt một lần và tái sử dụng qua *symbolic links* (hoặc copies nếu bạn muốn).

---

## 🧪 Động lực: tại sao chúng tôi tạo ra điều này cho Bun?

Bun nhanh.  
Nhưng nhanh **một mình** thì chưa đủ.

npm và pnpm đã hiểu rằng tương lai là **cache chia sẻ và tính nguyên tử của package** — nhưng Bun vẫn phụ thuộc vào lockfiles và cài đặt lại dư thừa.

Triết lý của **Pegno** rất đơn giản:

> **Code là tạm thời, cache là vĩnh cửu.**

Khi bạn cài đặt `axios@latest` trong một dự án, tại sao phải tải xuống lại trong dự án khác?  
**Pegno** tạo một kho toàn cục (`~/.pegno_workspace/js`) và liên kết các package trực tiếp đến dự án — như một bộ não dependency.

Ngoài ra, nó thêm vào thứ mà không có trình quản lý nào khác cung cấp:

### 🧠 Mini-workspace (các "preset")

Bạn có thể lưu các bộ dependency và áp dụng chúng cho bất kỳ dự án nào:
```bash
pegno axios fastify zod
# Hỏi bạn có muốn lưu làm preset không → gõ "api"

pegno use api
# cài đặt lại mọi thứ ngay lập tức
```

---

## ⚡️ Tính năng chính

| Tính năng | Mô tả |
|----------|------------|
| 💾 **Cache Toàn Cục Thông Minh** | Mỗi package chỉ được cài đặt một lần trong hệ thống. |
| 🪄 **Symbolic Links Tự Động** | Không có sự trùng lặp `node_modules`, mọi thứ đều trỏ đến cache toàn cục. |
| 📦 **Chế độ copy (`--copy`)** | Nếu bạn muốn các build hoàn toàn tách biệt. |
| 📚 **Mini-Workspace** | Tạo các bộ dependency có tên và áp dụng lại trong vài giây. |
| 🧩 **Tương thích với mọi dự án Bun** | Chỉ sử dụng các API gốc (`fs`, `os`, `path`, `child_process`). |
| 🛠️ **Chế độ `--dev`** | Thêm package trực tiếp vào `devDependencies`. |
| 🧭 **Chế độ `sync`** | Copy toàn bộ workspace toàn cục vào `node_modules` cục bộ. |
| 🎨 **Logs màu sắc (`kleur`)** | Cấp độ, biểu tượng và thời gian cài đặt để debug nhanh chóng. |
| 🤗 **Không có dependency runtime bên ngoài** | Chỉ có `kleur` và Bun. 💯🚀🎯 |

---

## 🚀 Cài đặt

```bash
bun add -g pegno

npm i -g pegno

# hoặc chạy trực tiếp
npx pegno
```

Xác minh:
```bash
pegno --help
```

Kết quả mong đợi:
```
pegno CLI 1.3.0

Cách sử dụng:
  pegno axios@latest   → Cài đặt package trực tiếp
  pegno use api        → Sử dụng miniworkspace đã lưu
  pegno list           → Liệt kê các miniworkspace
  pegno --dev          → Cài đặt như devDependency
  pegno --copy         → Copy thay vì liên kết
  pegno sync           → Copy toàn bộ workspace toàn cục
  pegno --verbose      → Logs chi tiết
```

---

## 💡 Ví dụ sử dụng

```bash
# Cài đặt axios toàn cục và liên kết đến dự án hiện tại
pegno axios

# Cài đặt nhiều package
pegno fastify zod openai

# Thêm các package phát triển
pegno --dev vitest typescript

# Tạo và lưu một mini-workspace
pegno use api
```

---

## 📁 Cấu trúc nội bộ

Pegno tự động tạo:

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

Mỗi package là một thư mục hoàn chỉnh (cache vật lý và có thể tái sử dụng).
Các preset là mô tả JSON với danh sách dependency.

---

## 🧠 Triết lý thiết kế

Dự án tuân theo ba nguyên tắc:

1. **Không dư thừa** — Không có gì được cài đặt hai lần.
2. **Liên kết thông minh** — Mỗi `node_modules` là một cửa sổ đến workspace toàn cục.
3. **Đơn giản tàn bạo** — Mọi thứ đều bằng TypeScript, không có phép thuật ẩn.

---

## 🔮 Lộ trình

- [ ] Hỗ trợ đa ngôn ngữ (`.pegno/py`, `.pegno/rust`)
- [ ] Registry dựa trên hash (checksum package + version)
- [ ] Đồng bộ phân tán qua IPFS hoặc NFS
- [ ] UI CLI tương tác (`pegno ui`)
- [ ] Tích hợp với `pegno.json` cục bộ

---

## 💬 Tại sao "Pegno"?

Vì **mọi công cụ đều cần một sự khiêu khích tốt.**  
Ý tưởng là nó "nắm lấy module của bạn", nhưng một cách thông minh —  
tạo liên kết toàn cục cho thứ lẽ ra phải toàn cục từ đầu.

Cái tên là một lời tri ân mỉa mai đến văn hóa hacker Brazil:  
khiêu khích, hài hước và chức năng.

---

## 🧑‍💻 Tác giả

**Suissera da Bahia**  
Developer senior đam mê về kiến trúc phân tán, có khả năng phục hồi và AI.  
Người tạo ra hệ sinh thái **Full Agentic Stack**, **EnzyChop.Tech**, **Virion.Delivery**, và bây giờ… **Pegno**.

---

## 📄 Giấy phép

MIT © Suissa — tự do sử dụng, remix và cải thiện.  
Nhưng nếu nó bị hỏng, đó là lỗi của Bun.