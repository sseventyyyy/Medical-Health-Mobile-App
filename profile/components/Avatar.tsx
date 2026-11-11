import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

interface Props {
  uri?: string;
  size?: number;
}

export default function Avatar({ uri, size = 100 }: Props) {
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
      >
        {uri ? (
          <Image source={{ uri }} style={{ width: size, height: size }} />
        ) : (
          <Ionicons name="person" size={size * 0.5} color={colors.primary} />
        )}
      </View>
      <View style={styles.badge}>
        <Ionicons name="pencil" size={12} color={colors.white} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
});