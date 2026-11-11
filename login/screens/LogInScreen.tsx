import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import PrimaryButton from '../components/PrimaryButton';
import SocialButtons from '../components/SocialButtons';
import AuthFooterLink from '../components/AuthFooterLink';
import { colors } from '../theme';
import { AuthNavigation } from '../types';
import { isEmailOrPhone, isStrongPassword } from '../validation';

export default function LogInScreen({ navigation }: { navigation: AuthNavigation }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ login?: string; password?: string }>({});

  const submit = () => {
    const next: typeof errors = {};
    if (!isEmailOrPhone(login)) next.login = 'Введите корректный email или номер';
    if (!isStrongPassword(password)) next.password = 'Минимум 8 символов';
    setErrors(next);
    if (Object.keys(next).length === 0) navigation.onAuthSuccess();
  };

  return (
    <AuthLayout title="Log In" onBack={navigation.goBack}>
      <Text style={styles.welcome}>Welcome</Text>
      <Text style={styles.lorem}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Text>

      <View style={styles.form}>
        <AuthInput
          label="Email or Mobile Number"
          value={login}
          onChangeText={setLogin}
          placeholder="example@example.com"
          keyboardType="email-address"
          error={errors.login}
        />
        <AuthInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••••••"
          secure
          error={errors.password}
        />
        <Pressable onPress={() => navigation.navigate('SetPassword')} style={styles.forgot}>
          <Text style={styles.forgotText}>Forget Password</Text>
        </Pressable>
      </View>

      <PrimaryButton title="Log In" onPress={submit} />
      <SocialButtons onFingerprint={navigation.onAuthSuccess} />
      <AuthFooterLink
        question="Don't have an account?"
        action="Sign Up"
        onPress={() => navigation.navigate('SignUp')}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  welcome: { fontSize: 18, fontWeight: '700', color: colors.primary },
  lorem: { fontSize: 10, color: colors.muted, marginTop: 4, lineHeight: 14 },
  form: { marginTop: 24 },
  forgot: { alignSelf: 'flex-end', marginTop: -6, marginBottom: 24 },
  forgotText: { fontSize: 11, fontWeight: '700', color: colors.primary },
});
