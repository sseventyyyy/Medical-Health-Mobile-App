import React, { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationSettingScreen from './screens/NotificationSettingScreen';
import PasswordManagerScreen from './screens/PasswordManagerScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import { ProfileNavigation, ProfileRoute } from './types';

interface Props {
  onLogout?: () => void;
  onExit?: () => void;
  onTabPress?: ProfileNavigation['onTabPress'];
  initialRoute?: ProfileRoute;
  userName?: string;
  avatarUri?: string;
}

export default function ProfileNavigator({
  onLogout = () => {},
  onExit = () => {},
  onTabPress,
  initialRoute = 'Profile',
  userName,
  avatarUri,
}: Props) {
  const [stack, setStack] = useState<ProfileRoute[]>([initialRoute]);

  const navigate = useCallback((r: ProfileRoute) => setStack((s) => [...s, r]), []);
  const goBack = useCallback(() => {
    setStack((s) => {
      if (s.length > 1) return s.slice(0, -1);
      onExit();
      return s;
    });
  }, [onExit]);

  const navigation = useMemo<ProfileNavigation>(
    () => ({ navigate, goBack, onLogout, onTabPress }),
    [navigate, goBack, onLogout, onTabPress],
  );

  const current = stack[stack.length - 1];

  return (
    <>
      <StatusBar style="dark" />
      {current === 'Profile' && (
        <ProfileScreen navigation={navigation} name={userName} avatarUri={avatarUri} />
      )}
      {current === 'EditProfile' && (
        <EditProfileScreen navigation={navigation} avatarUri={avatarUri} />
      )}
      {current === 'Settings' && <SettingsScreen navigation={navigation} />}
      {current === 'NotificationSetting' && (
        <NotificationSettingScreen navigation={navigation} />
      )}
      {current === 'PasswordManager' && <PasswordManagerScreen navigation={navigation} />}
      {current === 'PrivacyPolicy' && <PrivacyPolicyScreen navigation={navigation} />}
    </>
  );
}