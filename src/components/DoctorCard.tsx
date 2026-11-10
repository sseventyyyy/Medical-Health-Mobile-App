// components/DoctorCard.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Doctor } from '../types/doctor';

interface Props {
  doctor: Doctor;
  onPress: (doctor: Doctor) => void;
}

export default function DoctorCard({ doctor, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(doctor)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{doctor.fullName.charAt(0)}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{doctor.fullName}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <Text style={styles.meta}>
          Стаж {doctor.experienceYears} лет · ★ {doctor.rating.toFixed(1)}
        </Text>
        <Text style={styles.meta}>{doctor.clinic}</Text>
      </View>

      <Text style={styles.price}>{doctor.price} ₸</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pressed: { opacity: 0.85 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#2F6BFF' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#111827' },
  specialty: { fontSize: 14, color: '#2F6BFF', marginBottom: 2 },
  meta: { fontSize: 12, color: '#6B7280' },
  price: { fontSize: 14, fontWeight: '600', color: '#111827' },
});
