import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ProfileLayout from '../components/ProfileLayout';
import Avatar from '../components/Avatar';
import MenuRow from '../components/MenuRow';
import BottomTabBar from '../components/BottomTabBar';
import LogoutModal from '../components/LogoutModal';
import { colors } from '../theme';
import { ProfileNavigation } from '../types';

interface Props {
  navigation: ProfileNavigation;
  name?: string;
  avatarUri?: string;
}

export default function ProfileScreen({
  navigation,
  name = 'John Doe',
  avatarUri,
}: Props) {
  const [showLogout, setShowLogout] = useState(false);
  const soon = (title: string) => () => Alert.alert(title, 'Раздел в разработке');

  return (
    <ProfileLayout
      title="My Profile"
      onBack={navigation.goBack}
      footer={<BottomTabBar active="profile" onPress={navigation.onTabPress} />}
    >
      <View style={styles.top}>
        <Avatar uri={avatarUri} />
        <Text style={styles.name}>{name}</Text>
      </View>

      <MenuRow icon="person-outline" label="Profile" onPress={() => navigation.navigate('EditProfile')} />
      <MenuRow icon="heart-outline" label="Favorite" onPress={soon('Favorite')} />
      <MenuRow icon="wallet-outline" label="Payment Method" onPress={soon('Payment Method')} />
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