import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

interface Props {
  uri?: string;
  size?: number;
  /** Нажатие на аватар / карандаш — смена фото */
  onEdit?: () => void;
}

export default function Avatar({ uri, size = 100, onEdit }: Props) {
  return (
    <Pressable
      style={{ width: size, height: size }}
      onPress={onEdit}
      disabled={!onEdit}
      accessibilityRole="button"
      accessibilityLabel="Change photo"
    >
      <View
        style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
      >
        {uri ? (
          <Image source={{ uri }} style={{ width: size, height: size }} />
        ) : (
          <Ionicons name="person" size={size * 0.5} color={colors.primary} />
        )}
      </View>
      {onEdit ? (
        <View style={styles.badge}>
          <Ionicons name="pencil" size={12} color={colors.white} />
        </View>
      ) : null}
    </Pressable>
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
