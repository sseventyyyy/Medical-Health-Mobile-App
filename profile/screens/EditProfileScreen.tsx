import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileLayout from '../components/ProfileLayout';
import Avatar from '../components/Avatar';
import Field from '../components/Field';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';
import { ProfileNavigation } from '../types';
import { formatDob, isEmail, isPhone } from '../utils';

type Key = 'name' | 'phone' | 'email' | 'dob';

interface Props {
  navigation: ProfileNavigation;
  avatarUri?: string;
}

export default function EditProfileScreen({ navigation, avatarUri }: Props) {
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('+123 567 89000');
  const [email, setEmail] = useState('johndoe@example.com');
  const [dob, setDob] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});

  const submit = () => {
    const next: Partial<Record<Key, string>> = {};
    if (name.trim().length < 2) next.name = 'Введите имя';
    if (!isPhone(phone)) next.phone = 'Некорректный номер';
    if (!isEmail(email)) next.email = 'Некорректный email';
    if (dob && dob.replace(/\D/g, '').length !== 8) next.dob = 'Формат DD / MM / YYYY';
    setErrors(next);
    if (Object.keys(next).length === 0) {
      Alert.alert('Готово', 'Профиль обновлён');
      navigation.goBack();
    }
  };

  return (
    <ProfileLayout
      title="Profile"
      onBack={navigation.goBack}
      right={
        <View style={styles.gear}>
          <Ionicons name="settings" size={12} color={colors.white} />
        </View>
      }
      footer={<PrimaryButton title="Update Profile" onPress={submit} />}
    >
      <View style={styles.avatar}>
        <Avatar uri={avatarUri} />
      </View>
      <Field label="Full Name" value={name} onChangeText={setName} error={errors.name} />
      <Field
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        error={errors.phone}
      />
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        error={errors.email}
      />
      <Field
        label="Date Of Birth"
        value={dob}
        onChangeText={(t) => setDob(formatDob(t))}
        placeholder="DD / MM / YYYY"
        keyboardType="number-pad"
        maxLength={14}
        error={errors.dob}
      />
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', marginBottom: 20 },
  gear: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});