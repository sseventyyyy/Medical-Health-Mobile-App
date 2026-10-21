import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
};

const DOCTORS: Doctor[] = [
  { id: '1', name: 'Иванов Иван Иванович', specialty: 'Терапевт' },
  { id: '2', name: 'Петрова Анна Сергеевна', specialty: 'Кардиолог' },
  { id: '3', name: 'Сидоров Алексей Петрович', specialty: 'Невролог' },
];

export default function DoctorsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Врачи</Text>
      <FlatList
        data={DOCTORS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.specialty}>{item.specialty}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#f2f4f7',
  },
  name: { fontSize: 16, fontWeight: '600' },
  specialty: { fontSize: 14, color: '#555', marginTop: 4 },
});