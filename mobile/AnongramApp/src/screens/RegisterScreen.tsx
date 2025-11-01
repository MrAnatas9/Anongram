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

interface RegisterScreenProps {
  onRegister: (user: any) => void;
  onShowLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onShowLogin }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !username || !accessCode) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    const validCodes = ['111222', '333444', '555666', '654321'];
    if (!validCodes.includes(accessCode)) {
      Alert.alert('Ошибка', 'Неверный код доступа');
      return;
    }

    setLoading(true);
    try {
      // TODO: Заменить на реальный API вызов
      const isAdmin = accessCode === '654321';
      const newUser = {
        id: Math.floor(Math.random() * 1000) + 10,
        username,
        email,
        level: 1,
        anoncoin: 100,
        isAdmin
      };
      
      Alert.alert('Успех', 'Регистрация завершена! Теперь войдите в систему.');
      onShowLogin();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось зарегистрироваться');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Регистрация</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Почта</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите вашу почту"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

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
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Зарегистрироваться</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={onShowLogin}
      >
        <Text style={styles.secondaryButtonText}>Назад к входу</Text>
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
