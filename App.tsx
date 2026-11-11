import React, { useState } from 'react';
import { AuthNavigator } from './login';
import { ProfileNavigator } from './profile';

export default function App() {
  const [isAuth, setIsAuth] = useState(false);

  if (!isAuth) {
    return <AuthNavigator onAuthSuccess={() => setIsAuth(true)} />;
  }
  return <ProfileNavigator onLogout={() => setIsAuth(false)} />;
}