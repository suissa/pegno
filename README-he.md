<p align="center">
  <img src="https://i.imgur.com/IhXEEQM.png" width="680" alt="Pegno logo"/>
</p>

<p align="center">
מנהל התלויות הגלובלי עבור Bun ש-Bun שכח ליצור
</p>

[![Bun](https://img.shields.io/badge/made%20for-bun-000000.svg?logo=bun)](https://bun.sh)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/badge/npm-v/pegno.svg)](https://www.npmjs.com/package/pegno)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg)](https://www.typescriptlang.org/)

> "סביבת עבודה גלובלית חכמה עבור Bun, שנוצרה על ידי מישהו שנמאס לו לחכות ש-Bun יסיים את Bun."

---

## 🌍 שפות / Languages

🇧🇷 [Português](README.md) | 🇺🇸 [English](README-en.md) | 🇪🇸 [Español](README-es.md) | 🇩🇪 [Deutsch](README-de.md) | 🇫🇷 [Français](README-fr.md) | 🇳🇱 [Nederlands](README-nl.md) | 🇯🇵 [日本語](README-jp.md) | 🇨🇳 [中文](README-ch.md) | 🇮🇳 [हिंदी](README-hi.md) | 🇷🇺 [Русский](README-ru.md) | 🇵🇱 [Polski](README-pl.md) | 🇮🇹 [Italiano](README-it.md) | 🇰🇷 [한국어](README-kr.md) | 🇸🇦 [العربية](README-ar.md) | 🇹🇷 [Türkçe](README-tr.md) | 🇸🇪 [Svenska](README-se.md) | 🇻🇳 [Tiếng Việt](README-vn.md) | 🇹🇭 [ไทย](README-th.md) | 🇮🇱 [עברית](README-he.md) | 🇮🇩 [Bahasa Indonesia](README-id.md)

---

<p align="center">
  <h1 align="center">מה זה <br /><img src="https://i.imgur.com/P1VL4bC.png" height="80" alt="Pegno logo"/><br />?</h1>
</p>

**Pegno** הוא מנהל תלויות עם **מטמון גלובלי**, **קישור אוטומטי**, **מיני-סביבות עבודה** ו**מצב סינכרון מיידי** — בנוי 100% ב-**Bun + TypeScript**.

הרעיון נולד כי Bun הבטיח "מהירות ופשטות" — אבל בפועל, עדיין חסרה שכבה חיונית:  
**שימוש חוזר אמיתי של תלויות בין פרויקטים**.

כל פרויקט מתקין מחדש את אותן ספריות. כל build מוריד מחדש. כל מפתח מבזבז זמן.

**Pegno** פותר את זה על ידי יצירת **סביבת עבודה גלובלית** במערכת שלך, שבה תלויות מותקנות פעם אחת ונעשה בהן שימוש חוזר דרך _קישורים סימבוליים_ (או עותקים, אם אתה מעדיף).

---

## 🧪 מוטיבציה: למה יצרנו את זה עבור Bun?

Bun מהיר.  
אבל מהיר **לבד** לא מספיק.

npm ו-pnpm כבר הבינו שהעתיד הוא **מטמון משותף ואטומיות של חבילות** — אבל Bun עדיין תלוי בקבצי נעילה והתקנה מחדש מיותרת.

הפילוסופיה של **Pegno** פשוטה:

> **קוד הוא זמני, מטמון הוא נצחי.**

כשאתה מתקין `axios@latest` בפרויקט אחד, למה להוריד אותו שוב באחר?  
**Pegno** יוצר מאגר גלובלי (`~/.pegno_workspace/js`) ומקשר חבילות ישירות לפרויקטים — כמו מוח תלויות.

בנוסף, הוא מוסיף משהו שאף מנהל אחר לא מציע:

### 🧠 מיני-סביבות עבודה ("פריסטים")

אתה יכול לשמור סטים של תלויות ולהחיל אותם על כל פרויקט:

```bash
pegno axios fastify zod
# שואל אם אתה רוצה לשמור כפריסט → הקלד "api"

pegno use api
# מתקין הכל מחדש מיידית
```

---

## ⚡️ תכונות עיקריות

| תכונה                              | תיאור                                                          |
| ---------------------------------- | -------------------------------------------------------------- |
| 💾 **מטמון גלובלי חכם**            | כל חבילה מותקנת פעם אחת בלבד במערכת.                           |
| 🪄 **קישורים סימבוליים אוטומטיים** | אין שכפול של `node_modules`, הכל מצביע למטמון הגלובלי.         |
| 📦 **מצב העתקה (`--copy`)**        | אם אתה רוצה builds מבודדים לחלוטין.                            |
| 📚 **מיני-סביבות עבודה**           | צור סטים של תלויות עם שמות והחל מחדש בשניות.                   |
| 🧩 **תואם לכל פרויקט Bun**         | משתמש רק ב-APIs מקוריים (`fs`, `os`, `path`, `child_process`). |
| 🛠️ **מצב `--dev`**                 | מוסיף חבילות ישירות ל-`devDependencies`.                       |
| 🧭 **מצב `sync`**                  | מעתיק את כל סביבת העבודה הגלובלית ל-`node_modules` מקומיים.    |
| 🖼️ **לוגים צבעוניים (`kleur`)**    | משוב ברור ומהנה.                                               |
| 🤗 **אין תלויות runtime חיצוניות** | רק `kleur` ו-Bun.                                              |

---

## 🚀 התקנה

```bash
bun add -g pegno

npm i -g pegno

# או הרץ ישירות
npx pegno
```

אמת:

```bash
pegno --help
```

פלט צפוי:

```
pegno CLI 1.3.0

שימוש:
  pegno axios@latest   → מתקין חבילה ישירות
  pegno use api        → משתמש במיני-סביבת עבודה שמורה
  pegno list           → מציג רשימת מיני-סביבות עבודה
  pegno --dev          → מתקין כ-devDependency
  pegno --copy         → מעתיק במקום לקשר
  pegno sync           → מעתיק את כל סביבת העבודה הגלובלית
  pegno --verbose      → לוגים מפורטים
```

---

## 💡 דוגמת שימוש

```bash
# מתקין axios גלובלית ומקשר לפרויקט הנוכחי
pegno axios

# מתקין חבילות מרובות
pegno fastify zod openai

# מוסיף חבילות פיתוח
pegno --dev vitest typescript

# יוצר ושומר מיני-סביבת עבודה
pegno use api
```

---

## 📁 מבנה פנימי

Pegno יוצר אוטומטית:

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

כל חבילה היא תיקייה שלמה (מטמון פיזי וניתן לשימוש חוזר).
פריסטים הם תיאורי JSON עם רשימות תלויות.

---

## 🧠 פילוסופיית עיצוב

הפרויקט עוקב אחר שלושה עקרונות:

1. **אפס יתירות** — שום דבר לא מותקן פעמיים.
2. **קישור חכם** — כל `node_modules` הוא חלון לסביבת העבודה הגלובלית.
3. **פשטות ברוטליסטית** — הכל ב-TypeScript, בלי קסם נסתר.

---

## 🔮 מפת דרכים

- [ ] תמיכה בשפות מרובות (`.pegno/py`, `.pegno/rust`)
- [ ] רישום מבוסס hash (checksum של חבילה + גרסה)
- [ ] סינכרון מבוזר דרך IPFS או NFS
- [ ] UI CLI אינטראקטיבי (`pegno ui`)
- [ ] אינטגרציה עם `pegno.json` מקומי

---

## 💬 למה "Pegno"?

כי **כל כלי צריך פרובוקציה טובה.**  
הרעיון הוא שהוא "תופס את המודול שלך", אבל בחכמה —  
יוצר את הקישור הגלובלי של מה שהיה צריך להיות גלובלי מההתחלה.

השם הוא מחווה אירונית לתרבות ההאקרים הברזילאית:  
פרובוקטיבית, הומוריסטית ופונקציונלית.

---

## 🧑‍💻 מחבר

**Suissera da Bahia**  
מפתח בכיר הנלהב מארכיטקטורות מבוזרות, עמידות ו-AI.  
יוצר האקוסיסטם **Full Agentic Stack**, **EnzyChop.Tech**, **Virion.Delivery**, ועכשיו… **Pegno**.

---

## 📄 רישיון

MIT © Suissa — חופשי לשימוש, רמיקס ושיפור.  
אבל אם זה נשבר, זו אשמתו של Bun.
