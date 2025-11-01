import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// JSON "база данных"
const dataFile = './data.json';

// Система профессий по уровням
const professionsByLevel = {
  1: [ // Уровень 1
    { id: 'artist', name: '🎨 Художник', description: 'Создание стикеров и оформления' },
    { id: 'photographer', name: '📷 Фотограф', description: 'Фотоотчеты и мемы' },
    { id: 'writer', name: '✍️ Писатель', description: 'Посты и статьи' },
    { id: 'meme_maker', name: '😂 Мемодел', description: 'Развлекательный контент' },
    { id: 'librarian', name: '📚 Библиотекарь', description: 'Модерация файлов' },
    { id: 'tester', name: '🧪 Тестер', description: 'Тестирование функций' }
  ],
  2: [ // Уровень 2
    { id: 'musician', name: '🎵 Музыкант', description: 'Аудиоконтент' },
    { id: 'organizer', name: '📋 Организатор', description: 'Ивенты и мероприятия' },
    { id: 'historian', name: '📜 Историк', description: 'Архив сообщества' },
    { id: 'journalist', name: '📰 Сотрудник СМИ', description: 'Новости и репортажи' },
    { id: 'analyst', name: '📊 Аналитик', description: 'Статистика и аналитика' }
  ]
  // Можно добавить больше уровней
};

// Инициализация данных
const initData = () => {
  if (!fs.existsSync(dataFile)) {
    const initialData = {
      users: [
        { 
          id: 1, 
          username: 'SystemAdmin', 
          access_code: '654321', 
          is_admin: true, 
          level: 5, 
          anoncoin: 1000,
          profession: null,
          experience: 0,
          created_at: new Date().toISOString()
        },
        { 
          id: 2, 
          username: 'UserOne', 
          access_code: '111222', 
          is_admin: false, 
          level: 1, 
          anoncoin: 100,
          profession: null,
          experience: 0,
          created_at: new Date().toISOString()
        }
      ],
      messages: [],
      chats: [],
      assignments: [] // Система заданий
    };
    fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
    console.log('📁 JSON база данных создана');
  }
};

// Чтение данных
const readData = () => {
  return JSON.parse(fs.readFileSync(dataFile));
};

// Запись данных
const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

// Инициализируем данные
initData();

// ==================== АУТЕНТИФИКАЦИЯ ====================

app.post('/api/register', (req, res) => {
  const { username, accessCode } = req.body;
  
  const validCodes = ['111222', '333444', '555666', '654321'];
  if (!validCodes.includes(accessCode)) {
    return res.status(400).json({ error: 'Неверный код доступа' });
  }

  const data = readData();
  const existingUser = data.users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Имя пользователя уже занято' });
  }

  const isAdmin = accessCode === '654321';
  const newUser = {
    id: data.users.length + 1,
    username,
    access_code: accessCode,
    is_admin: isAdmin,
    level: 1,
    anoncoin: 100,
    profession: null,
    experience: 0,
    created_at: new Date().toISOString()
  };

  data.users.push(newUser);
  writeData(data);

  res.json({ 
    success: true, 
    message: 'Пользователь создан',
    user: {
      id: newUser.id,
      username: newUser.username,
      level: newUser.level,
      anoncoin: newUser.anoncoin,
      isAdmin: newUser.is_admin,
      profession: newUser.profession
    }
  });
});

app.post('/api/login', (req, res) => {
  const { username, accessCode } = req.body;
  
  const data = readData();
  const user = data.users.find(u => u.username === username && u.access_code === accessCode);
  
  if (!user) {
    return res.status(400).json({ error: 'Неверное имя пользователя или код доступа' });
  }
  
  // Получаем доступные профессии для уровня пользователя
  const availableProfessions = professionsByLevel[user.level] || [];
  
  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      level: user.level,
      anoncoin: user.anoncoin,
      isAdmin: user.is_admin,
      profession: user.profession,
      experience: user.experience
    },
    availableProfessions
  });
});

// ==================== ПРОФЕССИИ ====================

app.get('/api/professions/:level', (req, res) => {
  const level = parseInt(req.params.level);
  const professions = professionsByLevel[level] || [];
  res.json(professions);
});

app.post('/api/select-profession', (req, res) => {
  const { userId, professionId } = req.body;
  
  const data = readData();
  const user = data.users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(400).json({ error: 'Пользователь не найден' });
  }

  // Проверяем что профессия доступна для уровня пользователя
  const availableProfessions = professionsByLevel[user.level] || [];
  const profession = availableProfessions.find(p => p.id === professionId);
  
  if (!profession) {
    return res.status(400).json({ error: 'Профессия не доступна для вашего уровня' });
  }

  user.profession = professionId;
  writeData(data);

  res.json({
    success: true,
    message: `Профессия "${profession.name}" выбрана!`,
    profession: profession
  });
});

// ==================== ПОЛЬЗОВАТЕЛИ ====================

app.get('/api/users', (req, res) => {
  const data = readData();
  const users = data.users.map(user => ({
    id: user.id,
    username: user.username,
    level: user.level,
    is_admin: user.is_admin,
    profession: user.profession,
    anoncoin: user.anoncoin
  }));
  res.json(users);
});

// ==================== WebSocket ЧАТ ====================

io.on('connection', (socket) => {
  console.log('🔗 Пользователь подключен:', socket.id);

  socket.on('user_join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 Пользователь ${userId} присоединился`);
  });

  socket.on('send_message', (data) => {
    const { senderId, receiverId, content, messageType = 'text' } = data;
    
    const dataStore = readData();
    
    // Находим отправителя
    const sender = dataStore.users.find(u => u.id === senderId);
    if (!sender) return;

    const newMessage = {
      id: dataStore.messages.length + 1,
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      message_type: messageType,
      sender_name: sender.username,
      sender_profession: sender.profession,
      created_at: new Date().toISOString()
    };

    dataStore.messages.push(newMessage);
    writeData(dataStore);

    // Отправляем сообщение получателю и отправителю
    socket.to(`user_${receiverId}`).emit('new_message', newMessage);
    socket.emit('new_message', newMessage);
    
    console.log(`💬 Сообщение от ${sender.username} к ${receiverId}`);
  });

  socket.on('get_chat_history', (data) => {
    const { userId, otherUserId } = data;
    
    const dataStore = readData();
    const messages = dataStore.messages.filter(msg =>
      (msg.sender_id === userId && msg.receiver_id === otherUserId) ||
      (msg.sender_id === otherUserId && msg.receiver_id === userId)
    ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    socket.emit('chat_history', messages);
  });

  socket.on('disconnect', () => {
    console.log('❌ Пользователь отключен:', socket.id);
  });
});

// Главный маршрут
app.get('/', (req, res) => {
  res.json({ 
    message: 'Anongram Server API', 
    version: '1.0',
    features: ['Аутентификация по коду', 'Система профессий', 'Чат', 'Экономика Anoncoin']
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Anongram сервер запущен на порту ${PORT}`);
  console.log(`📱 API доступен по: http://localhost:${PORT}`);
  console.log(`💼 Система профессий: ${Object.keys(professionsByLevel).length} уровней`);
  console.log(`👥 Пользователей: ${readData().users.length}`);
});
