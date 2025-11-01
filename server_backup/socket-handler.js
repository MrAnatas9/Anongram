import { db } from './database.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('🔗 Пользователь подключен:', socket.id);

    socket.on('user_join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 Пользователь ${userId} присоединился к своей комнате`);
    });

    socket.on('send_message', (data) => {
      const { senderId, receiverId, content, messageType = 'text' } = data;
      
      db.run(`INSERT INTO messages (sender_id, receiver_id, chat_type, content, message_type) 
              VALUES (?, ?, 'private', ?, ?)`, 
              [senderId, receiverId, content, messageType], 
              function(err) {
        if (err) {
          console.error('Ошибка сохранения сообщения:', err);
          return;
        }

        const messageData = {
          id: this.lastID,
          senderId,
          receiverId,
          content,
          messageType,
          timestamp: new Date().toISOString()
        };

        socket.to(`user_${receiverId}`).emit('new_message', messageData);
        socket.emit('new_message', messageData);
        
        console.log(`💬 Сообщение отправлено от ${senderId} к ${receiverId}`);
      });
    });

    socket.on('get_chat_history', (data) => {
      const { userId, otherUserId } = data;
      
      db.all(`SELECT m.*, u.username as sender_name 
              FROM messages m 
              JOIN users u ON m.sender_id = u.id 
              WHERE (m.sender_id = ? AND m.receiver_id = ?) 
                 OR (m.sender_id = ? AND m.receiver_id = ?) 
              ORDER BY m.created_at ASC`, 
              [userId, otherUserId, otherUserId, userId], 
              (err, rows) => {
        if (err) {
          console.error('Ошибка получения истории:', err);
          return;
        }
        
        socket.emit('chat_history', rows);
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ Пользователь отключен:', socket.id);
    });
  });
};
