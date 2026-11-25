import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProfileLayout from '../components/ProfileLayout';
import Field from '../components/Field';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';
import { ProfileNavigation } from '../types';
import { useApp } from '../../src/store';

type Key = 'holder' | 'number' | 'expiry' | 'cvv';

const formatNumber = (raw: string) =>
  raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})(?=.)/g, '$1 ');

const formatExpiry = (raw: string) => {
  const d = raw.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export default function AddCardScreen({ navigation }: { navigation: ProfileNavigation }) {
  const { user, addCard } = useApp();
  const [holder, setHolder] = useState(user.name);
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});

  const digits = number.replace(/\D/g, '');

  const submit = () => {
    const e: Partial<Record<Key, string>> = {};
    const month = Number(expiry.slice(0, 2));
    if (holder.trim().length < 2) e.holder = 'Введите имя владельца';
    if (digits.length !== 16) e.number = 'Номер карты — 16 цифр';
    if (expiry.length !== 5 || month < 1 || month > 12) e.expiry = 'Формат MM/YY';
    if (cvv.length !== 3) e.cvv = '3 цифры';
    setErrors(e);
    if (Object.keys(e).length === 0) {
      addCard({ holder: holder.trim(), last4: digits.slice(-4), expiry });
      navigation.goBack();
    }
  };

  return (
    <ProfileLayout
      title="Add Card"
      onBack={navigation.goBack}
      footer={<PrimaryButton title="Save Card" onPress={submit} />}
    >
      <View style={styles.card}>
        <Text style={styles.cardNumber}>{number || '0000 0000 0000 0000'}</Text>
        <View style={styles.cardBottom}>
          <View>
            <Text style={styles.cardLabel}>Card Holder Name</Text>
            <Text style={styles.cardValue}>{holder || '—'}</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>Expiry Date</Text>
            <Text style={styles.cardValue}>{expiry || 'MM/YY'}</Text>
          </View>
        </View>
      </View>

      <Field label="Card Holder Name" value={holder} onChangeText={setHolder} error={errors.holder} />
      <Field
        label="Card Number"
        value={number}
        onChangeText={(t) => setNumber(formatNumber(t))}
        placeholder="0000 0000 0000 0000"
        keyboardType="number-pad"
        maxLength={19}
        error={errors.number}
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <Field
            label="Expiry Date"
            value={expiry}
            onChangeText={(t) => setExpiry(formatExpiry(t))}
            placeholder="MM/YY"
            keyboardType="number-pad"
            maxLength={5}
            error={errors.expiry}
          />
        </View>
        <View style={styles.half}>
          <Field
            label="CVV"
            value={cvv}
            onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 3))}
            placeholder="000"
            keyboardType="number-pad"
            maxLength={3}
            secure
            error={errors.cvv}
          />
        </View>
      </View>
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 20,
    height: 170,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardNumber: { fontSize: 20, fontWeight: '600', color: colors.white, letterSpacing: 1, marginTop: 30 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { fontSize: 11, color: colors.iconBg },
  cardValue: { fontSize: 14, fontWeight: '600', color: colors.white, marginTop: 2 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
});
