import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Logo from '../components/Logo';

interface Props {
  onFinish: () => void;
  duration?: number;
}

export default function SplashScreen({ onFinish, duration = 1500 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onFinish, duration);
    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  return (
    <Pressable style={styles.container} onPress={onFinish} accessibilityLabel="Skip splash screen">
      <StatusBar style="light" />
      <Logo variant="onBlue" size={120} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
