require('dotenv').config({ path: '../.env' }); // Load from project root
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// --- AI Setup (Server Side for Security) ---
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

// 1. Security Headers
app.use(helmet({
  contentSecurityPolicy: false,
}));

// 2. Controlled CORS
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10kb' }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// 3. Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Çok fazla istek yapıldı, lütfen daha sonra tekrar deneyin.' }
});
app.use('/api/', globalLimiter);

// Special AI Limiter (more restrictive to save tokens/prevent abuse)
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { error: 'Yapay zeka kullanımı dakikada 5 mesajla sınırlandırılmıştır.' }
});

// 4. Validation Middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// --- API Endpoints ---

// SECURE AI CHAT PROXY
app.post('/api/ai/chat', [
  aiLimiter,
  body('message').isString().notEmpty().trim().escape(),
  body('history').isArray(),
  body('socratic').isBoolean(),
  validate
], async (req, res) => {
  try {
    const { message, history, socratic } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
    });

    const promptToSend = socratic 
      ? `ÖNEMLİ PEDAGOJİK TALİMAT: Sen AETHER Labs'in Sokratik bir öğretmenisin. Öğrenciye ASLA doğrudan cevap verme. Ona ipuçları ver ve düşünmesini sağlayacak sorular sorarak cevabı kendisinin bulmasını sağla. Öğrencinin sorusu: ${message}` 
      : message;

    const result = await chat.sendMessage(promptToSend);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (err) {
    console.error("AI Proxy Error:", err);
    res.status(500).json({ error: 'Yapay zeka servisine erişilemiyor.' });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = db.prepare('SELECT totalTime, modulesCompleted, averageScore, activeDays FROM UserStats LIMIT 1').get();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Veriler alınamadı.' });
  }
});

app.get('/api/progress/all', (req, res) => {
  try {
    const progress = db.prepare('SELECT grade, topic, completed, score FROM ModuleProgress').all();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: 'İlerleme verileri alınamadı.' });
  }
});

app.post('/api/progress', [
  body('grade').isInt(),
  body('topic').isString().notEmpty(),
  body('completed').isBoolean(),
  body('score').isFloat(),
  validate
], (req, res) => {
  try {
    const { grade, topic, completed, score } = req.body;
    
    // Check if progress already exists for this topic
    const existing = db.prepare('SELECT id FROM ModuleProgress WHERE topic = ?').get(topic);
    
    if (existing) {
      db.prepare('UPDATE ModuleProgress SET completed = ?, score = ?, lastAttempt = CURRENT_TIMESTAMP WHERE topic = ?')
        .run(completed ? 1 : 0, score, topic);
    } else {
      db.prepare('INSERT INTO ModuleProgress (grade, topic, completed, score) VALUES (?, ?, ?, ?)')
        .run(grade, topic, completed ? 1 : 0, score);
    }

    // Update global stats
    if (completed) {
      db.prepare('UPDATE UserStats SET modulesCompleted = modulesCompleted + 1, totalTime = totalTime + 15 WHERE id = 1').run();
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Progress update error:", err);
    res.status(500).json({ error: 'İlerleme kaydedilemedi.' });
  }
});

app.get('/api/notifications', (req, res) => {
  try {
    const notifications = db.prepare('SELECT id, message, timestamp, read FROM Notifications ORDER BY timestamp DESC').all();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Bildirimler alınamadı.' });
  }
});

app.post('/api/notifications/:id/read', [
  param('id').isInt(),
  validate
], (req, res) => {
  try {
    db.prepare('UPDATE Notifications SET read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'İşlem başarısız.' });
  }
});

app.get('/api/settings', (req, res) => {
  try {
    const settings = db.prepare('SELECT theme, emailNotifications FROM Settings LIMIT 1').get();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Ayarlar yüklenemedi.' });
  }
});

app.post('/api/settings', [
  body('theme').isIn(['light', 'dark']),
  body('emailNotifications').isBoolean(),
  validate
], (req, res) => {
  try {
    const { theme, emailNotifications } = req.body;
    db.prepare('UPDATE Settings SET theme = ?, emailNotifications = ? WHERE id = 1')
      .run(theme, emailNotifications ? 1 : 0);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Kaydetme hatası.' });
  }
});

app.get('/api/notes/all', (req, res) => {
  try {
    const notes = db.prepare('SELECT id, topic, hypothesis, observation, timestamp FROM LabNotes ORDER BY timestamp DESC').all();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Notlar alınamadı.' });
  }
});

app.get('/api/notes/:topic', [
  param('topic').isString().notEmpty().trim().escape(),
  validate
], (req, res) => {
  try {
    const notes = db.prepare('SELECT id, hypothesis, observation, timestamp FROM LabNotes WHERE topic = ? ORDER BY timestamp DESC').all(req.params.topic);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Veri hatası.' });
  }
});

app.post('/api/notes', [
  body('topic').isString().notEmpty().trim().escape(),
  body('hypothesis').isString().trim().escape(),
  body('observation').isString().trim().escape(),
  validate
], (req, res) => {
  try {
    const { topic, hypothesis, observation } = req.body;
    db.prepare('INSERT INTO LabNotes (topic, hypothesis, observation) VALUES (?, ?, ?)')
      .run(topic, hypothesis, observation);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Kayıt hatası.' });
  }
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    res.status(404).json({ error: 'API route not found' });
  }
});

app.listen(PORT, () => {
  console.log(`SECURE Backend running on http://localhost:${PORT}`);
});
