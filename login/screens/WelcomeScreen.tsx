import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Logo from '../../src/components/Logo';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';
import { AuthNavigation } from '../types';

interface Props {
  navigation: AuthNavigation;
}

/** Welcome из макета (раздел 2): логотип, описание и кнопки Log In / Sign Up. */
export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Logo variant="onWhite" size={110} />
      </View>

      <View style={styles.bottom}>
        <Text style={styles.text}>
          Book visits with certified dermatologists, chat with your doctor and keep your skin
          health records in one place.
        </Text>
        <View style={styles.buttons}>
          <PrimaryButton title="Log In" onPress={() => navigation.navigate('LogIn')} width="60%" />
          <PrimaryButton
            title="Sign Up"
            onPress={() => navigation.navigate('SignUp')}
            width="60%"
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 32 },
  logo: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 48 },
  bottom: { flex: 1, alignItems: 'center' },
  text: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.text,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 24,
  },
  buttons: { width: '100%', gap: 12 },
});
