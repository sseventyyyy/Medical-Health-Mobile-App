import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { TOP_PADDING } from '../../profile/components/ProfileLayout';
import { colors } from '../../profile/theme';
import { MainNav } from '../navigation';
import { dateLabel, getDoctor, useApp } from '../store';

interface Props {
  nav: MainNav;
  appointmentId: string;
}

export default function PaymentSuccessScreen({ nav, appointmentId }: Props) {
  const { appointments } = useApp();
  const a = appointments.find((x) => x.id === appointmentId);
  const doctor = a ? getDoctor(a.doctorId) : null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.headerBar}>
        <Pressable
          onPress={nav.back}
          hitSlop={12}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Back to appointments"
        >
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.center}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={72} color={colors.white} />
        </View>
        <Text style={styles.title}>Congratulation</Text>
        <Text style={styles.subtitle}>Payment is Successfully</Text>

        {a && doctor ? (
          <Pressable
            style={({ pressed }) => [styles.box, pressed && styles.pressed]}
            onPress={() => nav.openAppointment(a.id)}
            accessibilityRole="button"
            accessibilityLabel="Open appointment details"
          >
            <Text style={styles.boxText}>You have successfully booked an appointment with</Text>
            <Text style={styles.doctor}>{doctor.name}</Text>
            <View style={styles.when}>
              <View style={styles.whenItem}>
                <Ionicons name="calendar-outline" size={14} color={colors.white} />
                <Text style={styles.whenText}>{dateLabel(a.day)}</Text>
              </View>
              <View style={styles.whenItem}>
                <Ionicons name="time-outline" size={14} color={colors.white} />
                <Text style={styles.whenText}>{a.time}</Text>
              </View>
            </View>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, paddingTop: TOP_PADDING },
  headerBar: { height: 40, justifyContent: 'center' },
  back: { position: 'absolute', left: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 60 },
  check: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 6,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 28, fontWeight: '700', color: colors.white, marginTop: 24 },
  subtitle: { fontSize: 16, color: colors.white, marginTop: 4 },
  box: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginTop: 40,
  },
  pressed: { opacity: 0.8 },
  boxText: { fontSize: 12, color: colors.white, textAlign: 'center' },
  doctor: { fontSize: 16, fontWeight: '700', color: colors.white, marginTop: 8, textAlign: 'center' },
  when: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginTop: 8 },
  whenItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  whenText: { fontSize: 12, color: colors.white },
});
