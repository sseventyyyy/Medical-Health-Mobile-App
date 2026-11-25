import React, { useMemo, useState } from 'react';
import { ProfileNavigator, ProfileRoute } from '../profile';
import { Tab } from '../profile/components/BottomTabBar';
import { MainNav } from './navigation';
import { DOCTORS } from './store';
import DoctorsScreen from './screens/DoctorsScreen';
import DoctorsListScreen from './screens/DoctorsListScreen';
import DoctorInfoScreen from './screens/DoctorInfoScreen';
import BookingScreen from './screens/BookingScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ChatScreen from './screens/ChatScreen';

interface Props {
  onLogout: () => void;
}

/** Экраны, которые открываются поверх текущей вкладки. */
type Overlay =
  | { name: 'notifications' }
  | { name: 'doctors'; favoritesOnly: boolean }
  | { name: 'doctor'; doctorId: string }
  | { name: 'chat'; doctorId: string }
  | { name: 'booking'; doctorId: string };

/**
 * Главный раздел после входа: вкладки нижнего меню + стек экранов поверх них.
 * Временное решение в стиле AuthNavigator/ProfileNavigator — до перехода на Expo Router.
 */
export default function MainNavigator({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('home');
  const [stack, setStack] = useState<Overlay[]>([]);
  // С какого экрана открыть профиль: шестерёнка на Home ведёт сразу в Settings.
  const [profileStart, setProfileStart] = useState<ProfileRoute>('Profile');

  const nav = useMemo<MainNav>(() => {
    const push = (o: Overlay) => setStack((s) => [...s, o]);
    return {
      openTab: (next) => {
        setStack([]);
        if (next === 'profile') setProfileStart('Profile');
        setTab(next);
      },
      back: () => setStack((s) => s.slice(0, -1)),
      openNotifications: () => push({ name: 'notifications' }),
      openSettings: () => {
        setStack([]);
        setProfileStart('Settings');
        setTab('profile');
      },
      openDoctors: (favoritesOnly = false) => push({ name: 'doctors', favoritesOnly }),
      openDoctor: (doctorId) => push({ name: 'doctor', doctorId }),
      openChat: (doctorId) => push({ name: 'chat', doctorId }),
      openBooking: (doctorId) => push({ name: 'booking', doctorId }),
    };
  }, []);

  const top = stack[stack.length - 1];
  if (top) {
    switch (top.name) {
      case 'notifications':
        return <NotificationsScreen nav={nav} />;
      case 'doctors':
        return <DoctorsListScreen nav={nav} favoritesOnly={top.favoritesOnly} />;
      case 'doctor':
        return <DoctorInfoScreen nav={nav} doctorId={top.doctorId} />;
      case 'chat':
        return <ChatScreen key={top.doctorId} nav={nav} doctorId={top.doctorId} />;
      case 'booking':
        return <BookingScreen nav={nav} doctorId={top.doctorId} />;
    }
  }

  // На вкладках стек пуст, поэтому «назад» ведёт на Home.
  const tabNav: MainNav = { ...nav, back: () => nav.openTab('home') };

  switch (tab) {
    case 'chat':
      return <ChatScreen nav={tabNav} doctorId={DOCTORS[0].id} />;
    case 'calendar':
      return <ScheduleScreen nav={tabNav} />;
    case 'profile':
      return (
        <ProfileNavigator
          key={profileStart}
          initialRoute={profileStart}
          onLogout={onLogout}
          onExit={tabNav.back}
          onTabPress={nav.openTab}
          onOpenFavorites={() => nav.openDoctors(true)}
        />
      );
    default:
      return <DoctorsScreen nav={nav} />;
  }
}
