import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileLayout from '../../profile/components/ProfileLayout';
import PrimaryButton from '../../profile/components/PrimaryButton';
import Field from '../../profile/components/Field';
import { colors, radius } from '../../profile/theme';
import { MainNav } from '../navigation';
import {
  BookingDraft,
  Gender,
  MONTH,
  Patient,
  SLOTS,
  TODAY,
  getDoctor,
  isBookableDay,
  useApp,
  weekday,
  weekdayIndex,
} from '../store';

interface Props {
  nav: MainNav;
  doctorId: string;
  initialDay?: number;
  initialDraft?: BookingDraft;
}

const GENDERS: Gender[] = ['Male', 'Female', 'Other'];
const FOR_WHO: { key: Patient['forWho']; label: string }[] = [
  { key: 'yourself', label: 'Yourself' },
  { key: 'another', label: 'Another Person' },
];

const mondayOf = (num: number) => num - weekdayIndex(num);
const firstBookableDay = () => {
  let day = TODAY;
  while (day < MONTH.days && !isBookableDay(day)) day += 1;
  return day;
};

export default function BookingScreen({ nav, doctorId, initialDay, initialDraft }: Props) {
  const { appointments, user } = useApp();
  const doctor = getDoctor(doctorId);

  const startDay =
    initialDraft?.day ?? (initialDay && isBookableDay(initialDay) ? initialDay : firstBookableDay());
  const [day, setDay] = useState(startDay);
  const [weekStart, setWeekStart] = useState(mondayOf(startDay));
  const [time, setTime] = useState<string | null>(initialDraft?.time ?? null);
  const [forWho, setForWho] = useState<Patient['forWho']>(initialDraft?.patient.forWho ?? 'yourself');
  const [fullName, setFullName] = useState(initialDraft?.patient.fullName ?? user.name);
  const [age, setAge] = useState(initialDraft?.patient.age ?? '');
  const [gender, setGender] = useState<Gender | null>(initialDraft?.patient.gender ?? null);
  const [note, setNote] = useState(initialDraft?.note ?? '');
  const [errors, setErrors] = useState<Partial<Record<'time' | 'fullName' | 'age' | 'gender', string>>>({});

  const busy = (t: string) =>
    appointments.some((a) => a.status !== 'cancelled' && a.day === day && a.time === t);

  const canGoPrev = weekStart > mondayOf(firstBookableDay());
  const canGoNext = weekStart + 7 <= MONTH.days;

  const chooseForWho = (next: Patient['forWho']) => {
    if (next === forWho) return;
    setForWho(next);
    setFullName(next === 'yourself' ? user.name : '');
  };

  const submit = () => {
    const e: typeof errors = {};
    const ageNum = Number(age);
    if (!time) e.time = 'Please choose a time';
    if (fullName.trim().length < 2) e.fullName = 'Enter the full name';
    if (!age || !Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120) e.age = 'Enter the age (1–120)';
    if (!gender) e.gender = 'Please choose a gender';
    setErrors(e);
    if (!time || !gender || Object.keys(e).length > 0) return;

    nav.openPayment({
      doctorId: doctor.id,
      day,
      time,
      note: note.trim() || 'Consultation.',
      patient: { forWho, fullName: fullName.trim(), age: String(ageNum), gender },
    });
  };

  return (
    <ProfileLayout
      title="Schedule"
      onBack={nav.back}
      footer={<PrimaryButton title="Continue" onPress={submit} width="100%" />}
    >
      <Text style={styles.doctor}>{doctor.name}</Text>
      <Text style={styles.specialty}>{doctor.specialty}</Text>

      <View style={styles.band}>
        <Text style={styles.month}>
          {MONTH.name} {MONTH.year}
        </Text>
        <View style={styles.week}>
          <Pressable
            onPress={() => setWeekStart((w) => w - 7)}
            disabled={!canGoPrev}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Previous week"
          >
            <Ionicons name="chevron-back" size={18} color={colors.primary} style={!canGoPrev && styles.off} />
          </Pressable>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const num = weekStart + i;
            if (num < 1 || num > MONTH.days) return <View key={i} style={styles.dayGap} />;
            const on = num === day;
            const bookable = isBookableDay(num);
            return (
              <Pressable
                key={i}
                onPress={() => {
                  setDay(num);
                  setTime(null);
                }}
                disabled={!bookable}
                style={[styles.day, on && styles.on, !bookable && styles.off]}
                accessibilityRole="button"
                accessibilityLabel={`${weekday(num).name} ${num}`}
                accessibilityState={{ selected: on, disabled: !bookable }}
              >
                <Text style={[styles.dayNum, on && styles.onText]}>{num}</Text>
                <Text style={[styles.dayLabel, on && styles.onText]}>{weekday(num).label}</Text>
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => setWeekStart((w) => w + 7)}
            disabled={!canGoNext}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Next week"
          >
            <Ionicons name="chevron-forward" size={18} color={colors.primary} style={!canGoNext && styles.off} />
          </Pressable>
        </View>
      </View>

      <Text style={styles.heading}>Available Time</Text>
      <View style={styles.slots}>
        {SLOTS.map((t) => {
          const on = t === time;
          const taken = busy(t);
          return (
            <Pressable
              key={t}
              onPress={() => setTime(t)}
              disabled={taken}
              style={[styles.slot, on && styles.on, taken && styles.off]}
              accessibilityRole="button"
              accessibilityState={{ selected: on, disabled: taken }}
            >
              <Text style={[styles.slotText, on && styles.onText]} numberOfLines={1}>
                {t}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {errors.time ? <Text style={styles.error}>{errors.time}</Text> : null}

      <View style={styles.divider} />

      <Text style={styles.heading}>Patient Details</Text>
      <View style={[styles.chips, styles.chipsGap]}>
        {FOR_WHO.map((f) => {
          const on = f.key === forWho;
          return (
            <Pressable
              key={f.key}
              onPress={() => chooseForWho(f.key)}
              style={[styles.chip, on && styles.on]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Text style={[styles.chipText, on && styles.onText]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Field
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Jane Doe"
        maxLength={60}
        error={errors.fullName}
      />
      <Field
        label="Age"
        value={age}
        onChangeText={(t) => setAge(t.replace(/\D/g, ''))}
        placeholder="30"
        keyboardType="number-pad"
        maxLength={3}
        error={errors.age}
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.chips}>
        {GENDERS.map((g) => {
          const on = g === gender;
          return (
            <Pressable
              key={g}
              onPress={() => setGender(g)}
              style={[styles.chip, on && styles.on]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Text style={[styles.chipText, on && styles.onText]}>{g}</Text>
            </Pressable>
          );
        })}
      </View>
      {errors.gender ? <Text style={styles.error}>{errors.gender}</Text> : null}

      <View style={styles.divider} />

      <Text style={styles.label}>Describe your problem</Text>
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

  band: {
    backgroundColor: colors.iconBg,
    marginHorizontal: -24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 16,
    marginBottom: 18,
  },
  month: { fontSize: 14, fontWeight: '600', color: colors.primary, marginLeft: 8, marginBottom: 10 },
  week: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  day: {
    flex: 1,
    height: 58,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayGap: { flex: 1 },
  dayNum: { fontSize: 20, fontWeight: '500', color: colors.text },
  dayLabel: { fontSize: 11, color: colors.text },

  heading: { fontSize: 15, fontWeight: '700', color: colors.primary, marginBottom: 10 },
  label: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 8 },
  slots: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8 },
  slot: {
    width: '18.5%',
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: { fontSize: 11, color: colors.text },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipsGap: { marginBottom: 14 },
  chip: {
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: { fontSize: 13, color: colors.primary },

  on: { backgroundColor: colors.primary },
  onText: { color: colors.white },
  off: { opacity: 0.35 },
  error: { fontSize: 12, color: colors.error, marginTop: 6 },
  divider: { height: 1, backgroundColor: colors.iconBg, marginVertical: 18 },
  note: {
    minHeight: 110,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.input,
    padding: 14,
    fontSize: 14,
    color: colors.text,
  },
});
