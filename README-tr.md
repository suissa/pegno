<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="Pegno logo"/>
</p>

<p align="center">
Bun'un yapmayı unuttuğu Bun için global bağımlılık yöneticisi
</p>


<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/pegno" target="_blank">
    <img src="https://img.shields.io/npm/v/pegno.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "Bun'un Bun'u bitirmesini beklemekten bıkan biri tarafından yapılmış Bun için akıllı global çalışma alanı."

---

## 🌍 Diller / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md) | 🇹🇷 [Türkçe](README-tr.md) | 🇸🇪 [Svenska](README-se.md) | 🇻🇳 [Tiếng Việt](README-vn.md) | 🇹🇭 [ไทย](README-th.md) | 🇮🇱 [עברית](README-he.md) | 🇮🇩 [Bahasa Indonesia](README-id.md)

---

<p align="center">
  <h1 align="center"><br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="Pegno logo"/><br /> nedir?</h1>
</p>

**Pegno**, **global önbellek**, **otomatik bağlantı**, **mini çalışma alanları** ve **anlık senkronizasyon modu** ile bir bağımlılık yöneticisidir — %100 **Bun + TypeScript** ile inşa edilmiştir.

Bu fikir, Bun'un "hız ve basitlik" vaat etmesine rağmen, pratikte hala önemli bir katmanın eksik olması nedeniyle doğdu:  
**projeler arası bağımlılıkların gerçek yeniden kullanımı**.

Her proje aynı kütüphaneleri yeniden yükler. Her build yeniden indirir. Her geliştirici zaman kaybeder.

**Pegno** bunu sisteminizde bir **global çalışma alanı** oluşturarak çözer, burada bağımlılıklar bir kez yüklenir ve *sembolik bağlantılar* (veya isterseniz kopyalar) aracılığıyla yeniden kullanılır.

---

## 🫠🤌🏻💗 Motivasyon: neden Bun için bunu yarattım?

Bun hızlı.  
Ama **tek başına** hızlı yeterli değil.

npm ve pnpm, geleceğin **paylaşılan önbellek ve paket atomikliği** olduğunu zaten anladı — ama Bun hala kilit dosyalarına ve gereksiz yeniden yüklemeye bağımlı.

**Pegno** felsefesi basit:

> **Kod geçici, önbellek sonsuzdur.**

Bir projede `axios@latest` yüklediğinizde, neden başka bir projede tekrar indiresiniz?  
**Pegno** global bir depo (`~/.pegno_workspace/js`) oluşturur ve paketleri doğrudan projelere bağlar — bir bağımlılık beyni gibi.

Ayrıca, başka hiçbir yöneticinin sunmadığı bir şey ekler:

### 🧠 Mini çalışma alanları ("ön ayarlar")

Bağımlılık setlerini kaydedebilir ve herhangi bir projeye uygulayabilirsiniz:
```bash
pegno axios fastify zod
# Ön ayar olarak kaydetmek isteyip istemediğinizi sorar → "api" yazın

pegno use api
# her şeyi anında yeniden yükler
```

---

## ⚡️ Ana özellikler

| Özellik | Açıklama |
|----------|------------|
| 💾 **Akıllı Global Önbellek** | Her paket sistemde sadece bir kez yüklenir. |
| 🪄 **Otomatik Sembolik Bağlantılar** | `node_modules` çoğaltması yok, her şey global önbelleği işaret eder. |
| 📦 **Kopyalama modu (`--copy`)** | Tamamen izole buildler istiyorsanız. |
| 📚 **Mini Çalışma Alanları** | Adlandırılmış bağımlılık setleri oluşturun ve saniyeler içinde yeniden uygulayın. |
| 🧩 **Herhangi bir Bun projesi ile uyumlu** | Sadece yerel API'ler kullanır (`fs`, `os`, `path`, `child_process`). |
| 🛠️ **`--dev` modu** | Paketleri doğrudan `devDependencies`'e ekler. |
| 🧭 **`sync` modu** | Tüm global çalışma alanını yerel `node_modules`'e kopyalar. |
| 🖼️ **Renkli loglar (`kleur`)** | Net ve eğlenceli geri bildirim. |
| 🤗 **Harici çalışma zamanı bağımlılığı yok** | Sadece `kleur` ve Bun. |

---

## 🚀 Kurulum

```bash
bun add -g pegno

npm i -g pegno

# veya doğrudan çalıştır
npx pegno
```

Doğrula:
```bash
pegno --help
```

Beklenen çıktı:
```
pegno CLI 1.3.0

Kullanım:
  pegno axios@latest   → Paketi doğrudan yükler
  pegno use api        → Kaydedilmiş mini çalışma alanını kullanır
  pegno list           → Mini çalışma alanlarını listeler
  pegno --dev          → devDependency olarak yükler
  pegno --copy         → Bağlamak yerine kopyalar
  pegno sync           → Tüm global çalışma alanını kopyalar
  pegno --verbose      → Ayrıntılı loglar
```

---

## 💡 Kullanım örneği

```bash
# axios'u global olarak yükler ve mevcut projeye bağlar
pegno axios

# Birden fazla paket yükler
pegno fastify zod openai

# Geliştirme paketleri ekler
pegno --dev vitest typescript

# Mini çalışma alanı oluşturur ve kaydeder
pegno use api
```

---

## 📁 İç yapı

Pegno otomatik olarak oluşturur:

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

Her paket tam bir dizindir (fiziksel ve yeniden kullanılabilir önbellek).
Ön ayarlar, bağımlılık listeleri olan JSON açıklamalarıdır.

---

## 🧠 Tasarım felsefesi

Proje üç ilkeyi takip eder:

1. **Sıfır gereksizlik** — Hiçbir şey iki kez yüklenmez.
2. **Akıllı bağlantı** — Her `node_modules` global çalışma alanına bir penceredir.
3. **Brütalist basitlik** — Her şey TypeScript'te, gizli sihir yok.

---

## 🔮 Yol haritası

- [ ] Hash tabanlı kayıt (paket sağlama toplamı + sürüm)
- [ ] Etkileşimli CLI UI (`pegno ui`)

---

## 💬 Neden "Pegno"?

Çünkü **her araç iyi bir provokasyona ihtiyaç duyar.**  
Fikir "modülünü yakalar" ama akıllıca —  
başından beri global olması gereken şeyin global bağlantısını yapar.

İsim Brezilya hacker kültürüne ironik bir saygı duruşudur:  
provokatif, esprili ve işlevsel.

---

## 🧑‍💻 Yazar

**Suissera da Bahia**  
Dağıtık, dayanıklı mimariler ve AI konusunda tutkulu kıdemli geliştirici.  
**Full Agentic Stack**, **EnzyChop.Tech**, **Virion.Delivery** ekosisteminin yaratıcısı ve şimdi… **Pegno**.

---

## 📄 Lisans

MIT © Suissa — kullanmak, remiks yapmak ve geliştirmek için özgür.  
Ama bozulursa, Bun'un suçu.