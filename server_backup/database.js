import sqlite3 from 'sqlite3';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const db = new sqlite3.Database('./anongram.db');

export const initDatabase = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      username TEXT,
      password TEXT,
      level INTEGER DEFAULT 1,
      experience INTEGER DEFAULT 0,
      anoncoin INTEGER DEFAULT 0,
      is_premium INTEGER DEFAULT 0,
      access_code TEXT,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER,
      receiver_id INTEGER,
      chat_type TEXT DEFAULT 'private',
      content TEXT,
      message_type TEXT DEFAULT 'text',
      is_edited INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(sender_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT DEFAULT 'private',
      creator_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS chat_participants (
      chat_id INTEGER,
      user_id INTEGER,
      role TEXT DEFAULT 'member',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(chat_id) REFERENCES chats(id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      PRIMARY KEY (chat_id, user_id)
    )`);

    db.get("SELECT * FROM users WHERE is_admin = 1", (err, row) => {
      if (!row) {
        db.run(`INSERT INTO users (email, username, password, is_admin, access_code) 
                VALUES (?, ?, ?, ?, ?)`, 
                ['admin@anongram.com', 'SystemAdmin', 'admin123', 1, '654321']);
        console.log('👑 Администратор создан');
      }
    });

    const testUsers = [
      { email: 'user1@test.com', username: 'UserOne', code: '111222' },
      { email: 'user2@test.com', username: 'UserTwo', code: '333444' },
      { email: 'user3@test.com', username: 'UserThree', code: '555666' }
    ];

    testUsers.forEach(user => {
      db.get("SELECT * FROM users WHERE email = ?", [user.email], (err, row) => {
        if (!row) {
          db.run(`INSERT INTO users (email, username, password, access_code) 
                  VALUES (?, ?, ?, ?)`, 
                  [user.email, user.username, 'user123', user.code]);
        }
      });
    });

    console.log('✅ База данных инициализирована');
  });
};
