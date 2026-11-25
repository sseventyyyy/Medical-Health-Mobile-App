import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ProfileLayout from '../../profile/components/ProfileLayout';
import BottomTabBar from '../../profile/components/BottomTabBar';
import { colors } from '../../profile/theme';
import DoctorCard from '../components/DoctorCard';
import { MainNav } from '../navigation';
import { DOCTORS, useApp } from '../store';

interface Props {
  nav: MainNav;
  favoritesOnly?: boolean;
}

export default function DoctorsListScreen({ nav, favoritesOnly = false }: Props) {
  const { favorites, toggleFavorite } = useApp();
  const [onlyFav, setOnlyFav] = useState(favoritesOnly);

  const list = onlyFav ? DOCTORS.filter((d) => favorites.includes(d.id)) : DOCTORS;

  return (
    <ProfileLayout
      title={onlyFav ? 'Favorite' : 'Doctors'}
      onBack={nav.back}
      footer={<BottomTabBar active="home" onPress={nav.openTab} />}
    >
      <View style={styles.tabs}>
        {[false, true].map((fav) => (
          <Pressable
            key={String(fav)}
            onPress={() => setOnlyFav(fav)}
            style={[styles.tab, onlyFav === fav && styles.tabActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: onlyFav === fav }}
          >
            <Text style={[styles.tabText, onlyFav === fav && styles.tabTextActive]}>
              {fav ? 'Favorite' : 'All Doctors'}
            </Text>
          </Pressable>
        ))}
      </View>

      {list.length === 0 ? (
        <Text style={styles.empty}>
          No favorite doctors yet. Tap the heart on a doctor card to add one.
        </Text>
      ) : null}

      {list.map((doc) => (
        <DoctorCard
          key={doc.id}
          doctor={doc}
          favorite={favorites.includes(doc.id)}
          onPress={() => nav.openDoctor(doc.id)}
          onToggleFavorite={() => toggleFavorite(doc.id)}
          onChat={() => nav.openChat(doc.id)}
        />
      ))}
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  tab: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  tabTextActive: { color: colors.white },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 24, lineHeight: 20 },
});
