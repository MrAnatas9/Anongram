export function initAuth(app) {
    window.login = async function() {
        const email = document.getElementById('emailInput').value;
        const code = document.getElementById('codeInput').value;

        if (!email || !code) {
            alert('Заполните все поля');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, accessCode: code })
            });

            const data = await response.json();

            if (data.success) {
                app.setCurrentUser(data.user);
                app.showScreen('usersScreen');
                loadUsersList();
                connectSocket();
            } else {
                alert(data.error || 'Ошибка входа');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка соединения с сервером');
        }
    };

    window.register = async function() {
        const email = document.getElementById('regEmail').value;
        const username = document.getElementById('regUsername').value;
        const code = document.getElementById('regCode').value;

        if (!email || !username || !code) {
            alert('Заполните все поля');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, accessCode: code })
            });

            const data = await response.json();

            if (data.success) {
                alert('Регистрация успешна! Теперь войдите в систему.');
                showLogin();
            } else {
                alert(data.error || 'Ошибка регистрации');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка соединения с сервером');
        }
    };

    window.showRegister = function() {
        app.showScreen('registerScreen');
    };

    window.showLogin = function() {
        app.showScreen('loginScreen');
    };

    window.logout = function() {
        app.logout();
        app.showScreen('loginScreen');
    };
}

async function loadUsersList() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        
        const currentUser = window.app.getCurrentUser();
        const usersList = document.getElementById('usersList');
        
        usersList.innerHTML = '';
        
        users.forEach(user => {
            if (user.id !== currentUser.id) {
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.onclick = () => openChat(user);
                
                userItem.innerHTML = `
                    <div class="user-info">
                        <div class="user-name">
                            ${user.username}
                            ${user.is_admin ? '<span class="admin-badge">ADMIN</span>' : ''}
                        </div>
                        <div class="user-level">Уровень ${user.level}</div>
                    </div>
                `;
                
                usersList.appendChild(userItem);
            }
        });
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
    }
}

function connectSocket() {
    const socket = io();
    window.app.setSocket(socket);

    socket.on('connect', () => {
        console.log('🔗 Подключен к серверу');
        const user = window.app.getCurrentUser();
        socket.emit('user_join', user.id);
    });

    socket.on('new_message', (message) => {
        displayMessage(message);
    });

    socket.on('chat_history', (messages) => {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        messages.forEach(message => displayMessage(message));
    });
}

function openChat(user) {
    window.app.currentChat = user;
    document.getElementById('chatWithUser').textContent = user.username;
    window.app.showScreen('chatScreen');
    
    if (window.app.socket) {
        const currentUser = window.app.getCurrentUser();
        window.app.socket.emit('get_chat_history', {
            userId: currentUser.id,
            otherUserId: user.id
        });
    }
}

function displayMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const currentUser = window.app.getCurrentUser();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sender_id === currentUser.id ? 'own' : 'other'}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = message.content;
    
    if (message.sender_id !== currentUser.id) {
        const sender = document.createElement('div');
        sender.className = 'message-sender';
        sender.textContent = message.sender_name || 'Пользователь';
        messageDiv.appendChild(sender);
    }
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
