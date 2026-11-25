import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#2563FF';
const WHITE = '#FFFFFF';

interface Props {
  variant?: 'onBlue' | 'onWhite';
  size?: number;
}

export default function Logo({ variant = 'onWhite', size = 110 }: Props) {
  const fg = variant === 'onBlue' ? WHITE : BLUE;
  const bg = variant === 'onBlue' ? BLUE : WHITE;
  const arm = size * 0.38;

  return (
    <View style={styles.wrap} accessibilityRole="image" accessibilityLabel="Skin First, Dermatology Center">
      <View style={{ width: size, height: size }}>
        <View
          style={[
            styles.abs,
            { left: 0, top: (size - arm) / 2, width: size, height: arm, borderRadius: arm / 2, backgroundColor: fg },
          ]}
        />
        <View
          style={[
            styles.abs,
            { top: 0, left: (size - arm) / 2, width: arm, height: size, borderRadius: arm / 2, backgroundColor: fg },
          ]}
        />
        <Ionicons
          name="leaf"
          size={size * 0.42}
          color={bg}
          style={[styles.abs, { left: size * 0.4, top: size * 0.16, transform: [{ rotate: '-10deg' }] }]}
        />
        <Ionicons
          name="leaf"
          size={size * 0.34}
          color={bg}
          style={[styles.abs, { left: size * 0.18, top: size * 0.42, transform: [{ scaleX: -1 }, { rotate: '-50deg' }] }]}
        />
      </View>

      <Text style={[styles.name, { color: fg, fontSize: size * 0.3, lineHeight: size * 0.32 }]}>
        {'Skin\nFirst'}
      </Text>
      <Text style={[styles.tagline, { color: fg }]}>Dermatology Center</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  abs: { position: 'absolute' },
  name: { fontWeight: '300', textAlign: 'center', marginTop: 10 },
  tagline: { fontSize: 11, fontWeight: '600', marginTop: 6 },
});
