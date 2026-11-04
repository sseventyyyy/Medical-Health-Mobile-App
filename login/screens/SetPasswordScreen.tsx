import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';
import { AuthNavigation } from '../types';
import { isStrongPassword } from '../validation';

export default function SetPasswordScreen({ navigation }: { navigation: AuthNavigation }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const submit = () => {
    const next: typeof errors = {};
    if (!isStrongPassword(password)) next.password = 'Минимум 8 символов';
    if (confirm !== password) next.confirm = 'Пароли не совпадают';
    setErrors(next);
    if (Object.keys(next).length === 0) navigation.navigate('LogIn');
  };

  return (
    <AuthLayout title="Set Password" onBack={navigation.goBack}>
      <Text style={styles.lorem}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Text>

      <View style={styles.form}>
        <AuthInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••••••"
          secure
          error={errors.password}
        />
        <AuthInput
          label="Confirm Password"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="••••••••••••"
          secure
          error={errors.confirm}
        />
      </View>

      <View style={styles.button}>
        <PrimaryButton title="Create New Password" onPress={submit} width="75%" />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  lorem: { fontSize: 10, color: colors.muted, lineHeight: 14 },
  form: { marginTop: 20 },
  button: { marginTop: 24 },
});
