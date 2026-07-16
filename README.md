# 🔮 IvanasAlchemy — מיסטיקה, טארוט, רונות ואלכימיה

**אתר רשמי:** [https://ivanasalchemy.online](https://ivanasalchemy.online)

אתר מיסטיקה מקצועי של איוונה — הורוסקופים, טארוט, רונות נורדיות, חיזוי עתיד, מסרים מהיקום ואלכימיה.

---

## 📋 תוכן עניינים

- [תכונות](#תכונות)
- [דרישות מערכת](#דרישות-מערכת)
- [התקנה](#התקנה)
- [הגדרות סביבה](#הגדרות-סביבה)
- [הפעלת Ollama AI](#הפעלת-ollama-ai)
- [אתחול מסד הנתונים](#אתחול-מסד-הנתונים)
- [הרצת השרת](#הרצת-השרת)
- [API Endpoints](#api-endpoints)

---

## ✨ תכונות

- 🔮 **הורוסקופים** — יומי, שבועי וחודשי שנוצרים על ידי AI
- ✨ **רונות נורדיות** — קריאת 3 רונות (עבר, הווה, עתיד)
- 💕 **קריאות אהבה** — ניתוח רוחני עמוק לחיי האהבה
- 🔭 **חיזוי עתיד** — תחזיות ל-3 חודשים קרובים
- 💫 **מסרים מהיקום** — מסרים רוחניים אישיים
- 📋 **דוחות מקצועיים** — דוחות מפורטים על פרויקטים
- 🌐 **Fallback סטטי** — תוכן מוכן גם ללא שרת

---

## 💻 דרישות מערכת

- Node.js >= 16.0.0
- PostgreSQL >= 13
- [Ollama](https://ollama.ai) עם מודל mistral

---

## 🚀 התקנה

```bash
# שכפל את הפרויקט
git clone https://github.com/ivanamikush92-dot/Ivana-s-Alchemy-.git
cd Ivana-s-Alchemy-

# התקן תלויות
npm install
```

---

## ⚙️ הגדרות סביבה

צור קובץ `.env` בשורש הפרויקט (על בסיס `.env.example`):

```bash
cp .env.example .env
```

ערוך את `.env` עם הפרטים שלך:

```env
DATABASE_URL=******localhost:5432/ivanas_alchemy
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
PORT=3000
NODE_ENV=production
```

---

## 🤖 הפעלת Ollama AI

```bash
# התקן Ollama (מ-https://ollama.ai)
curl -fsSL https://ollama.ai/install.sh | sh

# הורד את מודל mistral
ollama pull mistral

# הפעל את שרת Ollama
ollama serve
```

---

## 🗄️ אתחול מסד הנתונים

```bash
# צור את מסד הנתונים
createdb ivanas_alchemy

# אתחל את הטבלאות
psql -d ivanas_alchemy < db-init.sql
```

---

## ▶️ הרצת השרת

```bash
# הרצה בסביבת פיתוח (עם nodemon)
npm run dev

# הרצה בסביבת ייצור
npm start
```

האתר יהיה זמין בכתובת: [http://localhost:3000](http://localhost:3000)

---

## 🔗 API Endpoints

| Method | Endpoint | תיאור |
|--------|----------|-------|
| GET | `/api/health` | בדיקת זמינות השרת |
| GET | `/api/horoscopes` | קבלת הורוסקופים אחרונים |
| GET | `/api/horoscope/:type` | קבלת הורוסקופ לפי סוג |
| POST | `/api/generate-horoscopes` | יצירת הורוסקופים חדשים |
| GET | `/api/readings` | קבלת קריאות (עם `?type=runes/love/future/messages`) |
| POST | `/api/generate-reading` | יצירת קריאה חדשה (`body: { type }`) |
| GET | `/api/reports` | קבלת דוחות מקצועיים |
| POST | `/api/generate-reports` | יצירת דוחות חדשים |

---

## 📱 יצירת קשר

- 📱 **WhatsApp:** [wa.me/972508115830](https://wa.me/972508115830)
- 🎵 **TikTok:** [@ivanas_alchemy](https://www.tiktok.com/@ivanas_alchemy)
- 💳 **PayPal:** [paypal.me/ivana1mikush](https://www.paypal.me/ivana1mikush)

---

💫 *IvanasAlchemy 2026 — כל הזכויות שמורות*
