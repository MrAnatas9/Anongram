import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';

interface LoginScreenProps {
  onLogin: (user: any, professions: any[]) => void;
  onShowRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onShowRegister }) => {
  const [username, setUsername] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !accessCode) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      // TODO: Заменить на реальный API вызов к нашему серверу
      // Пока используем тестовые данные
      if (username === 'SystemAdmin' && accessCode === '654321') {
        onLogin({
          id: 1,
          username: 'SystemAdmin',
          level: 5,
          anoncoin: 1000,
          isAdmin: true,
          profession: null
        }, []);
      } else if (username === 'UserOne' && accessCode === '111222') {
        onLogin({
          id: 2,
          username: 'UserOne', 
          level: 1,
          anoncoin: 100,
          isAdmin: false,
          profession: null
        }, [
          { id: 'artist', name: '🎨 Художник', description: 'Создание стикеров и оформления' },
          { id: 'photographer', name: '📷 Фотограф', description: 'Фотоотчеты и мемы' },
          { id: 'writer', name: '✍️ Писатель', description: 'Посты и статьи' },
          { id: 'meme_maker', name: '😂 Мемодел', description: 'Развлекательный контент' }
        ]);
      } else {
        Alert.alert('Ошибка', 'Неверное имя пользователя или код доступа');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Anongram</Text>
      <Text style={styles.tagline}>Безопасность•Анонимность•Удобство</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Имя пользователя</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите ваш ник"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Код доступа</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите код доступа"
          value={accessCode}
          onChangeText={setAccessCode}
          secureTextEntry
          maxLength={6}
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Войти</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={onShowRegister}
      >
        <Text style={styles.secondaryButtonText}>Регистрация</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
