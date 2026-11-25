import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Doctor } from '../store';

const BLUE = '#2F66F5';
const LIGHT = '#CBD5FF';
const TEXT_DARK = '#1B1B1F';

interface Props {
  doctor: Doctor;
  favorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  onChat: () => void;
}

export default function DoctorCard({ doctor, favorite, onPress, onToggleFavorite, onChat }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={doctor.name}
    >
      <Image source={{ uri: doctor.photo }} style={styles.photo} />
      <View style={styles.right}>
        <View style={styles.nameBox}>
          <Text style={styles.name} numberOfLines={1}>
            {doctor.name}
          </Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
        </View>
        <View style={styles.bottom}>
          <View style={styles.pill}>
            <Ionicons name="star-outline" size={13} color={BLUE} />
            <Text style={styles.pillText}>{doctor.rating}</Text>
          </View>
          <Pressable
            style={[styles.pill, styles.gap8]}
            onPress={onChat}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Chat with ${doctor.name}`}
          >
            <Ionicons name="chatbubble-outline" size={13} color={BLUE} />
            <Text style={styles.pillText}>{doctor.reviews}</Text>
          </Pressable>
          <View style={styles.spacer} />
          <Pressable
            style={styles.circle}
            onPress={onPress}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Doctor info"
          >
            <Text style={styles.question}>?</Text>
          </Pressable>
          <Pressable
            style={[styles.circle, styles.gap6]}
            onPress={onToggleFavorite}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={14} color={BLUE} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: LIGHT,
    borderRadius: 18,
    padding: 10,
    marginBottom: 10,
  },
  pressed: { opacity: 0.85 },
  photo: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff' },
  right: { flex: 1, marginLeft: 10 },
  nameBox: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  name: { fontSize: 14, fontWeight: '700', color: BLUE },
  specialty: { fontSize: 12, color: TEXT_DARK },
  bottom: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 22,
    minWidth: 48,
    justifyContent: 'center',
  },
  pillText: { fontSize: 12, color: TEXT_DARK, marginLeft: 4 },
  spacer: { flex: 1 },
  gap8: { marginLeft: 8 },
  gap6: { marginLeft: 6 },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: { fontSize: 13, fontWeight: '600', color: BLUE },
});
