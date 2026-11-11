import React, { ReactNode } from 'react';
import {
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
  right?: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
}

const TOP_PADDING =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 12 : 56;

export default function ProfileLayout({
  title,
  onBack,
  children,
  right,
  footer,
  scroll = true,
}: Props) {
  const Body = scroll ? ScrollView : View;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
      <Body
        style={styles.body}
        {...(scroll
          ? { contentContainerStyle: styles.content, showsVerticalScrollIndicator: false }
          : {})}
      >
        {children}
      </Body>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingTop: TOP_PADDING },
  header: { height: 40, justifyContent: 'center', alignItems: 'center' },
  back: { position: 'absolute', left: 16 },
  right: { position: 'absolute', right: 16 },
  title: { fontSize: 18, fontWeight: '700', color: colors.primary },
  body: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 },
});