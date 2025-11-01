import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  message_type: string;
  timestamp: string;
  sender_name?: string;
  sender_profession?: string;
}

interface ChatScreenProps {
  currentUser: any;
  chatUser: any;
  onBack: () => void;
}

// Маппинг профессий для отображения
const professionEmojis: { [key: string]: string } = {
  'artist': '🎨',
  'photographer': '📷',
  'writer': '✍️',
  'meme_maker': '😂',
  'librarian': '📚',
  'tester': '🧪',
  'musician': '🎵',
  'organizer': '📋',
  'historian': '📜',
  'journalist': '📰',
  'analyst': '📊'
};

export const ChatScreen: React.FC<ChatScreenProps> = ({ 
  currentUser, 
  chatUser, 
  onBack 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // TODO: Заменить на реальные сообщения из API
    const mockMessages: Message[] = [
      {
        id: 1,
        sender_id: chatUser.id,
        receiver_id: currentUser.id,
        content: 'Привет! Как дела?',
        message_type: 'text',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        sender_name: chatUser.username,
        sender_profession: chatUser.profession
      },
      {
        id: 2,
        sender_id: currentUser.id,
        receiver_id: chatUser.id,
        content: 'Привет! Все отлично, а у тебя?',
        message_type: 'text',
        timestamp: new Date(Date.now() - 240000).toISOString(),
      },
      {
        id: 3,
        sender_id: chatUser.id,
        receiver_id: currentUser.id,
        content: 'Тоже хорошо! Недавно начал работать над новым проектом.',
        message_type: 'text',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        sender_name: chatUser.username,
        sender_profession: chatUser.profession
      },
      {
        id: 4,
        sender_id: currentUser.id,
        receiver_id: chatUser.id,
        content: 'Здорово! Расскажешь подробнее?',
        message_type: 'text',
        timestamp: new Date(Date.now() - 120000).toISOString(),
      }
    ];
    setMessages(mockMessages);
  }, [currentUser, chatUser]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      sender_id: currentUser.id,
      receiver_id: chatUser.id,
      content: newMessage,
      message_type: 'text',
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    
    // TODO: Отправить сообщение на сервер через WebSocket
  };

  const getProfessionEmoji = (profession: string | null) => {
    if (!profession) return '';
    return professionEmojis[profession] || '💼';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender_id === currentUser.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        {!isOwnMessage && (
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>
              {item.sender_name}
              {item.sender_profession && (
                <Text style={styles.professionEmoji}>
                  {' '}{getProfessionEmoji(item.sender_profession)}
                </Text>
              )}
            </Text>
            <Text style={styles.messageTime}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble
        ]}>
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
        </View>
        {isOwnMessage && (
          <Text style={styles.ownMessageTime}>
            {formatTime(item.timestamp)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Назад</Text>
        </TouchableOpacity>
        <View style={styles.chatInfo}>
          <Text style={styles.chatTitle}>{chatUser.username}</Text>
          <Text style={styles.chatSubtitle}>
            {chatUser.profession ? 
              `${getProfessionEmoji(chatUser.profession)} ${chatUser.profession}` : 
              'Без профессии'
            } • Ур. {chatUser.level}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Введите сообщение..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.sendButtonDisabled
          ]} 
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  chatInfo: {
    flex: 1,
    alignItems: 'center',
  },
  chatTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  chatSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  placeholder: {
    width: 60,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginLeft: 10,
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginRight: 8,
  },
  professionEmoji: {
    fontSize: 10,
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
  },
  ownMessageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  ownBubble: {
    backgroundColor: '#667eea',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#667eea',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
