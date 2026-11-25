export type AuthRoute = 'Welcome' | 'LogIn' | 'LogIn2' | 'SignUp' | 'SetPassword' | 'Terms';

export interface AuthNavigation {
  navigate: (route: AuthRoute) => void;
  goBack: () => void;
  onAuthSuccess: () => void;
}
