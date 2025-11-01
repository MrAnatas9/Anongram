import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert
} from 'react-native';

interface User {
  id: number;
  username: string;
  level: number;
  is_admin: boolean;
  profession: string;
  anoncoin: number;
}

interface UsersScreenProps {
  currentUser: any;
  onOpenChat: (user: User) => void;
  onLogout: () => void;
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

const professionNames: { [key: string]: string } = {
  'artist': 'Художник',
  'photographer': 'Фотограф',
  'writer': 'Писатель',
  'meme_maker': 'Мемодел',
  'librarian': 'Библиотекарь',
  'tester': 'Тестер',
  'musician': 'Музыкант',
  'organizer': 'Организатор',
  'historian': 'Историк',
  'journalist': 'Сотрудник СМИ',
  'analyst': 'Аналитик'
};

export const UsersScreen: React.FC<UsersScreenProps> = ({ 
  currentUser, 
  onOpenChat, 
  onLogout 
}) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // TODO: Заменить на реальный API вызов
    const mockUsers: User[] = [
      { 
        id: 1, 
        username: 'SystemAdmin', 
        level: 5, 
        is_admin: true, 
        profession: null, 
        anoncoin: 1000 
      },
      { 
        id: 2, 
        username: 'UserOne', 
        level: 1, 
        is_admin: false, 
        profession: 'artist', 
        anoncoin: 100 
      },
      { 
        id: 3, 
        username: 'UserTwo', 
        level: 1, 
        is_admin: false, 
        profession: 'writer', 
        anoncoin: 150 
      },
      { 
        id: 4, 
        username: 'CreativeSoul', 
        level: 2, 
        is_admin: false, 
        profession: 'musician', 
        anoncoin: 300 
      }
    ].filter(user => user.id !== currentUser.id);

    setUsers(mockUsers);
  }, [currentUser]);

  const getProfessionDisplay = (profession: string | null) => {
    if (!profession) return null;
    
    const emoji = professionEmojis[profession] || '💼';
    const name = professionNames[profession] || profession;
    
    return `${emoji} ${name}`;
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => onOpenChat(item)}
    >
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>
            {item.username}
            {item.is_admin && <Text style={styles.adminBadge}> 👑</Text>}
          </Text>
          <Text style={styles.userLevel}>Ур. {item.level}</Text>
        </View>
        
        <View style={styles.userDetails}>
          {item.profession && (
            <Text style={styles.userProfession}>
              {getProfessionDisplay(item.profession)}
            </Text>
          )}
          <Text style={styles.userCoins}>🪙 {item.anoncoin}</Text>
        </View>
      </View>
      <Text style={styles.chatArrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Пользователи</Text>
          <Text style={styles.headerSubtitle}>
            {currentUser.profession ? 
              `${professionEmojis[currentUser.profession] || '💼'} ${professionNames[currentUser.profession]}` : 
              'Без профессии'
            } • 🪙 {currentUser.anoncoin}
          </Text>
        </View>
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logoutButton}>Выйти</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.usersList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Пока нет других пользователей</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    color: 'white',
    fontSize: 16,
  },
  usersList: {
    flex: 1,
  },
  userItem: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  adminBadge: {
    color: '#ffd700',
    fontSize: 14,
  },
  userLevel: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userProfession: {
    fontSize: 12,
    color: '#666',
  },
  userCoins: {
    fontSize: 12,
    color: '#ffd700',
    fontWeight: '500',
  },
  chatArrow: {
    fontSize: 18,
    color: '#667eea',
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});
