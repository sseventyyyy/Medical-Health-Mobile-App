import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Doctor } from '../../../shared/types/doctor';

interface Props {
  doctor: Doctor;
  onPress: (doctor: Doctor) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (doctorId: string) => void;
}

export default function DoctorCard({
  doctor,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(doctor)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{doctor.fullName.charAt(0)}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {doctor.fullName}
          </Text>
          {onToggleFavorite && (
            <Pressable
              hitSlop={8}
              onPress={(e) => {
                e.stopPropagation();
                onToggleFavorite(doctor.id);
              }}
              style={styles.heartBtn}
            >
              <Text style={[styles.heartText, isFavorite && styles.heartActive]}>
                {isFavorite ? '♥' : '♡'}
              </Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <Text style={styles.meta}>
          Стаж {doctor.experienceYears} лет · ★ {doctor.rating.toFixed(1)}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {doctor.clinic}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{doctor.price.toLocaleString('ru-RU')} ₸</Text>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>Подробнее</Text>
          </View>
        </View>
      </View>
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
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2F6BFF',
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  heartBtn: {
    paddingHorizontal: 4,
  },
  heartText: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  heartActive: {
    color: '#2F6BFF',
  },
  specialty: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2F6BFF',
    marginTop: 2,
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  infoBadge: {
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  infoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2F6BFF',
  },
});