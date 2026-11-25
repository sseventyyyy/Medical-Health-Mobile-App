import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileLayout from '../../profile/components/ProfileLayout';
import PrimaryButton from '../../profile/components/PrimaryButton';
import { colors } from '../../profile/theme';
import { MainNav } from '../navigation';
import { dayName, getDoctor, useApp } from '../store';

interface Props {
  nav: MainNav;
  doctorId: string;
}

export default function DoctorInfoScreen({ nav, doctorId }: Props) {
  const { favorites, toggleFavorite, appointments } = useApp();
  const doctor = getDoctor(doctorId);
  const fav = favorites.includes(doctor.id);
  const upcoming = appointments.filter((a) => a.doctorId === doctor.id && a.status === 'upcoming');

  return (
    <ProfileLayout
      title="Doctor Info"
      onBack={nav.back}
      right={
        <Pressable
          onPress={() => toggleFavorite(doctor.id)}
          hitSlop={10}
          style={styles.heart}
          accessibilityRole="button"
          accessibilityLabel={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={16} color={colors.primary} />
        </Pressable>
      }
      footer={<PrimaryButton title="Schedule" onPress={() => nav.openBooking(doctor.id)} width="100%" />}
    >
      <View style={styles.card}>
        <Image source={{ uri: doctor.photo }} style={styles.photo} />
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>

        <View style={styles.pills}>
          <View style={styles.pill}>
            <Ionicons name="star" size={13} color={colors.primary} />
            <Text style={styles.pillText}>{doctor.rating}</Text>
          </View>
          <View style={styles.pill}>
            <Ionicons name="chatbubble-ellipses-outline" size={13} color={colors.primary} />
            <Text style={styles.pillText}>{doctor.reviews}</Text>
          </View>
          <View style={styles.pill}>
            <Ionicons name="ribbon-outline" size={13} color={colors.primary} />
            <Text style={styles.pillText}>{doctor.experience} years</Text>
          </View>
        </View>

        <View style={styles.hours}>
          <Ionicons name="time-outline" size={14} color={colors.primary} />
          <Text style={styles.pillText}>{doctor.hours}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.chat, pressed && styles.pressed]}
          onPress={() => nav.openChat(doctor.id)}
          accessibilityRole="button"
        >
          <Ionicons name="chatbubble-outline" size={16} color={colors.white} />
          <Text style={styles.chatText}>Chat</Text>
        </Pressable>
      </View>

      <Text style={styles.heading}>Profile</Text>
      <Text style={styles.text}>{doctor.about}</Text>

      <Text style={styles.heading}>Your appointments</Text>
      {upcoming.length === 0 ? (
        <Text style={styles.text}>You have no upcoming visits to this doctor.</Text>
      ) : (
        upcoming.map((a) => (
          <Text key={a.id} style={styles.text}>
            {dayName(a.day)}, {a.time}
          </Text>
        ))
      )}
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  heart: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: { backgroundColor: colors.iconBg, borderRadius: 20, padding: 16, alignItems: 'center' },
  photo: { width: 110, height: 110, borderRadius: 55, backgroundColor: colors.white },
  name: { fontSize: 16, fontWeight: '700', color: colors.primary, marginTop: 10, textAlign: 'center' },
  specialty: { fontSize: 13, color: colors.text, marginTop: 2 },
  pills: { flexDirection: 'row', gap: 8, marginTop: 12 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 24,
  },
  pillText: { fontSize: 12, color: colors.text },
  hours: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 24,
    marginTop: 8,
  },
  chat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 32,
    marginTop: 12,
  },
  pressed: { opacity: 0.85 },
  chatText: { fontSize: 13, fontWeight: '600', color: colors.white },
  heading: { fontSize: 15, fontWeight: '700', color: colors.primary, marginTop: 18, marginBottom: 6 },
  text: { fontSize: 13, lineHeight: 19, color: colors.muted },
});
