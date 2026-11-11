import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProfileLayout from '../components/ProfileLayout';
import { colors } from '../theme';
import { ProfileNavigation } from '../types';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin malesuada eleifend fermentum. Donec condimentum, nunc at rhoncus faucibus, ex nisi laoreet ipsum, eu pharetra eros est vitae orci. Morbi quis rhoncus mi. Nullam lacinia eros sit amet vehicula. Duis laoreet, ex eget rutrum pretium, lectus nisl posuere nisi, vel facilisis nisi tellus ac turpis.';

const TERMS = [LOREM, LOREM, LOREM, LOREM];

export default function PrivacyPolicyScreen({
  navigation,
}: {
  navigation: ProfileNavigation;
}) {
  return (
    <ProfileLayout title="Privacy Policy" onBack={navigation.goBack}>
      <Text style={styles.updated}>Last Update: 14/08/2024</Text>
      <Text style={styles.text}>{LOREM}</Text>
      <Text style={[styles.text, styles.gap]}>{LOREM}</Text>

      <Text style={styles.heading}>Terms & Conditions</Text>
      {TERMS.map((t, i) => (
        <View key={i} style={styles.item}>
          <Text style={styles.num}>{i + 1}.</Text>
          <Text style={[styles.text, styles.itemText]}>{t}</Text>
        </View>
      ))}
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  updated: { fontSize: 9, color: colors.placeholder, marginBottom: 8 },
  text: { fontSize: 11, lineHeight: 16, color: colors.muted },
  gap: { marginTop: 12 },
  heading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 18,
    marginBottom: 10,
  },
  item: { flexDirection: 'row', marginBottom: 12 },
  num: { width: 18, fontSize: 11, lineHeight: 16, color: colors.muted },
  itemText: { flex: 1 },
});