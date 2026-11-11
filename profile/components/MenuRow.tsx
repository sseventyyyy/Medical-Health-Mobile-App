import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  icon: IconName;
  label: string;
  onPress: () => void;
  chevron?: boolean;
  filled?: boolean;
}

export default function MenuRow({
  icon,
  label,
  onPress,
  chevron = true,
  filled = true,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, filled && styles.iconFilled]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.label}>{label}</Text>
      {chevron && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={filled ? colors.chevron : colors.primary}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  pressed: { opacity: 0.6 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconFilled: { backgroundColor: colors.iconBg },
  label: { flex: 1, fontSize: 14, color: colors.text },
});