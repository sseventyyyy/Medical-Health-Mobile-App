import React, { useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { ProfileNavigation } from '../types';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TOP_PADDING =
  Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 24) + 12 : 56;

const ANSWER =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin malesuada eleifend fermentum. Donec condimentum, nunc at rhoncus faucibus, ex nisi laoreet ipsum.';

const FAQ = [
  { q: 'Lorem ipsum dolor sit amet?', a: ANSWER },
  { q: 'Consectetur adipiscing elit?', a: ANSWER },
  { q: 'Proin malesuada eleifend fermentum?', a: ANSWER },
  { q: 'Donec condimentum nunc at rhoncus?', a: ANSWER },
  { q: 'Morbi quis rhoncus mi?', a: ANSWER },
  { q: 'Nullam lacinia eros sit amet?', a: ANSWER },
];

const CONTACTS: { icon: IconName; label: string; url: string }[] = [
  { icon: 'headset-outline', label: 'Customer Service', url: 'tel:+1234567890' },
  { icon: 'globe-outline', label: 'Website', url: 'https://example.com' },
  { icon: 'logo-whatsapp', label: 'Whatsapp', url: 'https://wa.me/1234567890' },
  { icon: 'logo-facebook', label: 'Facebook', url: 'https://facebook.com' },
  { icon: 'logo-instagram', label: 'Instagram', url: 'https://instagram.com' },
];

type Tab = 'faq' | 'contact';

export default function HelpCenterScreen({ navigation }: { navigation: ProfileNavigation }) {
  const [tab, setTab] = useState<Tab>('faq');
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faq = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? FAQ.filter((i) => i.q.toLowerCase().includes(q)) : FAQ;
  }, [query]);

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Ошибка', 'Не удалось открыть ссылку');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable onPress={navigation.goBack} hitSlop={12} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </Pressable>
        <Text style={styles.title}>Help Center</Text>
      </View>

      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.primary} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <View style={styles.sheet}>
        <View style={styles.tabs}>
          {(['faq', 'contact'] as Tab[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tab, tab === t && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'faq' ? 'FAQ' : 'Contact Us'}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {tab === 'faq' ? (
            faq.length === 0 ? (
              <Text style={styles.empty}>Ничего не найдено</Text>
            ) : (
              faq.map((item, i) => {
                const open = openIndex === i;
                return (
                  <Pressable
                    key={item.q}
                    onPress={() => setOpenIndex(open ? null : i)}
                    style={styles.faqItem}
                  >
                    <View style={styles.faqHead}>
                      <Text style={styles.faqQ}>{item.q}</Text>
                      <Ionicons
                        name={open ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={colors.primary}
                      />
                    </View>
                    {open && <Text style={styles.faqA}>{item.a}</Text>}
                  </Pressable>
                );
              })
            )
          ) : (
            CONTACTS.map((c) => (
              <Pressable
                key={c.label}
                onPress={() => openLink(c.url)}
                style={({ pressed }) => [styles.contact, pressed && { opacity: 0.6 }]}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name={c.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.contactLabel}>{c.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.primary} />
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary, paddingTop: TOP_PADDING },
  header: { height: 40, justifyContent: 'center', alignItems: 'center' },
  back: { position: 'absolute', left: 16 },
  title: { fontSize: 18, fontWeight: '700', color: colors.white },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    height: 44,
    marginHorizontal: 24,
    marginTop: 16,
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  sheet: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 20,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
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
  list: { paddingBottom: 32 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 24 },
  faqItem: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  faqHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQ: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.text, paddingRight: 8 },
  faqA: { fontSize: 11, lineHeight: 16, color: colors.muted, marginTop: 10 },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactLabel: { flex: 1, fontSize: 14, color: colors.text },
});