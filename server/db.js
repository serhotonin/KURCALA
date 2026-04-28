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

  CREATE TABLE IF NOT EXISTS ModuleProgress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grade INTEGER,
    topic TEXT,
    completed INTEGER DEFAULT 0,
    score REAL DEFAULT 0,
    lastAttempt DATETIME DEFAULT CURRENT_TIMESTAMP
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

// Migration: Add activeDays to UserStats if missing
try {
  db.prepare('SELECT activeDays FROM UserStats LIMIT 1').get();
} catch (e) {
  if (e.message.includes('no such column')) {
    db.exec('ALTER TABLE UserStats ADD COLUMN activeDays INTEGER DEFAULT 1');
  }
}

// Seed Initial Data if empty
const statsCount = db.prepare('SELECT count(*) as count FROM UserStats').get();
if (statsCount.count === 0) {
  db.prepare('INSERT INTO UserStats (totalTime, modulesCompleted, averageScore, activeDays) VALUES (?, ?, ?, ?)').run(1250, 8, 92.5, 12);
  
  // Seed some progress
  const initialProgress = [
    { grade: 5, topic: "Sürtünme Kuvveti (Buzul Gezegeni)", completed: 1, score: 85 },
    { grade: 6, topic: "Güneş Sistemi (Yörünge İstasyonu)", completed: 1, score: 100 },
    { grade: 7, topic: "Karışımlar (Simyacı İksiri)", completed: 0, score: 45 },
    { grade: 8, topic: "Sıvı Basıncı (Baraj Çatlağı)", completed: 0, score: 10 }
  ];

  const insertProgress = db.prepare('INSERT INTO ModuleProgress (grade, topic, completed, score) VALUES (?, ?, ?, ?)');
  initialProgress.forEach(p => insertProgress.run(p.grade, p.topic, p.completed, p.score));

  db.prepare('INSERT INTO Notifications (message) VALUES (?)').run('KURCALA Laboratuvarlarına hoş geldiniz!');
  db.prepare('INSERT INTO Notifications (message) VALUES (?)').run('8. Sınıf müfredatı güncellendi.');

  db.prepare('INSERT INTO Settings (theme) VALUES (?)').run('light');
} else {
    // If table existed but was empty of progress, seed it
    const progressCount = db.prepare('SELECT count(*) as count FROM ModuleProgress').get();
    if (progressCount.count === 0) {
        const initialProgress = [
            { grade: 5, topic: "Sürtünme Kuvveti (Buzul Gezegeni)", completed: 1, score: 85 },
            { grade: 6, topic: "Güneş Sistemi (Yörünge İstasyonu)", completed: 1, score: 100 },
            { grade: 7, topic: "Karışımlar (Simyacı İksiri)", completed: 0, score: 45 },
            { grade: 8, topic: "Sıvı Basıncı (Baraj Çatlağı)", completed: 0, score: 10 }
          ];
        
          const insertProgress = db.prepare('INSERT INTO ModuleProgress (grade, topic, completed, score) VALUES (?, ?, ?, ?)');
          initialProgress.forEach(p => insertProgress.run(p.grade, p.topic, p.completed, p.score));
    }
}

module.exports = db;
