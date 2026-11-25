import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileLayout from '../components/ProfileLayout';
import { colors } from '../theme';
import { ProfileNavigation } from '../types';
import { useApp } from '../../src/store';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const WALLETS: { key: string; label: string; icon: IconName }[] = [
  { key: 'apple', label: 'Apple Pay', icon: 'logo-apple' },
  { key: 'paypal', label: 'Paypal', icon: 'logo-paypal' },
  { key: 'google', label: 'Google Pay', icon: 'logo-google' },
];

export default function PaymentMethodScreen({ navigation }: { navigation: ProfileNavigation }) {
  const { cards, paymentMethod, setPaymentMethod } = useApp();

  const row = (key: string, label: string, icon: IconName) => {
    const on = paymentMethod === key;
    return (
      <Pressable
        key={key}
        onPress={() => setPaymentMethod(key)}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        accessibilityRole="radio"
        accessibilityState={{ selected: on }}
      >
        <Ionicons name={icon} size={22} color={colors.primary} />
        <Text style={styles.label}>{label}</Text>
        <View style={styles.radio}>{on ? <View style={styles.radioDot} /> : null}</View>
      </Pressable>
    );
  };

  return (
    <ProfileLayout title="Payment Method" onBack={navigation.goBack}>
      <Text style={styles.heading}>Credit & Debit Card</Text>
      {cards.map((c) => row(`card:${c.id}`, `•••• ${c.last4}  (${c.expiry})`, 'card-outline'))}
      <Pressable
        onPress={() => navigation.navigate('AddCard')}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        accessibilityRole="button"
      >
        <Ionicons name="card-outline" size={22} color={colors.primary} />
        <Text style={styles.label}>Add New Card</Text>
        <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
      </Pressable>

      <Text style={[styles.heading, styles.gap]}>More Payment Option</Text>
      {WALLETS.map((w) => row(w.key, w.label, w.icon))}
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 10 },
  gap: { marginTop: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  pressed: { opacity: 0.7 },
  label: { flex: 1, fontSize: 14, color: colors.text },
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
});
