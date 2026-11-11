import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import ProfileLayout from '../components/ProfileLayout';
import { colors } from '../theme';
import { ProfileNavigation } from '../types';

const ITEMS = [
  { key: 'general', label: 'General Notification', on: true },
  { key: 'sound', label: 'Sound', on: true },
  { key: 'soundCall', label: 'Sound Call', on: true },
  { key: 'vibrate', label: 'Vibrate', on: false },
  { key: 'offers', label: 'Special Offers', on: false },
  { key: 'payments', label: 'Payments', on: true },
  { key: 'promo', label: 'Promo And Discount', on: false },
  { key: 'cashback', label: 'Cashback', on: true },
] as const;

type Key = (typeof ITEMS)[number]['key'];

export default function NotificationSettingScreen({
  navigation,
}: {
  navigation: ProfileNavigation;
}) {
  const [values, setValues] = useState<Record<Key, boolean>>(
    () => Object.fromEntries(ITEMS.map((i) => [i.key, i.on])) as Record<Key, boolean>,
  );

  const toggle = (key: Key) => setValues((v) => ({ ...v, [key]: !v[key] }));

  return (
    <ProfileLayout title="Notification Setting" onBack={navigation.goBack}>
      {ITEMS.map((item) => (
        <View key={item.key} style={styles.row}>
          <Text style={styles.label}>{item.label}</Text>
          <Switch
            value={values[item.key]}
            onValueChange={() => toggle(item.key)}
            trackColor={{ false: colors.iconBg, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      ))}
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: { fontSize: 14, color: colors.text },
});