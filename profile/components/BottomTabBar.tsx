import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

type Tab = 'home' | 'chat' | 'profile' | 'calendar';

const TABS: { key: Tab; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { key: 'home', icon: 'home-outline' },
  { key: 'chat', icon: 'chatbubble-outline' },
  { key: 'profile', icon: 'person-outline' },
  { key: 'calendar', icon: 'calendar-outline' },
];

interface Props {
  active?: Tab;
  onPress?: (tab: Tab) => void;
}

export default function BottomTabBar({ active = 'profile', onPress }: Props) {
  return (
    <View style={styles.bar}>
      {TABS.map((t) => (
        <Pressable key={t.key} onPress={() => onPress?.(t.key)} hitSlop={8}>
          <Ionicons
            name={t.icon}
            size={26}
            color={colors.white}
            style={{ opacity: active === t.key ? 1 : 0.6 }}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
});