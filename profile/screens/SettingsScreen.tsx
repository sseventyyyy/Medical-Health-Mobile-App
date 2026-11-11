import React from 'react';
import { Alert } from 'react-native';
import ProfileLayout from '../components/ProfileLayout';
import MenuRow from '../components/MenuRow';
import { ProfileNavigation } from '../types';

export default function SettingsScreen({ navigation }: { navigation: ProfileNavigation }) {
  const confirmDelete = () =>
    Alert.alert('Delete Account', 'Вы уверены? Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: navigation.onLogout },
    ]);

  return (
    <ProfileLayout title="Settings" onBack={navigation.goBack}>
      <MenuRow
        filled={false}
        icon="bulb-outline"
        label="Notification Setting"
        onPress={() => navigation.navigate('NotificationSetting')}
      />
      <MenuRow
        filled={false}
        icon="key-outline"
        label="Password Manager"
        onPress={() => navigation.navigate('PasswordManager')}
      />
      <MenuRow
        filled={false}
        icon="person-outline"
        label="Delete Account"
        onPress={confirmDelete}
      />
    </ProfileLayout>
  );
}