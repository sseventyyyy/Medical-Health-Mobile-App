import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

interface Props {
  /** false → только отпечаток пальца (экран Log In 2) */
  showProviders?: boolean;
  onGoogle?: () => void;
  onFacebook?: () => void;
  onFingerprint?: () => void;
  label?: string;
}

function Circle({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.circle}>
      {children}
    </Pressable>
  );
}

export default function SocialButtons({
  showProviders = true,
  onGoogle,
  onFacebook,
  onFingerprint,
  label = 'or sign up with',
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {showProviders && (
          <>
            <Circle onPress={onGoogle}>
              <AntDesign name="google" size={18} color={colors.primary} />
            </Circle>
            <Circle onPress={onFacebook}>
              <FontAwesome name="facebook" size={18} color={colors.primary} />
            </Circle>
          </>
        )}
        <Circle onPress={onFingerprint}>
          <Ionicons name="finger-print" size={22} color={colors.primary} />
        </Circle>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', marginTop: 16 },
  label: { fontSize: 11, color: colors.muted, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 12 },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.socialBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
