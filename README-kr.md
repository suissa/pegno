<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="Pegno logo"/>
</p>

<p align="center">
Bun이 만들기를 잊어버린 Bun용 글로벌 의존성 관리자
</p>


<p align="center">
  <a href="https://bun.sh" target="_blank"><img src="https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <a href="https://www.npmjs.com/package/pegno" target="_blank">
    <img src="https://img.shields.io/npm/v/pegno.svg" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg" />
</p>

> "Bun이 Bun을 완성하기를 기다리다 지친 사람이 만든 Bun용 지능형 글로벌 워크스페이스."

---

## 🌍 언어 / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md)

---

<p align="center">
  <h1 align="center"><br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="Pegno logo"/><br />란 무엇인가?</h1>
</p>

**Pegno**는 **글로벌 캐시**, **자동 링크**, **미니 워크스페이스**, **즉시 동기화 모드**를 갖춘 의존성 관리자입니다 — 100% **Bun + TypeScript**로 구축되었습니다.

이 아이디어는 Bun이 "속도와 단순함"을 약속했지만, 실제로는 여전히 중요한 계층이 누락되어 있기 때문에 탄생했습니다:  
**프로젝트 간 의존성의 진정한 재사용**.

각 프로젝트는 동일한 라이브러리를 다시 설치합니다. 각 빌드는 다시 다운로드합니다. 각 개발자는 시간을 낭비합니다.

**Pegno**는 시스템에 **글로벌 워크스페이스**를 생성하여 이를 해결합니다. 여기서 의존성은 한 번 설치되고 *심볼릭 링크*(또는 원하는 경우 복사본)를 통해 재사용됩니다.

---

## 🧪 동기: 왜 Bun을 위해 이것을 만들었나?

Bun은 빠릅니다.  
하지만 빠른 것**만으로는** 충분하지 않습니다.

npm과 pnpm은 이미 미래가 **공유 캐시와 패키지 원자성**임을 이해했습니다 — 하지만 Bun은 여전히 lockfile과 중복 재설치에 의존합니다.

**Pegno**의 철학은 간단합니다:

> **코드는 일시적이고, 캐시는 영원하다.**

한 프로젝트에서 `axios@latest`를 설치할 때, 왜 다른 프로젝트에서 다시 다운로드해야 할까요?  
**Pegno**는 글로벌 저장소(`~/.pegno_workspace/js`)를 생성하고 패키지를 프로젝트에 직접 링크합니다 — 의존성 두뇌처럼.

또한 다른 관리자가 제공하지 않는 기능을 추가합니다:

### 🧠 미니 워크스페이스 ("프리셋")

의존성 세트를 저장하고 모든 프로젝트에 적용할 수 있습니다:
```bash
pegno axios fastify zod
# 프리셋으로 저장할지 묻습니다 → "api" 입력

pegno use api
# 모든 것을 즉시 다시 설치
```

---

## ⚡️ 주요 기능

| 기능 | 설명 |
|----------|------------|
| 💾 **지능형 글로벌 캐시** | 각 패키지는 시스템에 한 번만 설치됩니다. |
| 🪄 **자동 심볼릭 링크** | `node_modules` 중복 없음, 모든 것이 글로벌 캐시를 가리킵니다. |
| 📦 **복사 모드 (`--copy`)** | 완전히 격리된 빌드를 원하는 경우. |
| 📚 **미니 워크스페이스** | 명명된 의존성 세트를 생성하고 몇 초 만에 재적용. |
| 🧩 **모든 Bun 프로젝트와 호환** | 네이티브 API만 사용 (`fs`, `os`, `path`, `child_process`). |
| 🛠️ **`--dev` 모드** | 패키지를 `devDependencies`에 직접 추가. |
| 🧭 **`sync` 모드** | 전체 글로벌 워크스페이스를 로컬 `node_modules`에 복사. |
| 🖼️ **컬러 로그 (`kleur`)** | 명확하고 재미있는 피드백. |
| 🤗 **외부 런타임 의존성 없음** | `kleur`와 Bun만. |

---

## 🚀 설치

```bash
bun add -g pegno

npm i -g pegno

# 또는 직접 실행
npx pegno
```

확인:
```bash
pegno --help
```

예상 출력:
```
pegno CLI 1.3.0

사용법:
  pegno axios@latest   → 패키지를 직접 설치
  pegno use api        → 저장된 미니워크스페이스 사용
  pegno list           → 미니워크스페이스 목록
  pegno --dev          → devDependency로 설치
  pegno --copy         → 링크 대신 복사
  pegno sync           → 전체 글로벌 워크스페이스 복사
  pegno --verbose      → 상세 로그
```

---

## 💡 사용 예제

```bash
# axios를 전역으로 설치하고 현재 프로젝트에 링크
pegno axios

# 여러 패키지 설치
pegno fastify zod openai

# 개발 패키지 추가
pegno --dev vitest typescript

# 미니 워크스페이스 생성 및 저장
pegno use api
```

---

## 📁 내부 구조

Pegno는 자동으로 생성합니다:

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

각 패키지는 완전한 디렉토리입니다 (물리적이고 재사용 가능한 캐시).
프리셋은 의존성 목록이 있는 JSON 설명입니다.

---

## 🧠 설계 철학

프로젝트는 세 가지 원칙을 따릅니다:

1. **제로 중복성** — 아무것도 두 번 설치되지 않습니다.
2. **지능형 링킹** — 각 `node_modules`는 글로벌 워크스페이스로의 창입니다.
3. **브루탈리스트 단순성** — 모든 것이 TypeScript로, 숨겨진 마법 없음.

---

## 🔮 로드맵

- [ ] 해시 기반 레지스트리 (패키지 체크섬 + 버전)
- [ ] 대화형 CLI UI (`pegno ui`)

---

## 💬 왜 "Pegno"인가?

**모든 도구에는 좋은 도발이 필요하기** 때문입니다.  
아이디어는 "당신의 모듈을 잡는다"는 것이지만, 지능적으로 —  
처음부터 글로벌이어야 했던 것의 글로벌 링크를 만드는 것입니다.

이름은 브라질 해커 문화에 대한 아이러니한 경의입니다:  
도발적이고, 유머러스하며, 기능적입니다.

---

## 🧑‍💻 저자

**Suissera da Bahia**  
분산형, 복원력 있는 아키텍처와 AI에 열정적인 시니어 개발자.  
**Full Agentic Stack**, **EnzyChop.Tech**, **Virion.Delivery** 생태계의 창조자, 그리고 이제… **Pegno**.

---

## 📄 라이선스

MIT © Suissa — 자유롭게 사용, 리믹스, 개선하세요.  
하지만 망가지면, 그건 Bun 탓입니다.