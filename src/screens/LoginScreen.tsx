import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface Props {
  onSuccessLogin?: () => void;
}

export default function LoginScreen({ onSuccessLogin }: Props) {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleLogin = () => {
    if (!contact.trim() || !password.trim()) {
      setErrorText('Введите email или телефон и пароль');
      return;
    }

    if (password.trim().length < 4) {
      setErrorText('Пароль должен содержать минимум 4 символа');
      return;
    }

    setErrorText('');
    Alert.alert('Вход выполнен', `Добро пожаловать, ${contact.trim()}!`, [
      {
        text: 'Продолжить',
        onPress: onSuccessLogin,
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Вход</Text>
        <Text style={styles.subtitle}>
          Войдите в аккаунт Medical Health App для управления записями
        </Text>

        <Text style={styles.label}>Email или телефон</Text>
        <TextInput
          value={contact}
          onChangeText={(text) => {
            setContact(text);
            if (errorText) setErrorText('');
          }}
          placeholder="name@example.com или +7 777 000 00 00"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Пароль</Text>
        <View style={styles.passwordRow}>
          <TextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorText) setErrorText('');
            }}
            placeholder="Введите пароль"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <Pressable
            style={styles.eyeBtn}
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Text style={styles.eyeText}>{showPassword ? 'Скрыть' : 'Показать'}</Text>
          </Pressable>
        </View>

        {Boolean(errorText) && <Text style={styles.errorText}>{errorText}</Text>}

        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && styles.submitBtnPressed,
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.submitBtnText}>Войти</Text>
        </Pressable>

        <Pressable
          style={styles.forgotBtn}
          onPress={() =>
            Alert.alert(
              'Восстановление пароля',
              'Инструкция по сбросу пароля отправлена на указанный контакт.'
            )
          }
        >
          <Text style={styles.forgotText}>Забыли пароль?</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#111827',
    marginBottom: 14,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#111827',
  },
  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  eyeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2F6BFF',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: '#2F6BFF',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnPressed: {
    opacity: 0.9,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  forgotBtn: {
    alignItems: 'center',
    marginTop: 14,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2F6BFF',
  },
});