import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ProfileLayout from '../../profile/components/ProfileLayout';
import PrimaryButton from '../../profile/components/PrimaryButton';
import { colors, radius } from '../../profile/theme';
import { MainNav } from '../navigation';
import { DAYS, TIMES, TODAY, dayName, getDoctor, useApp } from '../store';

interface Props {
  nav: MainNav;
  doctorId: string;
}

/** Запись к врачу: день, время и короткое описание проблемы. */
export default function BookingScreen({ nav, doctorId }: Props) {
  const { appointments, book } = useApp();
  const doctor = getDoctor(doctorId);
  const [day, setDay] = useState(TODAY);
  const [time, setTime] = useState<string | null>(null);
  const [note, setNote] = useState('');

  // Занятое время: у пользователя уже есть запись на этот день и час.
  const busy = (t: string) =>
    appointments.some((a) => a.status !== 'cancelled' && a.day === day && a.time === t);

  const submit = () => {
    if (!time) {
      Alert.alert('Schedule', 'Please choose a time.');
      return;
    }
    book(doctor.id, day, time, note.trim() || 'Consultation.');
    Alert.alert('Appointment booked', `${doctor.name}\n${dayName(day)}, ${time}`);
    nav.openTab('calendar');
  };

  return (
    <ProfileLayout
      title="Schedule"
      onBack={nav.back}
      footer={<PrimaryButton title="Book Appointment" onPress={submit} width="100%" />}
    >
      <Text style={styles.doctor}>{doctor.name}</Text>
      <Text style={styles.specialty}>{doctor.specialty}</Text>

      <Text style={styles.heading}>Day</Text>
      <View style={styles.row}>
        {DAYS.map((d) => {
          const on = d.num === day;
          return (
            <Pressable
              key={d.num}
              onPress={() => {
                setDay(d.num);
                setTime(null);
              }}
              style={[styles.day, on && styles.on]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Text style={[styles.dayNum, on && styles.onText]}>{d.num}</Text>
              <Text style={[styles.dayLabel, on && styles.onText]}>{d.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.heading}>Available Time</Text>
      <View style={styles.row}>
        {TIMES.map((t) => {
          const on = t === time;
          const taken = busy(t);
          return (
            <Pressable
              key={t}
              onPress={() => setTime(t)}
              disabled={taken}
              style={[styles.time, on && styles.on, taken && styles.taken]}
              accessibilityRole="button"
              accessibilityState={{ selected: on, disabled: taken }}
            >
              <Text style={[styles.timeText, on && styles.onText]}>{t}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.heading}>Describe your problem</Text>
      <TextInput
        style={styles.note}
        value={note}
        onChangeText={setNote}
        placeholder="Enter your problem here..."
        placeholderTextColor={colors.placeholder}
        multiline
        maxLength={200}
        textAlignVertical="top"
      />
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  doctor: { fontSize: 16, fontWeight: '700', color: colors.primary },
  specialty: { fontSize: 13, color: colors.text, marginTop: 2 },
  heading: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 20, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  day: {
    flex: 1,
    height: 58,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: { fontSize: 20, fontWeight: '500', color: colors.text },
  dayLabel: { fontSize: 11, color: colors.text },
  time: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: { fontSize: 13, color: colors.text },
  on: { backgroundColor: colors.primary },
  onText: { color: colors.white },
  taken: { opacity: 0.35 },
  note: {
    minHeight: 110,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.input,
    padding: 14,
    fontSize: 14,
    color: colors.text,
  },
});
