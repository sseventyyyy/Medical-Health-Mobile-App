import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import ProfileLayout from '../components/ProfileLayout';
import Field from '../components/Field';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';
import { ProfileNavigation } from '../types';
import { isStrongPassword } from '../utils';

type Key = 'current' | 'next' | 'confirm';

export default function PasswordManagerScreen({
  navigation,
}: {
  navigation: ProfileNavigation;
}) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});

  const submit = () => {
    const e: Partial<Record<Key, string>> = {};
    if (!current) e.current = 'Введите текущий пароль';
    if (!isStrongPassword(next)) e.next = 'Минимум 8 символов';
    if (confirm !== next) e.confirm = 'Пароли не совпадают';
    setErrors(e);
    if (Object.keys(e).length === 0) {
      Alert.alert('Готово', 'Пароль изменён');
      navigation.goBack();
    }
  };

  return (
    <ProfileLayout
      title="Password Manager"
      onBack={navigation.goBack}
      footer={<PrimaryButton title="Change Password" onPress={submit} width="100%" />}
    >
      <Field
        label="Current Password"
        value={current}
        onChangeText={setCurrent}
        placeholder="••••••••••••"
        secure
        error={errors.current}
      />
      <Pressable
        style={styles.forgot}
        onPress={() => Alert.alert('Forgot Password?', 'Восстановление пароля в разработке')}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
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
  forgot: { alignSelf: 'flex-end', marginTop: -8, marginBottom: 18 },
  forgotText: { fontSize: 11, fontWeight: '700', color: colors.primary },
});