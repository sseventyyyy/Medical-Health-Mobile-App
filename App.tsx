import React, { useCallback, useState } from 'react';
import { AuthNavigator } from './login';
import MainNavigator from './src/MainNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { AppProvider } from './src/store';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  if (showSplash) {
    return <SplashScreen onFinish={hideSplash} />;
  }
  if (!isAuth) {
    return <AuthNavigator onAuthSuccess={() => setIsAuth(true)} />;
  }
  return (
    <AppProvider>
      <MainNavigator onLogout={() => setIsAuth(false)} />
    </AppProvider>
  );
}
