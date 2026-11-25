import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileLayout from '../../profile/components/ProfileLayout';
import BottomTabBar from '../../profile/components/BottomTabBar';
import { colors } from '../../profile/theme';
import DoctorCard from '../components/DoctorCard';
import { MainNav } from '../navigation';
import { dateLabel, getDoctor, paymentLabel, useApp, weekday } from '../store';

interface Props {
  nav: MainNav;
  appointmentId: string;
}

const STATUS_LABEL = { upcoming: 'Upcoming', complete: 'Complete', cancelled: 'Cancelled' };

export default function AppointmentScreen({ nav, appointmentId }: Props) {
  const { appointments, favorites, toggleFavorite, setAppointmentStatus, cards, user } = useApp();
  const a = appointments.find((x) => x.id === appointmentId);

  if (!a) {
    return (
      <ProfileLayout title="Your Appointment" onBack={nav.back}>
        <Text style={styles.text}>This appointment no longer exists.</Text>
      </ProfileLayout>
    );
  }

  const doctor = getDoctor(a.doctorId);
  const rows: [string, string][] = [
    ['Booking For', a.patient?.forWho === 'another' ? 'Another Person' : 'Yourself'],
    ['Full Name', a.patient?.fullName ?? user.name],
  ];
  if (a.patient) rows.push(['Age', a.patient.age], ['Gender', a.patient.gender]);
  if (a.paidWith) rows.push(['Payment Method', paymentLabel(a.paidWith, cards)]);
  rows.push(['Status', STATUS_LABEL[a.status]]);

  return (
    <ProfileLayout
      title="Your Appointment"
      onBack={nav.back}
      footer={<BottomTabBar active="calendar" onPress={nav.openTab} />}
    >
      <DoctorCard
        doctor={doctor}
        favorite={favorites.includes(doctor.id)}
        onPress={() => nav.openDoctor(doctor.id)}
        onToggleFavorite={() => toggleFavorite(doctor.id)}
        onChat={() => nav.openChat(doctor.id)}
      />

      <View style={styles.divider} />

      <View style={styles.whenRow}>
        <View style={styles.when}>
          <View style={styles.datePill}>
            <Text style={styles.dateText}>{dateLabel(a.day)}</Text>
          </View>
          <Text style={styles.time}>
            {weekday(a.day).label}, {a.time}
          </Text>
        </View>
        {a.status === 'upcoming' ? (
          <>
            <Pressable
              style={styles.round}
              onPress={() => setAppointmentStatus(a.id, 'complete')}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Mark as completed"
            >
              <Ionicons name="checkmark" size={18} color={colors.white} />
            </Pressable>
            <Pressable
              style={styles.round}
              onPress={() => nav.openCancel(a.id)}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Cancel appointment"
            >
              <Ionicons name="close" size={18} color={colors.white} />
            </Pressable>
          </>
        ) : null}
      </View>

      <View style={styles.divider} />

      {rows.map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowValue} numberOfLines={1}>
            {value}
          </Text>
        </View>
      ))}

      <View style={styles.divider} />

      <Text style={styles.rowLabel}>Problem</Text>
      <Text style={styles.text}>{a.note}</Text>

      {a.status === 'cancelled' && a.cancelReason ? (
        <>
          <Text style={[styles.rowLabel, styles.gap]}>Cancellation reason</Text>
          <Text style={styles.text}>{a.cancelReason}</Text>
        </>
      ) : null}

      {a.status !== 'upcoming' ? (
        <Pressable
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
          onPress={() => nav.openReview(a.id)}
          accessibilityRole="button"
        >
          <Text style={styles.actionText}>{a.review ? 'Edit Review' : 'Add Review'}</Text>
        </Pressable>
      ) : null}
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  divider: { height: 1, backgroundColor: colors.primary, opacity: 0.5, marginVertical: 16 },
  whenRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  when: { flex: 1, alignItems: 'flex-start' },
  datePill: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 28,
    justifyContent: 'center',
  },
  dateText: { fontSize: 13, fontWeight: '600', color: colors.white },
  time: { fontSize: 12, fontWeight: '600', color: colors.primary, marginTop: 6, marginLeft: 4 },
  round: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 10 },
  rowLabel: { fontSize: 13, color: colors.muted },
  rowValue: { flexShrink: 1, fontSize: 13, fontWeight: '700', color: colors.text },
  text: { fontSize: 13, lineHeight: 19, color: colors.text, marginTop: 6 },
  gap: { marginTop: 16 },
  action: {
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  pressed: { opacity: 0.85 },
  actionText: { fontSize: 14, fontWeight: '600', color: colors.white },
});
