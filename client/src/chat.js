export function initChat(app) {
    window.sendMessage = function() {
        const input = document.getElementById('messageInput');
        const content = input.value.trim();
        
        if (!content || !app.currentChat || !app.socket) return;
        
        const currentUser = app.getCurrentUser();
        
        app.socket.emit('send_message', {
            senderId: currentUser.id,
            receiverId: app.currentChat.id,
            content: content,
            messageType: 'text'
        });
        
        input.value = '';
    };

    window.showUsers = function() {
        app.showScreen('usersScreen');
    };

    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}
