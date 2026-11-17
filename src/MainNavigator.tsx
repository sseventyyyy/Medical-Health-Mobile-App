import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { ProfileNavigator, ProfileRoute } from '../profile';
import { Tab } from '../profile/components/BottomTabBar';
import DoctorsScreen from './screens/DoctorsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ChatScreen from './screens/ChatScreen';

interface Props {
  onLogout: () => void;
}

/**
 * Главный раздел после входа: вкладки нижнего меню + экран уведомлений поверх них.
 * Временное решение в стиле AuthNavigator/ProfileNavigator — до перехода на Expo Router.
 */
export default function MainNavigator({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('home');
  const [showNotifications, setShowNotifications] = useState(false);
  // С какого экрана открыть профиль: шестерёнка на Home ведёт сразу в Settings.
  const [profileStart, setProfileStart] = useState<ProfileRoute>('Profile');

  const openTab = useCallback((next: Tab) => {
    if (next === 'calendar') {
      Alert.alert('Calendar', 'Раздел в разработке');
      return;
    }
    setShowNotifications(false);
    if (next === 'profile') setProfileStart('Profile');
    setTab(next);
  }, []);

  const goHome = useCallback(() => setTab('home'), []);

  if (showNotifications) {
    return <NotificationsScreen onBack={() => setShowNotifications(false)} onTabPress={openTab} />;
  }

  switch (tab) {
    case 'chat':
      return <ChatScreen onBack={goHome} onTabPress={openTab} />;
    case 'profile':
      return (
        <ProfileNavigator
          key={profileStart}
          initialRoute={profileStart}
          onLogout={onLogout}
          onExit={goHome}
          onTabPress={openTab}
        />
      );
    default:
      return (
        <DoctorsScreen
          onTabPress={openTab}
          onNotificationsPress={() => setShowNotifications(true)}
          onSettingsPress={() => {
            setProfileStart('Settings');
            setTab('profile');
          }}
        />
      );
  }
}
