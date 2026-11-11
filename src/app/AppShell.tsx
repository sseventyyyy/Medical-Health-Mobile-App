import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import DoctorsScreen from '../features/doctors/screens/DoctorsScreen';

export default function AppShell() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <DoctorsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
});
