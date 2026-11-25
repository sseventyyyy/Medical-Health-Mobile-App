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
  onLogout: () => void;
  onTabPress?: (tab: 'home' | 'chat' | 'profile' | 'calendar') => void;
  onOpenFavorites?: () => void;
}
