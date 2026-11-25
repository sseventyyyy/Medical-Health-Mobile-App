import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProfileLayout from '../components/ProfileLayout';
import Avatar from '../components/Avatar';
import MenuRow from '../components/MenuRow';
import BottomTabBar from '../components/BottomTabBar';
import LogoutModal from '../components/LogoutModal';
import { colors } from '../theme';
import { ProfileNavigation } from '../types';
import { pickImage, useApp } from '../../src/store';

interface Props {
  navigation: ProfileNavigation;
}

export default function ProfileScreen({ navigation }: Props) {
  const { user, updateUser } = useApp();
  const [showLogout, setShowLogout] = useState(false);

  const changePhoto = async () => {
    const uri = await pickImage(true).catch(() => undefined);
    if (uri) updateUser({ avatarUri: uri });
  };

  return (
    <ProfileLayout
      title="My Profile"
      onBack={navigation.goBack}
      footer={<BottomTabBar active="profile" onPress={navigation.onTabPress} />}
    >
      <View style={styles.top}>
        <Avatar uri={user.avatarUri} onEdit={changePhoto} />
        <Text style={styles.name}>{user.name}</Text>
      </View>

      <MenuRow icon="person-outline" label="Profile" onPress={() => navigation.navigate('EditProfile')} />
      <MenuRow icon="heart-outline" label="Favorite" onPress={() => navigation.onOpenFavorites?.()} />
      <MenuRow icon="wallet-outline" label="Payment Method" onPress={() => navigation.navigate('PaymentMethod')} />
      <MenuRow icon="lock-closed-outline" label="Privacy Policy" onPress={() => navigation.navigate('PrivacyPolicy')} />
      <MenuRow icon="settings-outline" label="Settings" onPress={() => navigation.navigate('Settings')} />
      <MenuRow icon="help-circle-outline" label="Help" onPress={() => navigation.navigate('HelpCenter')} />
      <MenuRow icon="log-out-outline" label="Logout" chevron={false} onPress={() => setShowLogout(true)} />

      <LogoutModal
        visible={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={() => {
          setShowLogout(false);
          navigation.onLogout();
        }}
      />
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'center', marginBottom: 20 },
  name: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 10 },
});
