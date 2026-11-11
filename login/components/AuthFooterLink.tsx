import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

interface Props {
  question: string;
  action: string;
  onPress: () => void;
}

export default function AuthFooterLink({ question, action, onPress }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{question} </Text>
      <Pressable onPress={onPress} hitSlop={8}>
        <Text style={[styles.text, styles.link]}>{action}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  text: { fontSize: 12, color: colors.muted },
  link: { color: colors.primary, fontWeight: '700' },
});
