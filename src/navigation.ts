import { Tab } from '../profile/components/BottomTabBar';

/** Переходы внутри главного раздела (после входа). Реализация — в MainNavigator. */
export interface MainNav {
  openTab: (tab: Tab) => void;
  back: () => void;
  openNotifications: () => void;
  openSettings: () => void;
  openDoctors: (favoritesOnly?: boolean) => void;
  openDoctor: (doctorId: string) => void;
  openChat: (doctorId: string) => void;
  openBooking: (doctorId: string) => void;
}
