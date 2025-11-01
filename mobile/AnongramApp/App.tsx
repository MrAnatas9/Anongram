import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ProfessionScreen } from './src/screens/ProfessionScreen';
import { UsersScreen } from './src/screens/UsersScreen';
import { ChatScreen } from './src/screens/ChatScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Profession: undefined;
  Users: undefined;
  Chat: { user: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentChatUser, setCurrentChatUser] = useState<any>(null);
  const [availableProfessions, setAvailableProfessions] = useState<any[]>([]);

  const handleLogin = (user: any, professions: any[] = []) => {
    setCurrentUser(user);
    setAvailableProfessions(professions);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentChatUser(null);
    setAvailableProfessions([]);
  };

  const handleProfessionSelected = (profession: any) => {
    setCurrentUser({
      ...currentUser,
      profession: profession.id
    });
    // TODO: Отправить на сервер выбор профессии
  };

  const shouldShowProfessionScreen = currentUser && 
    !currentUser.profession && 
    availableProfessions.length > 0;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!currentUser ? (
          // Экраны аутентификации
          <>
            <Stack.Screen 
              name="Login" 
              options={{ headerShown: false }}
            >
              {(props) => (
                <LoginScreen
                  {...props}
                  onLogin={handleLogin}
                  onShowRegister={() => props.navigation.navigate('Register')}
                />
              )}
            </Stack.Screen>
            <Stack.Screen 
              name="Register" 
              options={{ headerShown: false }}
            >
              {(props) => (
                <RegisterScreen
                  {...props}
                  onRegister={handleLogin}
                  onShowLogin={() => props.navigation.navigate('Login')}
                />
              )}
            </Stack.Screen>
          </>
        ) : shouldShowProfessionScreen ? (
          // Экран выбора профессии
          <Stack.Screen 
            name="Profession" 
            options={{ headerShown: false }}
          >
            {(props) => (
              <ProfessionScreen
                {...props}
                availableProfessions={availableProfessions}
                currentUser={currentUser}
                onProfessionSelected={handleProfessionSelected}
                onSkip={() => setAvailableProfessions([])}
              />
            )}
          </Stack.Screen>
        ) : !currentChatUser ? (
          // Экран списка пользователей
          <Stack.Screen 
            name="Users" 
            options={{ headerShown: false }}
          >
            {(props) => (
              <UsersScreen
                {...props}
                currentUser={currentUser}
                onOpenChat={(user) => setCurrentChatUser(user)}
                onLogout={handleLogout}
              />
            )}
          </Stack.Screen>
        ) : (
          // Экран чата
          <Stack.Screen 
            name="Chat" 
            options={{ headerShown: false }}
          >
            {(props) => (
              <ChatScreen
                {...props}
                currentUser={currentUser}
                chatUser={currentChatUser}
                onBack={() => setCurrentChatUser(null)}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
