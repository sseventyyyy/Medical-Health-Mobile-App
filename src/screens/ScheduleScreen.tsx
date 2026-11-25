import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileLayout from '../../profile/components/ProfileLayout';
import BottomTabBar from '../../profile/components/BottomTabBar';
import { colors } from '../../profile/theme';
import { MainNav } from '../navigation';
import { AppointmentStatus, dayName, getDoctor, useApp } from '../store';

const TABS: { key: AppointmentStatus; label: string }[] = [
  { key: 'complete', label: 'Complete' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'cancelled', label: 'Cancelled' },
];

/** Вкладка Calendar: все записи пользователя по статусам. */
export default function ScheduleScreen({ nav }: { nav: MainNav }) {
  const { appointments, setAppointmentStatus } = useApp();
  const [tab, setTab] = useState<AppointmentStatus>('upcoming');

  const list = appointments
    .filter((a) => a.status === tab)
    .sort((a, b) => a.day - b.day);

  const confirmCancel = (id: string, doctorName: string) =>
    Alert.alert('Cancel appointment', `Cancel your visit to ${doctorName}?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, cancel', style: 'destructive', onPress: () => setAppointmentStatus(id, 'cancelled') },
    ]);

  return (
    <ProfileLayout
      title="All Appointment"
      onBack={nav.back}
      right={
        <Pressable
          onPress={() => nav.openDoctors(false)}
          hitSlop={10}
          style={styles.add}
          accessibilityRole="button"
          accessibilityLabel="Book new appointment"
        >
          <Ionicons name="add" size={18} color={colors.white} />
        </Pressable>
      }
      footer={<BottomTabBar active="calendar" onPress={nav.openTab} />}
    >
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setTab(t.key)}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: tab === t.key }}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      {list.length === 0 ? <Text style={styles.empty}>No appointments here yet</Text> : null}

      {list.map((a) => {
        const doctor = getDoctor(a.doctorId);
        return (
          <View key={a.id} style={styles.card}>
            <Pressable style={styles.top} onPress={() => nav.openDoctor(doctor.id)}>
              <Image source={{ uri: doctor.photo }} style={styles.photo} />
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {doctor.name}
                </Text>
                <Text style={styles.specialty}>{doctor.specialty}</Text>
              </View>
            </Pressable>

            <View style={styles.when}>
              <View style={styles.pill}>
                <Ionicons name="calendar-outline" size={13} color={colors.primary} />
                <Text style={styles.pillText}>{dayName(a.day)}</Text>
              </View>
              <View style={styles.pill}>
                <Ionicons name="time-outline" size={13} color={colors.primary} />
                <Text style={styles.pillText}>{a.time}</Text>
              </View>
            </View>
            <Text style={styles.note}>{a.note}</Text>

            <View style={styles.actions}>
              {a.status === 'upcoming' ? (
                <>
                  <Pressable style={styles.main} onPress={() => nav.openChat(doctor.id)}>
                    <Text style={styles.mainText}>Chat</Text>
                  </Pressable>
                  <Pressable
                    style={styles.round}
                    onPress={() => setAppointmentStatus(a.id, 'complete')}
                    accessibilityRole="button"
                    accessibilityLabel="Mark as completed"
                  >
                    <Ionicons name="checkmark" size={18} color={colors.primary} />
                  </Pressable>
                  <Pressable
                    style={styles.round}
                    onPress={() => confirmCancel(a.id, doctor.name)}
                    accessibilityRole="button"
                    accessibilityLabel="Cancel appointment"
                  >
                    <Ionicons name="close" size={18} color={colors.primary} />
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable style={styles.main} onPress={() => nav.openBooking(doctor.id)}>
                    <Text style={styles.mainText}>Re-Book</Text>
                  </Pressable>
                  {a.status === 'cancelled' ? (
                    <Pressable
                      style={[styles.main, styles.secondary]}
                      onPress={() => setAppointmentStatus(a.id, 'upcoming')}
                    >
                      <Text style={[styles.mainText, styles.secondaryText]}>Restore</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={[styles.main, styles.secondary]}
                      onPress={() => nav.openChat(doctor.id)}
                    >
                      <Text style={[styles.mainText, styles.secondaryText]}>Chat</Text>
                    </Pressable>
                  )}
                </>
              )}
            </View>
          </View>
        );
      })}
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  add: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  tabTextActive: { color: colors.white },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 24 },

  card: { backgroundColor: colors.iconBg, borderRadius: 18, padding: 12, marginBottom: 12 },
  top: { flexDirection: 'row', alignItems: 'center' },
  photo: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.white },
  info: { flex: 1, marginLeft: 10 },
  name: { fontSize: 14, fontWeight: '700', color: colors.primary },
  specialty: { fontSize: 12, color: colors.text },
  when: { flexDirection: 'row', gap: 8, marginTop: 10 },
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
  note: { fontSize: 12, color: colors.muted, marginTop: 8 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  main: {
    flex: 1,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: { fontSize: 13, fontWeight: '600', color: colors.white },
  secondary: { backgroundColor: colors.white },
  secondaryText: { color: colors.primary },
  round: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
