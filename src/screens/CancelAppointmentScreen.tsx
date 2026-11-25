import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ProfileLayout from '../../profile/components/ProfileLayout';
import PrimaryButton from '../../profile/components/PrimaryButton';
import { colors, radius } from '../../profile/theme';
import { MainNav } from '../navigation';
import { dateLabel, getDoctor, useApp } from '../store';

interface Props {
  nav: MainNav;
  appointmentId: string;
}

const REASONS = ['Rescheduling', 'Weather Conditions', 'Unexpected Work', 'Others'];

export default function CancelAppointmentScreen({ nav, appointmentId }: Props) {
  const { appointments, cancelAppointment } = useApp();
  const a = appointments.find((x) => x.id === appointmentId);
  const [reason, setReason] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!a) {
    return (
      <ProfileLayout title="Cancel Appointment" onBack={nav.back}>
        <Text style={styles.text}>This appointment no longer exists.</Text>
      </ProfileLayout>
    );
  }

  const doctor = getDoctor(a.doctorId);

  const submit = () => {
    const details = comment.trim();
    if (!reason) {
      setError('Please choose a reason');
      return;
    }
    if (reason === 'Others' && !details) {
      setError('Please describe the reason');
      return;
    }
    cancelAppointment(a.id, details ? `${reason}: ${details}` : reason);
    nav.openTab('calendar');
  };

  return (
    <ProfileLayout
      title="Cancel Appointment"
      onBack={nav.back}
      footer={<PrimaryButton title="Cancel Appointment" onPress={submit} width="100%" />}
    >
      <Text style={styles.text}>
        You are cancelling your visit to {doctor.name} on {dateLabel(a.day)} at {a.time}. Please tell
        us why — it helps the clinic plan the schedule.
      </Text>

      <View style={styles.list} accessibilityRole="radiogroup">
        {REASONS.map((r) => {
          const on = r === reason;
          return (
            <Pressable
              key={r}
              onPress={() => {
                setReason(r);
                setError('');
              }}
              style={[styles.option, on && styles.optionOn]}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
            >
              <View style={styles.radio}>{on ? <View style={styles.radioDot} /> : null}</View>
              <Text style={styles.optionText}>{r}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hint}>Add more details if you want (required for “Others”).</Text>
      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={(t) => {
          setComment(t);
          setError('');
        }}
        placeholder="Enter your reason here..."
        placeholderTextColor={colors.placeholder}
        multiline
        maxLength={200}
        textAlignVertical="top"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 13, lineHeight: 19, color: colors.text },
  list: { marginTop: 16 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  optionOn: { backgroundColor: colors.iconBg },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  optionText: { fontSize: 15, color: colors.text },
  hint: { fontSize: 12, color: colors.muted, marginTop: 10, marginBottom: 8 },
  input: {
    minHeight: 120,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.input,
    padding: 14,
    fontSize: 14,
    color: colors.text,
  },
  error: { fontSize: 12, color: colors.error, marginTop: 6 },
});
