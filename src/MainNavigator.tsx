import React, { useMemo, useState } from 'react';
import { ProfileNavigator, ProfileRoute } from '../profile';
import { Tab } from '../profile/components/BottomTabBar';
import PaymentMethodScreen from '../profile/screens/PaymentMethodScreen';
import AddCardScreen from '../profile/screens/AddCardScreen';
import { ProfileNavigation } from '../profile/types';
import { MainNav } from './navigation';
import { BookingDraft, DOCTORS } from './store';
import DoctorsScreen from './screens/DoctorsScreen';
import DoctorsListScreen from './screens/DoctorsListScreen';
import DoctorInfoScreen from './screens/DoctorInfoScreen';
import BookingScreen from './screens/BookingScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ChatScreen from './screens/ChatScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import CancelAppointmentScreen from './screens/CancelAppointmentScreen';
import ReviewScreen from './screens/ReviewScreen';
import PaymentScreen from './screens/PaymentScreen';
import PaymentSuccessScreen from './screens/PaymentSuccessScreen';

interface Props {
  onLogout: () => void;
}

type Overlay =
  | { name: 'notifications' }
  | { name: 'doctors'; favoritesOnly: boolean }
  | { name: 'doctor'; doctorId: string }
  | { name: 'chat'; doctorId: string }
  | { name: 'booking'; doctorId: string; day?: number; draft?: BookingDraft }
  | { name: 'payment'; draft: BookingDraft }
  | { name: 'paymentSuccess'; appointmentId: string }
  | { name: 'paymentMethod' }
  | { name: 'addCard' }
  | { name: 'appointment'; appointmentId: string }
  | { name: 'cancel'; appointmentId: string }
  | { name: 'review'; appointmentId: string };

export default function MainNavigator({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('home');
  const [stack, setStack] = useState<Overlay[]>([]);
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
      openBooking: (doctorId, day) => push({ name: 'booking', doctorId, day }),
      openPayment: (draft) =>
        setStack((s) => [
          ...s.map((o) => (o.name === 'booking' && o.doctorId === draft.doctorId ? { ...o, draft } : o)),
          { name: 'payment', draft },
        ]),
      finishPayment: (appointmentId) => {
        setTab('calendar');
        setStack([{ name: 'paymentSuccess', appointmentId }]);
      },
      openPaymentMethod: () => push({ name: 'paymentMethod' }),
      openAppointment: (appointmentId) => push({ name: 'appointment', appointmentId }),
      openCancel: (appointmentId) => push({ name: 'cancel', appointmentId }),
      openReview: (appointmentId) => push({ name: 'review', appointmentId }),
    };
  }, []);

  const top = stack[stack.length - 1];
  if (top) {
    const paymentNav: ProfileNavigation = {
      navigate: (route) => {
        if (route === 'AddCard') setStack((s) => [...s, { name: 'addCard' }]);
      },
      goBack: nav.back,
      onLogout,
    };

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
        return (
          <BookingScreen
            nav={nav}
            doctorId={top.doctorId}
            initialDay={top.day}
            initialDraft={top.draft}
          />
        );
      case 'payment':
        return <PaymentScreen nav={nav} draft={top.draft} />;
      case 'paymentSuccess':
        return <PaymentSuccessScreen nav={nav} appointmentId={top.appointmentId} />;
      case 'paymentMethod':
        return <PaymentMethodScreen navigation={paymentNav} />;
      case 'addCard':
        return <AddCardScreen navigation={paymentNav} />;
      case 'appointment':
        return <AppointmentScreen nav={nav} appointmentId={top.appointmentId} />;
      case 'cancel':
        return <CancelAppointmentScreen nav={nav} appointmentId={top.appointmentId} />;
      case 'review':
        return <ReviewScreen nav={nav} appointmentId={top.appointmentId} />;
    }
  }

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
