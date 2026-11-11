import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

interface Props {
  title: string;
  onBack: () => void;
  children: ReactNode;
}

const TOP_PADDING =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 12 : 56;

export default function AuthLayout({ title, onBack, children }: Props) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.flex, styles.container]}>
        <View style={styles.header}>
          <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.title}>{title}</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { backgroundColor: colors.white, paddingTop: TOP_PADDING },
  header: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  back: { position: 'absolute', left: 16 },
  title: { fontSize: 18, fontWeight: '700', color: colors.primary },
  content: { paddingHorizontal: 24, paddingBottom: 32, paddingTop: 16 },
});
