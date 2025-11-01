import { db } from './database.js';
import bcrypt from 'bcryptjs';

export const setupAuthRoutes = (app) => {
  
  app.post('/api/register', (req, res) => {
    const { email, username, accessCode } = req.body;
    
    const validCodes = ['111222', '333444', '555666', '654321'];
    if (!validCodes.includes(accessCode)) {
      return res.status(400).json({ error: 'Неверный код доступа' });
    }

    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], (err, row) => {
      if (row) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
      }

      const isAdmin = accessCode === '654321';
      
      db.run(`INSERT INTO users (email, username, password, access_code, is_admin) 
              VALUES (?, ?, ?, ?, ?)`, 
              [email, username, 'default123', accessCode, isAdmin ? 1 : 0], 
              function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        res.json({ 
          success: true, 
          message: 'Пользователь создан',
          userId: this.lastID,
          isAdmin: isAdmin
        });
      });
    });
  });

  app.post('/api/login', (req, res) => {
    const { email, accessCode } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ? AND access_code = ?', [email, accessCode], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!row) {
        return res.status(400).json({ error: 'Неверный email или код доступа' });
      }
      
      res.json({
        success: true,
        user: {
          id: row.id,
          username: row.username,
          email: row.email,
          level: row.level,
          anoncoin: row.anoncoin,
          isAdmin: row.is_admin
        }
      });
    });
  });

  app.get('/api/users', (req, res) => {
    db.all('SELECT id, username, level, is_admin FROM users', (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });
};
