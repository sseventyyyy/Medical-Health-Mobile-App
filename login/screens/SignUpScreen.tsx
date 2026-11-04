import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import PrimaryButton from '../components/PrimaryButton';
import SocialButtons from '../components/SocialButtons';
import AuthFooterLink from '../components/AuthFooterLink';
import { colors } from '../theme';
import { AuthNavigation } from '../types';
import { formatDob, isEmail, isPhone, isStrongPassword } from '../validation';

type Field = 'name' | 'password' | 'email' | 'phone' | 'dob';

export default function SignUpScreen({ navigation }: { navigation: AuthNavigation }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const submit = () => {
    const next: Partial<Record<Field, string>> = {};
    if (name.trim().length < 2) next.name = 'Введите имя';
    if (!isStrongPassword(password)) next.password = 'Минимум 8 символов';
    if (!isEmail(email)) next.email = 'Некорректный email';
    if (!isPhone(phone)) next.phone = 'Некорректный номер';
    if (dob.replace(/\D/g, '').length !== 8) next.dob = 'Формат DD / MM / YYYY';
    setErrors(next);
    if (Object.keys(next).length === 0) navigation.navigate('SetPassword');
  };

  return (
    <AuthLayout title="New Account" onBack={navigation.goBack}>
      <AuthInput
        label="Full name"
        value={name}
        onChangeText={setName}
        placeholder="John Doe"
        error={errors.name}
      />
      <AuthInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••••••"
        secure
        error={errors.password}
      />
      <AuthInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="example@example.com"
        keyboardType="email-address"
        error={errors.email}
      />
      <AuthInput
        label="Mobile Number"
        value={phone}
        onChangeText={setPhone}
        placeholder="+7 700 000 00 00"
        keyboardType="phone-pad"
        error={errors.phone}
      />
      <AuthInput
        label="Date Of Birth"
        value={dob}
        onChangeText={(t) => setDob(formatDob(t))}
        placeholder="DD / MM / YYYY"
        keyboardType="number-pad"
        maxLength={14}
        error={errors.dob}
      />

      <Text style={styles.terms}>
        By continuing, you agree to{'\n'}
        <Text style={styles.link}>Terms of Use</Text> and{' '}
        <Text style={styles.link}>Privacy Policy.</Text>
      </Text>

      <PrimaryButton title="Sign Up" onPress={submit} width="60%" />
      <SocialButtons onFingerprint={navigation.onAuthSuccess} />
      <AuthFooterLink
        question="already have an account?"
        action="Log In"
        onPress={() => navigation.navigate('LogIn')}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  terms: {
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 14,
  },
  link: { color: colors.primary, fontWeight: '700' },
});
