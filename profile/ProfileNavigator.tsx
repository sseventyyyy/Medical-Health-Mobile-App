import React, { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationSettingScreen from './screens/NotificationSettingScreen';
import PasswordManagerScreen from './screens/PasswordManagerScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import HelpCenterScreen from './screens/HelpCenterScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import AddCardScreen from './screens/AddCardScreen';
import { ProfileNavigation, ProfileRoute } from './types';

interface Props {
  onLogout?: () => void;
  onExit?: () => void;
  onTabPress?: ProfileNavigation['onTabPress'];
  onOpenFavorites?: () => void;
  initialRoute?: ProfileRoute;
}

export default function ProfileNavigator({
  onLogout = () => {},
  onExit = () => {},
  onTabPress,
  onOpenFavorites,
  initialRoute = 'Profile',
}: Props) {
  const [stack, setStack] = useState<ProfileRoute[]>([initialRoute]);

  const navigate = useCallback((r: ProfileRoute) => setStack((s) => [...s, r]), []);
  const goBack = useCallback(() => {
    if (stack.length > 1) setStack((s) => s.slice(0, -1));
    else onExit();
  }, [stack.length, onExit]);

  const navigation = useMemo<ProfileNavigation>(
    () => ({ navigate, goBack, onLogout, onTabPress, onOpenFavorites }),
    [navigate, goBack, onLogout, onTabPress, onOpenFavorites],
  );

  const current = stack[stack.length - 1];

  return (
    <>
      <StatusBar style="dark" />
      {current === 'Profile' && <ProfileScreen navigation={navigation} />}
      {current === 'EditProfile' && <EditProfileScreen navigation={navigation} />}
      {current === 'Settings' && <SettingsScreen navigation={navigation} />}
      {current === 'NotificationSetting' && (
        <NotificationSettingScreen navigation={navigation} />
      )}
      {current === 'PasswordManager' && <PasswordManagerScreen navigation={navigation} />}
      {current === 'PrivacyPolicy' && <PrivacyPolicyScreen navigation={navigation} />}
      {current === 'HelpCenter' && <HelpCenterScreen navigation={navigation} />}
      {current === 'PaymentMethod' && <PaymentMethodScreen navigation={navigation} />}
      {current === 'AddCard' && <AddCardScreen navigation={navigation} />}
    </>
  );
}
