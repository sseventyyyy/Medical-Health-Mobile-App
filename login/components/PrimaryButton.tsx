import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../theme';

interface Props {
  title: string;
  onPress: () => void;
  width?: number | `${number}%`;
  variant?: 'primary' | 'secondary';
}

export default function PrimaryButton({
  title,
  onPress,
  width = '70%',
  variant = 'primary',
}: Props) {
  const secondary = variant === 'secondary';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        { width },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    height: 48,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: { backgroundColor: colors.socialBg },
  pressed: { opacity: 0.85 },
  text: { color: colors.white, fontSize: 18, fontWeight: '600' },
  secondaryText: { color: colors.primary },
});
