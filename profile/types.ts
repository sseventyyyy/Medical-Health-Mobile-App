export type ProfileRoute =
  | 'Profile'
  | 'EditProfile'
  | 'Settings'
  | 'NotificationSetting'
  | 'PasswordManager'
  | 'PrivacyPolicy';

export interface ProfileNavigation {
  navigate: (route: ProfileRoute) => void;
  goBack: () => void;
  /** Нажатие на Logout / Delete Account */
  onLogout: () => void;
  /** Нижнее меню: переход на другие разделы приложения */
  onTabPress?: (tab: 'home' | 'chat' | 'profile' | 'calendar') => void;
}