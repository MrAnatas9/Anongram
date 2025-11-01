import { initAuth } from './auth.js';
import { initChat } from './chat.js';
import { initUI } from './ui.js';

class AnongramApp {
    constructor() {
        this.socket = null;
        this.currentUser = null;
        this.currentChat = null;
        this.init();
    }

    async init() {
        initAuth(this);
        initChat(this);
        initUI(this);
        console.log('🚀 Anongram приложение инициализировано');
    }

    setSocket(socket) {
        this.socket = socket;
    }

    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
        this.currentChat = null;
        localStorage.removeItem('currentUser');
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
}

window.app = new AnongramApp();
