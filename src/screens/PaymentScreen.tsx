import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { TOP_PADDING } from '../../profile/components/ProfileLayout';
import PrimaryButton from '../../profile/components/PrimaryButton';
import { colors } from '../../profile/theme';
import { MainNav } from '../navigation';
import {
  BookingDraft,
  CONSULTATION_MINUTES,
  CONSULTATION_PRICE,
  dateLabel,
  getDoctor,
  paymentLabel,
  useApp,
} from '../store';

interface Props {
  nav: MainNav;
  draft: BookingDraft;
}

const money = (amount: number) => `$${amount.toFixed(2)}`;

export default function PaymentScreen({ nav, draft }: Props) {
  const { book, cards, paymentMethod } = useApp();
  const doctor = getDoctor(draft.doctorId);

  const pay = () => nav.finishPayment(book(draft, paymentMethod));

  const row = (label: string, value: string) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerBar}>
          <Pressable
            onPress={nav.back}
            hitSlop={12}
            style={styles.back}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </Pressable>
          <Text style={styles.title}>Payment</Text>
        </View>
        <Text style={styles.amount}>{money(CONSULTATION_PRICE)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.doctorRow}>
          <Image source={{ uri: doctor.photo }} style={styles.photo} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName} numberOfLines={1}>
              {doctor.name}
            </Text>
            <Text style={styles.specialty}>{doctor.specialty}</Text>
            <View style={styles.pills}>
              <View style={styles.pill}>
                <Ionicons name="star" size={12} color={colors.primary} />
                <Text style={styles.pillText}>{doctor.rating}</Text>
              </View>
              <View style={styles.pill}>
                <Ionicons name="chatbubble-ellipses-outline" size={12} color={colors.primary} />
                <Text style={styles.pillText}>{doctor.reviews}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />
        {row('Date / Hour', `${dateLabel(draft.day)} / ${draft.time}`)}
        {row('Duration', `${CONSULTATION_MINUTES} Minutes`)}
        {row('Booking for', draft.patient.forWho === 'another' ? draft.patient.fullName : 'Yourself')}

        <View style={styles.divider} />
        {row('Amount', money(CONSULTATION_PRICE))}
        {row('Total', money(CONSULTATION_PRICE))}

        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Payment Method</Text>
          <Text style={styles.rowValue} numberOfLines={1}>
            {paymentLabel(paymentMethod, cards)}
          </Text>
          <Pressable
            onPress={nav.openPaymentMethod}
            hitSlop={10}
            style={styles.change}
            accessibilityRole="button"
            accessibilityLabel="Change payment method"
          >
            <Text style={styles.changeText}>Change</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Pay Now" onPress={pay} width="100%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { backgroundColor: colors.primary, paddingTop: TOP_PADDING, paddingBottom: 24 },
  headerBar: { height: 40, justifyContent: 'center', alignItems: 'center' },
  back: { position: 'absolute', left: 16 },
  title: { fontSize: 18, fontWeight: '700', color: colors.white },
  amount: { fontSize: 36, fontWeight: '700', color: colors.white, textAlign: 'center', marginTop: 12 },

  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 },
  doctorRow: { flexDirection: 'row', alignItems: 'center' },
  photo: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.iconBg },
  doctorInfo: { flex: 1, marginLeft: 12 },
  doctorName: { fontSize: 15, fontWeight: '700', color: colors.primary },
  specialty: { fontSize: 12, color: colors.text, marginTop: 2 },
  pills: { flexDirection: 'row', gap: 8, marginTop: 6 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.iconBg,
    borderRadius: 11,
    paddingHorizontal: 10,
    height: 22,
  },
  pillText: { fontSize: 12, color: colors.text },

  divider: { height: 1, backgroundColor: colors.primary, opacity: 0.5, marginVertical: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  rowLabel: { flex: 1, fontSize: 13, color: colors.muted },
  rowValue: { flexShrink: 1, fontSize: 13, fontWeight: '700', color: colors.text },
  change: {
    backgroundColor: colors.iconBg,
    borderRadius: 11,
    paddingHorizontal: 10,
    height: 22,
    justifyContent: 'center',
  },
  changeText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 },
});
