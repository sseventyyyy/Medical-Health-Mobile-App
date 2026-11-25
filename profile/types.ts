export type ProfileRoute =
  | 'Profile'
  | 'EditProfile'
  | 'Settings'
  | 'NotificationSetting'
  | 'PasswordManager'
  | 'PrivacyPolicy'
  | 'HelpCenter'
  | 'PaymentMethod'
  | 'AddCard';

export interface ProfileNavigation {
  navigate: (route: ProfileRoute) => void;
  goBack: () => void;
  /** Нажатие на Logout / Delete Account */
  onLogout: () => void;
  /** Нижнее меню: переход на другие разделы приложения */
  onTabPress?: (tab: 'home' | 'chat' | 'profile' | 'calendar') => void;
  /** Пункт Favorite: список избранных врачей живёт в главном разделе */
  onOpenFavorites?: () => void;
}
