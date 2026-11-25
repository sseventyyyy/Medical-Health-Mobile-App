import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import ProfileLayout from '../components/ProfileLayout';
import Field from '../components/Field';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';
import { ProfileNavigation } from '../types';
import { isStrongPassword } from '../utils';
import { useApp } from '../../src/store';

type Key = 'current' | 'next' | 'confirm';

export default function PasswordManagerScreen({
  navigation,
}: {
  navigation: ProfileNavigation;
}) {
  const { user } = useApp();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  // «Forgot Password?»: задаём новый пароль без ввода текущего.
  const [forgot, setForgot] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});

  const submit = () => {
    const e: Partial<Record<Key, string>> = {};
    if (!forgot && !current) e.current = 'Введите текущий пароль';
    if (!isStrongPassword(next)) e.next = 'Минимум 8 символов';
    if (confirm !== next) e.confirm = 'Пароли не совпадают';
    setErrors(e);
    if (Object.keys(e).length === 0) {
      Alert.alert('Готово', 'Пароль изменён');
      navigation.goBack();
    }
  };

  const toggleForgot = () => {
    setForgot((v) => !v);
    setCurrent('');
    setErrors({});
  };

  return (
    <ProfileLayout
      title={forgot ? 'Set Password' : 'Password Manager'}
      onBack={navigation.goBack}
      footer={
        <PrimaryButton
          title={forgot ? 'Create New Password' : 'Change Password'}
          onPress={submit}
          width="100%"
        />
      }
    >
      {forgot ? (
        <Text style={styles.hint}>
          {`Create a new password for ${user.email}. You do not need the current one.`}
        </Text>
      ) : (
        <Field
          label="Current Password"
          value={current}
          onChangeText={setCurrent}
          placeholder="••••••••••••"
          secure
          error={errors.current}
        />
      )}
      <Pressable style={styles.forgot} onPress={toggleForgot} hitSlop={8} accessibilityRole="button">
        <Text style={styles.forgotText}>
          {forgot ? 'I remember my password' : 'Forgot Password?'}
        </Text>
      </Pressable>
      <Field
        label="New Password"
        value={next}
        onChangeText={setNext}
        placeholder="••••••••••••"
        secure
        error={errors.next}
      />
      <Field
        label="Confirm New Password"
        value={confirm}
        onChangeText={setConfirm}
        placeholder="••••••••••••"
        secure
        error={errors.confirm}
      />
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 12, lineHeight: 17, color: colors.muted, marginBottom: 16 },
  forgot: { alignSelf: 'flex-end', marginTop: -8, marginBottom: 18 },
  forgotText: { fontSize: 11, fontWeight: '700', color: colors.primary },
});
