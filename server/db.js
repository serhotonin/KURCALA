const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.db'));

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS UserStats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    totalTime INTEGER,
    modulesCompleted INTEGER,
    averageScore REAL
  );

  CREATE TABLE IF NOT EXISTS Notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    read INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS Settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    theme TEXT DEFAULT 'light',
    emailNotifications INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS LabNotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT,
    hypothesis TEXT,
    observation TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Initial Data if empty
const statsCount = db.prepare('SELECT count(*) as count FROM UserStats').get();
if (statsCount.count === 0) {
  db.prepare('INSERT INTO UserStats (totalTime, modulesCompleted, averageScore) VALUES (?, ?, ?)').run(1250, 8, 92.5);
  
  db.prepare('INSERT INTO Notifications (message) VALUES (?)').run('AETHER Laboratuvarlarına hoş geldiniz!');
  db.prepare('INSERT INTO Notifications (message) VALUES (?)').run('8. Sınıf müfredatı güncellendi.');
  db.prepare('INSERT INTO Notifications (message) VALUES (?)').run('Yeni Gemini Asistan özelliği yayına alındı.');

  db.prepare('INSERT INTO Settings (theme) VALUES (?)').run('light');
}

module.exports = db;
