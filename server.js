require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { Pool } = require('pg');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many generation requests, please try again later.' }
});

app.use('/api/', apiLimiter);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
});

pool.query('SELECT NOW()', (err) => {
  if (err) console.error('❌ Database connection error:', err);
  else console.log('✅ Database connected');
});

// Generate horoscope/reading with Ollama AI
async function generateWithOllama(prompt) {
  try {
    const response = await axios.post(`${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/api/generate`, {
      model: process.env.OLLAMA_MODEL || 'mistral',
      prompt: prompt,
      stream: false,
      temperature: 0.8,
      top_p: 0.95
    });
    return response.data.response;
  } catch (error) {
    console.error('❌ Ollama error:', error.message);
    return null;
  }
}

// GET /api/horoscopes
app.get('/api/horoscopes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM horoscopes ORDER BY created_at DESC LIMIT 20');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/horoscope/:type
app.get('/api/horoscope/:type', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM horoscopes WHERE type = $1 ORDER BY created_at DESC LIMIT 1', [req.params.type]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/generate-horoscopes
app.post('/api/generate-horoscopes', generateLimiter, async (req, res) => {
  try {
    const types = [
      { key: 'daily', label: 'יומי', timeframe: 'היום' },
      { key: 'weekly', label: 'שבועי', timeframe: 'השבוע' },
      { key: 'monthly', label: 'חודשי', timeframe: 'החודש' }
    ];
    const generated = [];
    for (const t of types) {
      const prompt = `אתה מעריכת כוכבים מקצועית ומיסטית בשם IvanasAlchemy. כתבי הורוסקופ ${t.label} יפה ומעמיק בעברית ל${t.timeframe}. כלול: אנרגיה כללית, אהבה, כסף, בריאות, ומסר רוחני. 4-5 פסקאות. סגנון מיסטי, חם ואישי.`;
      const content = await generateWithOllama(prompt);
      if (content) {
        const r = await pool.query('INSERT INTO horoscopes (type, content) VALUES ($1, $2) RETURNING *', [t.key, content]);
        generated.push(r.rows[0]);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
    res.json({ success: true, count: generated.length, horoscopes: generated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/readings - runes, love, future, messages
app.get('/api/readings', async (req, res) => {
  try {
    const { type } = req.query;
    const query = type
      ? 'SELECT * FROM readings WHERE type = $1 ORDER BY created_at DESC LIMIT 20'
      : 'SELECT * FROM readings ORDER BY created_at DESC LIMIT 20';
    const result = type ? await pool.query(query, [type]) : await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/generate-reading
app.post('/api/generate-reading', generateLimiter, async (req, res) => {
  try {
    const { type } = req.body;
    const prompts = {
      runes: `אתה מומחית רונות מיסטית של IvanasAlchemy. משכי 3 רונות (עבר, הווה, עתיד) ופרשי אותן בעברית. כתבי את שם הרונה, המשמעות שלה, ופירוש אישי ומעמיק. סגנון עתיק ומיסטי.`,
      love: `אתה קוראת קלפים ומומחית אהבה מיסטית של IvanasAlchemy. תני קריאת אהבה מעמיקה בעברית. כלול: מצב הקשר הנוכחי, אנרגיות שפועלות, מה הלב זקוק לו, וייעוץ רוחני לאהבה. 3-4 פסקאות.`,
      future: `אתה חוזה עתיד מיסטית של IvanasAlchemy. תני חיזוי עתיד מעמיק בעברית ל-3 חודשים הקרובים. כלול: תחום אישי, מקצועי, רגשי ורוחני. מסר מסכם. 4-5 פסקאות. סגנון מיסטי ומעורר השראה.`,
      messages: `אתה שליחת מסרים מהיקום של IvanasAlchemy. שלחי מסר רוחני עמוק ואישי בעברית. מסר של תקווה, כוח ואהבה מהיקום. 2-3 פסקאות קצרות ועמוקות.`
    };
    const prompt = prompts[type] || prompts.messages;
    const content = await generateWithOllama(prompt);
    if (!content) return res.status(500).json({ error: 'AI generation failed' });
    const result = await pool.query('INSERT INTO readings (type, content) VALUES ($1, $2) RETURNING *', [type, content]);
    res.json({ success: true, reading: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reports
app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query('SELECT r.*, p.name as project_name FROM reports r JOIN projects p ON r.project_id = p.id ORDER BY r.generated_at DESC LIMIT 50');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/generate-reports
app.post('/api/generate-reports', generateLimiter, async (req, res) => {
  try {
    const projects = await pool.query("SELECT * FROM projects WHERE status = 'active'");
    const generated = [];
    for (const project of projects.rows) {
      const prompt = `אתה כותבת דוחות מקצועיים של IvanasAlchemy. כתבי דוח מקצועי ומרשים בעברית על הפרויקט: ${project.name}. תיאור: ${project.description}. טכנולוגיות: ${(project.technologies||[]).join(', ')}. כלול: מה הפרויקט, ערכו הטכני, ההשפעה, ומסר מסכם. 3-4 פסקאות.`;
      const content = await generateWithOllama(prompt);
      if (content) {
        const r = await pool.query(
          'INSERT INTO reports (project_id, title, content, summary) VALUES ($1, $2, $3, $4) ON CONFLICT (project_id) DO UPDATE SET content = $3, summary = $4, generated_at = NOW() RETURNING *',
          [project.id, `${project.name} - דוח מקצועי`, content, content.substring(0, 200) + '...']
        );
        generated.push(r.rows[0]);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
    res.json({ success: true, count: generated.length, reports: generated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`🧪 IvanasAlchemy server running on port ${PORT}`));
