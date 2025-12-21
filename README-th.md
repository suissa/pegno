<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="p3g logo"/>
</p>

<p align="center">
ตัวจัดการ dependency แบบ global สำหรับ Bun ที่ Bun ลืมสร้าง
</p>

<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/p3g" target="_blank">
    <img src="https://img.shields.io/npm/v/p3g.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "workspace แบบ global ที่ฉลาดสำหรับ Bun ที่สร้างโดยคนที่เบื่อการรอให้ Bun ทำ Bun ให้เสร็จ"

---

## 🌍 ภาษา / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md) | 🇹🇷 [Türkçe](README-tr.md) | 🇸🇪 [Svenska](README-se.md) | 🇻🇳 [Tiếng Việt](README-vn.md) | 🇹🇭 [ไทย](README-th.md) | 🇮🇱 [עברית](README-he.md) | 🇮🇩 [Bahasa Indonesia](README-id.md)

---

<p align="center">
  <h1 align="center"><br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="p3g logo"/><br /> คืออะไร?</h1>
</p>

**p3g** คือตัวจัดการ dependency ที่มี **global cache**, **auto-link**, **mini-workspaces** และ **โหมดซิงค์แบบทันที** — สร้างด้วย **Bun + TypeScript** 100%

ไอเดียนี้เกิดขึ้นเพราะ Bun สัญญาว่าจะให้ "ความเร็วและความเรียบง่าย" — แต่ในทางปฏิบัติ ยังขาดชั้นสำคัญอยู่:  
**การใช้ dependency ซ้ำระหว่างโปรเจกต์อย่างแท้จริง**

ทุกโปรเจกต์ติดตั้งไลบรารีเดิมซ้ำ ทุกการ build ดาวน์โหลดใหม่ ทุกนักพัฒนาเสียเวลา

**p3g** แก้ปัญหานี้โดยสร้าง **workspace แบบ global** ในระบบของคุณ ที่ dependency จะถูกติดตั้งครั้งเดียวและใช้ซ้ำผ่าน _symbolic links_ (หรือ copies หากคุณต้องการ)

---

## 🧪 แรงบันดาลใจ: ทำไมเราถึงสร้างสิ่งนี้สำหรับ Bun?

Bun เร็ว  
แต่เร็ว**เพียงอย่างเดียว**ไม่พอ

npm และ pnpm เข้าใจแล้วว่าอนาคตคือ **shared cache และ package atomicity** — แต่ Bun ยังคงพึ่งพา lockfiles และการติดตั้งซ้ำที่ไม่จำเป็น

ปรัชญาของ **p3g** เรียบง่าย:

> **โค้ดเป็นสิ่งชั่วคราว cache เป็นนิรันดร์**

เมื่อคุณติดตั้ง `axios@latest` ในโปรเจกต์หนึ่ง ทำไมต้องดาวน์โหลดใหม่ในอีกโปรเจกต์?  
**p3g** สร้าง global repository (`~/.p3g_workspace/js`) และเชื่อมโยง packages โดยตรงกับโปรเจกต์ — เหมือนสมองของ dependency

นอกจากนี้ยังเพิ่มสิ่งที่ไม่มี manager ตัวไหนเสนอ:

### 🧠 Mini-workspaces ("presets")

คุณสามารถบันทึกชุด dependency และนำไปใช้กับโปรเจกต์ใดก็ได้:

```bash
p3g axios fastify zod
# ถามว่าต้องการบันทึกเป็น preset ไหม → พิมพ์ "api"

p3g use api
# ติดตั้งทุกอย่างใหม่ทันที
```

---

## ⚡️ ฟีเจอร์หลัก

| ฟีเจอร์                                    | คำอธิบาย                                                        |
| ------------------------------------------ | --------------------------------------------------------------- |
| 💾 **Global Cache ที่ฉลาด**                | แต่ละ package ติดตั้งเพียงครั้งเดียวในระบบ                      |
| 🪄 **Symbolic Links อัตโนมัติ**            | ไม่มีการซ้ำซ้อนของ `node_modules` ทุกอย่างชี้ไปที่ global cache |
| 📦 **โหมด copy (`--copy`)**                | หากคุณต้องการ build ที่แยกออกจากกันโดยสมบูรณ์                   |
| 📚 **Mini-Workspaces**                     | สร้างชุด dependency ที่มีชื่อและนำมาใช้ใหม่ในไม่กี่วินาที       |
| 🧩 **เข้ากันได้กับโปรเจกต์ Bun ใดๆ**       | ใช้เฉพาะ native APIs (`fs`, `os`, `path`, `child_process`)      |
| 🛠️ **โหมด `--dev`**                        | เพิ่ม packages โดยตรงใน `devDependencies`                       |
| 🧭 **โหมด `sync`**                         | คัดลอก global workspace ทั้งหมดไปยัง local `node_modules`       |
| 🎨 **Logs สีสัน (`kleur`)**                | ระดับ ไอคอน และเวลาการติดตั้งสำหรับการ debug อย่างรวดเร็ว       |
| 🤗 **ไม่มี external runtime dependencies** | เฉพาะ `kleur` และ Bun 💯🚀🎯                                    |

---

## 🚀 การติดตั้ง

```bash
bun add -g p3g

npm i -g p3g

# หรือรันโดยตรง
npx p3g
```

ตรวจสอบ:

```bash
p3g --help
```

ผลลัพธ์ที่คาดหวัง:

```
p3g CLI 1.3.0

การใช้งาน:
  p3g axios@latest   → ติดตั้ง package โดยตรง
  p3g use api        → ใช้ miniworkspace ที่บันทึกไว้
  p3g list           → แสดงรายการ miniworkspaces
  p3g --dev          → ติดตั้งเป็น devDependency
  p3g --copy         → คัดลอกแทนการเชื่อมโยง
  p3g sync           → คัดลอก global workspace ทั้งหมด
  p3g --verbose      → logs แบบละเอียด
```

---

## 💡 ตัวอย่างการใช้งาน

```bash
# ติดตั้ง axios แบบ global และเชื่อมโยงกับโปรเจกต์ปัจจุบัน
p3g axios

# ติดตั้งหลาย packages
p3g fastify zod openai

# เพิ่ม development packages
p3g --dev vitest typescript

# สร้างและบันทึก mini-workspace
p3g use api
```

---

## 📁 โครงสร้างภายใน

p3g สร้างโดยอัตโนมัติ:

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

แต่ละ package เป็น directory ที่สมบูรณ์ (cache ทางกายภาพและใช้ซ้ำได้)
Presets เป็นคำอธิบาย JSON พร้อมรายการ dependency

---

## 🧠 ปรัชญาการออกแบบ

โปรเจกต์ปฏิบัติตามหลักการสามข้อ:

1. **ไม่มีความซ้ำซ้อน** — ไม่มีอะไรถูกติดตั้งสองครั้ง
2. **การเชื่อมโยงที่ฉลาด** — ทุก `node_modules` เป็นหน้าต่างสู่ global workspace
3. **ความเรียบง่ายแบบ brutalist** — ทุกอย่างใน TypeScript ไม่มีเวทมนตร์ที่ซ่อนอยู่

---

## 🔮 แผนงาน

- [ ] รองรับหลายภาษา (`.p3g/py`, `.p3g/rust`)
- [ ] Registry ที่ใช้ hash (package checksum + version)
- [ ] การซิงค์แบบกระจายผ่าน IPFS หรือ NFS
- [ ] UI CLI แบบโต้ตอบ (`p3g ui`)
- [ ] การรวมกับ local `p3g.json`

---

## 💬 ทำไมถึงเป็น "p3g"?

เพราะ**ทุกเครื่องมือต้องการการยั่วยุที่ดี**  
ไอเดียคือมัน "จับโมดูลของคุณ" แต่อย่างฉลาด —  
สร้างการเชื่อมโยงแบบ global ของสิ่งที่ควรจะเป็น global ตั้งแต่แรก

ชื่อนี้เป็นการแสดงความเคารพอย่างประชดประชันต่อวัฒนธรรม hacker ของบราซิล:  
ยั่วยุ ตลก และใช้งานได้

---

## 🧑‍💻 ผู้เขียน

**Suissera da Bahia**  
Senior developer ที่หลงใหลใน distributed, resilient architectures และ AI  
ผู้สร้าง ecosystem **Full Agentic Stack**, **EnzyChop.Tech**, **Virion.Delivery** และตอนนี้… **p3g**

---

## 📄 ใบอนุญาต

MIT © Suissa — เสรีในการใช้ remix และปรับปรุง  
แต่ถ้ามันพัง นั่นเป็นความผิดของ Bun
