import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import HomeScreen from '../features/home/screens/HomeScreen';
import DoctorsScreen from '../features/doctors/screens/DoctorsScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';

type TabKey = 'home' | 'doctors' | 'login';

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<TabKey>('doctors');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'doctors' && <DoctorsScreen />}
        {activeTab === 'login' && <LoginScreen />}
      </View>

      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabItem, activeTab === 'home' && styles.tabItemActive]}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>
            Главная
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tabItem, activeTab === 'doctors' && styles.tabItemActive]}
          onPress={() => setActiveTab('doctors')}
        >
          <Text
            style={[styles.tabText, activeTab === 'doctors' && styles.tabTextActive]}
          >
            Врачи
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tabItem, activeTab === 'login' && styles.tabItemActive]}
          onPress={() => setActiveTab('login')}
        >
          <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>
            Вход
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 8,
    gap: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: '#E6F0FF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#2F6BFF',
  },
});