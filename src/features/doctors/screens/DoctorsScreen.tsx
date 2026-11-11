import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import DoctorCard from '../components/DoctorCard';
import { DOCTORS } from '../data/doctors';
import { Doctor } from '../../../shared/types/doctor';

export default function DoctorsScreen() {
  const handlePress = (doctor: Doctor) => {
    console.log('Selected doctor:', doctor.fullName);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Врачи</Text>

      <FlatList
        data={DOCTORS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <DoctorCard doctor={item} onPress={handlePress} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
    backgroundColor: '#F5F7FB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 24,
  },
});
