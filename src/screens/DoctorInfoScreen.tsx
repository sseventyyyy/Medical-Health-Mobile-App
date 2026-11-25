import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileLayout from '../../profile/components/ProfileLayout';
import PrimaryButton from '../../profile/components/PrimaryButton';
import { colors } from '../../profile/theme';
import CallModal, { formatSeconds } from '../components/CallModal';
import { MainNav } from '../navigation';
import {
  MONTH,
  TODAY,
  WEEKDAY_LABELS,
  getDoctor,
  isBookableDay,
  timeNow,
  useApp,
  weekdayIndex,
} from '../store';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  nav: MainNav;
  doctorId: string;
}

const MONTH_CELLS: (number | null)[] = [
  ...Array.from({ length: weekdayIndex(1) }, () => null),
  ...Array.from({ length: MONTH.days }, (_, i) => i + 1),
];

export default function DoctorInfoScreen({ nav, doctorId }: Props) {
  const { favorites, toggleFavorite, appointments, addMessage } = useApp();
  const doctor = getDoctor(doctorId);
  const fav = favorites.includes(doctor.id);
  const [call, setCall] = useState<'audio' | 'video' | null>(null);

  const visitDays = new Set(
    appointments.filter((a) => a.doctorId === doctor.id && a.status === 'upcoming').map((a) => a.day),
  );

  const endCall = (seconds: number) => {
    const kind = call === 'video' ? 'Video call' : 'Audio call';
    setCall(null);
    addMessage(doctor.id, {
      id: `me-${Date.now()}`,
      from: 'me',
      time: timeNow(),
      text: seconds > 0 ? `${kind} · ${formatSeconds(seconds)}` : `${kind} · cancelled`,
    });
  };

  const action = (icon: IconName, label: string, onPress: () => void) => (
    <Pressable
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      onPress={onPress}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={16} color={colors.primary} />
    </Pressable>
  );

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

        <View style={styles.actions}>
          {action('call-outline', 'Audio call', () => setCall('audio'))}
          {action('videocam-outline', 'Video call', () => setCall('video'))}
          {action('chatbubble-outline', 'Chat', () => nav.openChat(doctor.id))}
        </View>
      </View>

      <Text style={styles.heading}>Profile</Text>
      <Text style={styles.text}>{doctor.about}</Text>

      <View style={styles.band}>
        <Text style={styles.month}>
          {MONTH.name} {MONTH.year}
        </Text>
        <View style={styles.grid}>
          {WEEKDAY_LABELS.map((label) => (
            <View key={label} style={styles.cell}>
              <View style={styles.weekday}>
                <Text style={styles.weekdayText}>{label}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={[styles.grid, styles.days]}>
          {MONTH_CELLS.map((num, i) => {
            if (num === null) return <View key={`gap-${i}`} style={styles.cell} />;
            const bookable = isBookableDay(num);
            const visit = visitDays.has(num);
            return (
              <View key={num} style={styles.cell}>
                <Pressable
                  onPress={() => nav.openBooking(doctor.id, num)}
                  disabled={!bookable}
                  style={[styles.dayBtn, visit && styles.dayVisit, num === TODAY && !visit && styles.dayToday]}
                  accessibilityRole="button"
                  accessibilityLabel={`Book on ${MONTH.name} ${num}${visit ? ', you have a visit' : ''}`}
                  accessibilityState={{ disabled: !bookable }}
                >
                  <Text style={[styles.dayText, !bookable && styles.dayOff, visit && styles.dayVisitText]}>
                    {num}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
        <Text style={styles.legend}>Tap a day to book. Filled days are your visits to this doctor.</Text>
      </View>

      <CallModal
        visible={call !== null}
        video={call === 'video'}
        name={doctor.name.split(',')[0]}
        avatar={doctor.photo}
        onEnd={endCall}
      />
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
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  action: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  heading: { fontSize: 15, fontWeight: '700', color: colors.primary, marginTop: 18, marginBottom: 6 },
  text: { fontSize: 13, lineHeight: 19, color: colors.muted },

  band: {
    backgroundColor: colors.iconBg,
    marginHorizontal: -24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: -24,
  },
  month: { fontSize: 14, fontWeight: '700', color: colors.primary, textAlign: 'center', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.2857%', alignItems: 'center', paddingVertical: 3 },
  weekday: {
    backgroundColor: colors.primary,
    borderRadius: 9,
    paddingHorizontal: 6,
    height: 18,
    justifyContent: 'center',
  },
  weekdayText: { fontSize: 9, fontWeight: '600', color: colors.white },
  days: { backgroundColor: colors.white, borderRadius: 16, paddingVertical: 8, marginTop: 8 },
  dayBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  dayToday: { borderWidth: 1, borderColor: colors.primary },
  dayVisit: { backgroundColor: colors.primary },
  dayText: { fontSize: 13, color: colors.text },
  dayOff: { color: colors.chevron },
  dayVisitText: { color: colors.white, fontWeight: '700' },
  legend: { fontSize: 11, color: colors.muted, textAlign: 'center', marginTop: 10 },
});
