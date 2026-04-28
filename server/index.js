require('dotenv').config({ path: '../.env' }); // Load from project root
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// --- API Setup ---
const WEATHER_API_KEY = process.env.VITE_OPENWEATHER_API_KEY;

const TURKISH_CITIES = [
  "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", 
  "Sanliurfa", "Kocaeli", "Mersin", "Diyarbakir", "Hatay", "Manisa", 
  "Kayseri", "Samsun", "Balikesir", "Kahramanmaras", "Van", "Aydin", 
  "Denizli", "Sakarya", "Erzurum", "Trabzon", "Malatya"
];

// 1. Security Headers
app.use(helmet({
  contentSecurityPolicy: false,
}));

// 2. Controlled CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10kb' }));

// 3. Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Çok fazla istek yapıldı, lütfen daha sonra tekrar deneyin.' }
});
app.use('/api/', globalLimiter);

// 4. Validation Middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// --- API Endpoints ---

// STATS
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.prepare('SELECT * FROM UserStats LIMIT 1').get();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'İstatistikler alınamadı.' });
  }
});

// PROGRESS
app.get('/api/progress/all', (req, res) => {
  try {
    const progress = db.prepare('SELECT * FROM ModuleProgress').all();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: 'İlerleme verileri alınamadı.' });
  }
});

app.post('/api/progress', [
  body('grade').isInt(),
  body('topic').isString().notEmpty(),
  body('completed').isBoolean(),
  body('score').isNumeric(),
  validate
], (req, res) => {
  try {
    const { grade, topic, completed, score } = req.body;
    const existing = db.prepare('SELECT id FROM ModuleProgress WHERE topic = ?').get(topic);
    
    if (existing) {
      db.prepare('UPDATE ModuleProgress SET completed = ?, score = ?, lastAttempt = CURRENT_TIMESTAMP WHERE id = ?')
        .run(completed ? 1 : 0, score, existing.id);
    } else {
      db.prepare('INSERT INTO ModuleProgress (grade, topic, completed, score) VALUES (?, ?, ?, ?)')
        .run(grade, topic, completed ? 1 : 0, score);
    }
    
    // Update global stats
    const totalModules = db.prepare('SELECT COUNT(*) as count FROM ModuleProgress WHERE completed = 1').get().count;
    const avgScore = db.prepare('SELECT AVG(score) as avg FROM ModuleProgress WHERE completed = 1').get().avg || 0;
    
    db.prepare('UPDATE UserStats SET modulesCompleted = ?, averageScore = ? WHERE id = 1')
      .run(totalModules, Math.round(avgScore));

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'İlerleme kaydedilemedi.' });
  }
});

// SETTINGS
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM Settings LIMIT 1').get();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Ayarlar alınamadı.' });
  }
});

// NOTIFICATIONS
app.get('/api/notifications', (req, res) => {
  try {
    const notifications = db.prepare('SELECT * FROM Notifications ORDER BY timestamp DESC').all();
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
    res.status(500).json({ error: 'Bildirim güncellenemedi.' });
  }
});

app.post('/api/settings', [
  body('theme').optional().isIn(['light', 'dark']),
  body('emailNotifications').optional().isBoolean(),
  validate
], (req, res) => {
  try {
    const { theme, emailNotifications } = req.body;
    if (theme !== undefined) {
      db.prepare('UPDATE Settings SET theme = ? WHERE id = 1').run(theme);
    }
    if (emailNotifications !== undefined) {
      db.prepare('UPDATE Settings SET emailNotifications = ? WHERE id = 1').run(emailNotifications ? 1 : 0);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Ayarlar güncellenemedi.' });
  }
});

app.patch('/api/settings', [
  body('theme').optional().isIn(['light', 'dark']),
  body('emailNotifications').optional().isBoolean(),
  validate
], (req, res) => {
  try {
    const { theme, emailNotifications } = req.body;
    if (theme !== undefined) {
      db.prepare('UPDATE Settings SET theme = ? WHERE id = 1').run(theme);
    }
    if (emailNotifications !== undefined) {
      db.prepare('UPDATE Settings SET emailNotifications = ? WHERE id = 1').run(emailNotifications ? 1 : 0);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Ayarlar güncellenemedi.' });
  }
});

// WEATHER PROXY
app.get('/api/weather/compare', async (req, res) => {
  try {
    if (typeof fetch === 'undefined') {
       throw new Error('Fetch is not defined in this environment. Please use a newer Node.js version or install node-fetch.');
    }
    const esenlerUrl = `https://api.openweathermap.org/data/2.5/weather?q=Esenler,TR&appid=${WEATHER_API_KEY}&units=metric&lang=tr`;
    const randomCity = TURKISH_CITIES[Math.floor(Math.random() * TURKISH_CITIES.length)];
    const randomCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${randomCity},TR&appid=${WEATHER_API_KEY}&units=metric&lang=tr`;

    const [esenlerRes, randomRes] = await Promise.all([
      fetch(esenlerUrl).then(r => r.json()),
      fetch(randomCityUrl).then(r => r.json())
    ]);

    if (esenlerRes.cod !== 200 || randomRes.cod !== 200) {
      return res.status(500).json({ error: 'Hava durumu verileri alınamadı.' });
    }

    res.json({
      esenler: {
        name: "Esenler, İstanbul",
        temp: esenlerRes.main.temp,
        pressure: esenlerRes.main.pressure,
        humidity: esenlerRes.main.humidity,
        description: esenlerRes.weather[0].description,
        icon: esenlerRes.weather[0].icon,
        windSpeed: esenlerRes.wind.speed
      },
      random: {
        name: randomRes.name,
        temp: randomRes.main.temp,
        pressure: randomRes.main.pressure,
        humidity: randomRes.main.humidity,
        description: randomRes.weather[0].description,
        icon: randomRes.weather[0].icon,
        windSpeed: randomRes.wind.speed
      }
    });
  } catch (err) {
    console.error("Weather Proxy Error:", err);
    res.status(500).json({ error: 'Hava durumu servisine erişilemiyor.' });
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

app.delete('/api/notes/all', (req, res) => {
  try {
    db.prepare('DELETE FROM LabNotes').run();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Notlar silinemedi.' });
  }
});

app.delete('/api/notes/:id', [
  param('id').isInt(),
  validate
], (req, res) => {
  try {
    db.prepare('DELETE FROM LabNotes WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Not silinemedi.' });
  }
});

app.patch('/api/notes/:id', [
  param('id').isInt(),
  body('hypothesis').isString().trim().escape(),
  body('observation').isString().trim().escape(),
  validate
], (req, res) => {
  try {
    const { hypothesis, observation } = req.body;
    db.prepare('UPDATE LabNotes SET hypothesis = ?, observation = ? WHERE id = ?')
      .run(hypothesis, observation, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Not güncellenemedi.' });
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

app.use(express.static(path.join(__dirname, '../dist')));

// All other GET requests not handled before will return the React app
app.get(/(.*)/, (req, res) => {
  if (req.url.startsWith('/api')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`SECURE Backend running on port ${PORT}`);
});
