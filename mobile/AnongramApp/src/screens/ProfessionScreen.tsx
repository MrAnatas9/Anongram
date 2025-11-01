import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert
} from 'react-native';

interface Profession {
  id: string;
  name: string;
  description: string;
}

interface ProfessionScreenProps {
  availableProfessions: Profession[];
  currentUser: any;
  onProfessionSelected: (profession: Profession) => void;
  onSkip: () => void;
}

export const ProfessionScreen: React.FC<ProfessionScreenProps> = ({
  availableProfessions,
  currentUser,
  onProfessionSelected,
  onSkip
}) => {
  const renderProfessionItem = ({ item }: { item: Profession }) => (
    <TouchableOpacity 
      style={styles.professionItem}
      onPress={() => {
        Alert.alert(
          'Выбор профессии',
          `Вы уверены что хотите стать ${item.name}?`,
          [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Выбрать', onPress: () => onProfessionSelected(item) }
          ]
        );
      }}
    >
      <Text style={styles.professionName}>{item.name}</Text>
      <Text style={styles.professionDescription}>{item.description}</Text>
      <Text style={styles.professionLevel}>Доступно с 1 уровня</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выбор профессии</Text>
      <Text style={styles.subtitle}>
        Уровень {currentUser.level} • Выберите профессию для получения заданий
      </Text>

      <FlatList
        data={availableProfessions}
        renderItem={renderProfessionItem}
        keyExtractor={(item) => item.id}
        style={styles.professionsList}
      />

      <TouchableOpacity 
        style={styles.skipButton}
        onPress={onSkip}
      >
        <Text style={styles.skipButtonText}>Выбрать позже</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  professionsList: {
    flex: 1,
  },
  professionItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e1e5e9',
  },
  professionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  professionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  professionLevel: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  skipButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  skipButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
