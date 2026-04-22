const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Endpoints
app.get('/api/stats', (req, res) => {
  const stats = db.prepare('SELECT * FROM UserStats LIMIT 1').get();
  res.json(stats);
});

app.get('/api/notifications', (req, res) => {
  const notifications = db.prepare('SELECT * FROM Notifications ORDER BY timestamp DESC').all();
  res.json(notifications);
});

app.post('/api/notifications/:id/read', (req, res) => {
  db.prepare('UPDATE Notifications SET read = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/settings', (req, res) => {
  const settings = db.prepare('SELECT * FROM Settings LIMIT 1').get();
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  const { theme, emailNotifications } = req.body;
  db.prepare('UPDATE Settings SET theme = ?, emailNotifications = ? WHERE id = 1')
    .run(theme, emailNotifications ? 1 : 0);
  res.json({ success: true });
});

app.get('/api/notes/all', (req, res) => {
  const notes = db.prepare('SELECT * FROM LabNotes ORDER BY timestamp DESC').all();
  res.json(notes);
});

app.get('/api/notes/:topic', (req, res) => {
  const notes = db.prepare('SELECT * FROM LabNotes WHERE topic = ? ORDER BY timestamp DESC').all(req.params.topic);
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const { topic, hypothesis, observation } = req.body;
  db.prepare('INSERT INTO LabNotes (topic, hypothesis, observation) VALUES (?, ?, ?)')
    .run(topic, hypothesis, observation);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
