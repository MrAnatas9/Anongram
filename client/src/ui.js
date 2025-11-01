export function initUI(app) {
    window.displayMessage = function(message) {
        const chatMessages = document.getElementById('chatMessages');
        const currentUser = app.getCurrentUser();
        
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
    };
}
