export type AuthRoute = 'LogIn' | 'LogIn2' | 'SignUp' | 'SetPassword';

export interface AuthNavigation {
  navigate: (route: AuthRoute) => void;
  goBack: () => void;
  onAuthSuccess: () => void;
}
