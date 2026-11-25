import React, { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import WelcomeScreen from './screens/WelcomeScreen';
import LogInScreen from './screens/LogInScreen';
import LogIn2Screen from './screens/LogIn2Screen';
import SignUpScreen from './screens/SignUpScreen';
import SetPasswordScreen from './screens/SetPasswordScreen';
import PrivacyPolicyScreen from '../profile/screens/PrivacyPolicyScreen';
import { AuthNavigation, AuthRoute } from './types';

interface Props {
  onAuthSuccess?: () => void;
  initialRoute?: AuthRoute;
}

export default function AuthNavigator({
  onAuthSuccess = () => {},
  initialRoute = 'Welcome',
}: Props) {
  const [stack, setStack] = useState<AuthRoute[]>([initialRoute]);

  const navigate = useCallback((route: AuthRoute) => {
    setStack((s) => [...s, route]);
  }, []);

  const goBack = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const navigation = useMemo<AuthNavigation>(
    () => ({ navigate, goBack, onAuthSuccess }),
    [navigate, goBack, onAuthSuccess],
  );

  const current = stack[stack.length - 1];

  return (
    <>
      <StatusBar style="dark" />
      {current === 'Welcome' && <WelcomeScreen navigation={navigation} />}
      {current === 'LogIn' && <LogInScreen navigation={navigation} />}
      {current === 'LogIn2' && <LogIn2Screen navigation={navigation} />}
      {current === 'SignUp' && <SignUpScreen navigation={navigation} />}
      {current === 'SetPassword' && <SetPasswordScreen navigation={navigation} />}
      {current === 'Terms' && (
        <PrivacyPolicyScreen navigation={{ navigate: () => {}, goBack, onLogout: () => {} }} />
      )}
    </>
  );
}
