import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileLayout from '../../profile/components/ProfileLayout';
import BottomTabBar from '../../profile/components/BottomTabBar';
import { colors } from '../../profile/theme';
import { MainNav } from '../navigation';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface AppNotification {
  id: string;
  group: string;
  icon: IconName;
  title: string;
  text: string;
  ago: string;
  read: boolean;
  target: 'calendar' | 'chat';
}

const INITIAL: AppNotification[] = [
  {
    id: '1',
    group: 'Today',
    icon: 'calendar-outline',
    title: 'Scheduled Appointment',
    text: 'Your appointment with Dr. Olivia Turner is confirmed for Wednesday, 11 at 10:00 AM.',
    ago: '2 M',
    read: true,
    target: 'calendar',
  },
  {
    id: '2',
    group: 'Today',
    icon: 'calendar-number-outline',
    title: 'Scheduled Change',
    text: 'Dr. Alexander Bennett moved your visit to Friday, 13 at 11:30 AM. Please confirm the new time.',
    ago: '2 H',
    read: false,
    target: 'calendar',
  },
  {
    id: '3',
    group: 'Today',
    icon: 'document-text-outline',
    title: 'Medical Notes',
    text: 'Dr. Olivia Turner added notes and a skincare plan after your last visit.',
    ago: '3 H',
    read: true,
    target: 'chat',
  },
  {
    id: '4',
    group: 'Yesterday',
    icon: 'calendar-outline',
    title: 'Scheduled Appointment',
    text: 'Reminder: your consultation with Dr. Sophia Martinez is tomorrow at 9:00 AM.',
    ago: '1 D',
    read: true,
    target: 'calendar',
  },
  {
    id: '5',
    group: '15 April',
    icon: 'chatbox-ellipses-outline',
    title: 'Medical History Update',
    text: 'Your medical history was updated with the results of the patch test.',
    ago: '5 D',
    read: true,
    target: 'chat',
  },
];

let saved = INITIAL;

export default function NotificationsScreen({ nav }: { nav: MainNav }) {
  const [items, setItemsState] = useState(saved);
  const [onlyNew, setOnlyNew] = useState(false);

  const setItems = (update: (prev: AppNotification[]) => AppNotification[]) =>
    setItemsState((prev) => (saved = update(prev)));

  const groups = useMemo(() => {
    const map = new Map<string, AppNotification[]>();
    for (const n of items) {
      if (onlyNew && n.read) continue;
      const list = map.get(n.group) ?? [];
      list.push(n);
      map.set(n.group, list);
    }
    return [...map.entries()];
  }, [items, onlyNew]);

  const hasUnread = items.some((n) => !n.read);
  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const open = (n: AppNotification) => {
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    nav.openTab(n.target);
  };

  return (
    <ProfileLayout
      title="Notification"
      onBack={nav.back}
      right={
        <Pressable
          style={[styles.news, onlyNew && styles.newsOn]}
          onPress={() => setOnlyNew((v) => !v)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Show only unread"
          accessibilityState={{ selected: onlyNew }}
        >
          <Text style={[styles.newsText, onlyNew && styles.newsTextOn]}>News</Text>
          {hasUnread ? <View style={[styles.newsDot, onlyNew && styles.newsDotOn]} /> : null}
        </Pressable>
      }
      footer={<BottomTabBar active="home" onPress={nav.openTab} />}
    >
      {groups.length === 0 ? <Text style={styles.empty}>No new notifications</Text> : null}
      {groups.map(([group, list], index) => (
        <View key={group} style={styles.group}>
          <View style={styles.groupHead}>
            <View style={styles.groupChip}>
              <Text style={styles.groupChipText}>{group}</Text>
            </View>
            {index === 0 ? (
              <Pressable
                onPress={markAll}
                disabled={!hasUnread}
                hitSlop={8}
                accessibilityRole="button"
              >
                <Text style={[styles.markAll, !hasUnread && styles.markAllDone]}>Mark all</Text>
              </Pressable>
            ) : null}
          </View>

          {list.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => open(n)}
              style={[styles.item, !n.read && styles.itemUnread]}
              accessibilityRole="button"
              accessibilityLabel={`${n.title}${n.read ? '' : ', unread'}`}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={n.icon} size={22} color={colors.white} />
              </View>
              <View style={styles.itemBody}>
                <View style={styles.itemTop}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {n.title}
                  </Text>
                  <Text style={styles.ago}>{n.ago}</Text>
                </View>
                <Text style={styles.itemText} numberOfLines={3}>
                  {n.text}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      ))}
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  news: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.iconBg,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newsText: { fontSize: 11, color: colors.text },
  newsDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  newsOn: { backgroundColor: colors.primary },
  newsTextOn: { color: colors.white },
  newsDotOn: { backgroundColor: colors.white },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 24 },

  group: { marginBottom: 8 },
  groupHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  groupChip: {
    backgroundColor: colors.iconBg,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  groupChipText: { fontSize: 15, fontWeight: '500', color: colors.primary },
  markAll: { fontSize: 12, fontWeight: '600', color: colors.primary },
  markAllDone: { opacity: 0.4 },

  item: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  itemUnread: { backgroundColor: colors.iconBg },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBody: { flex: 1 },
  itemTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  itemTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.text },
  ago: { fontSize: 11, color: colors.text, marginTop: 3 },
  itemText: { fontSize: 12, lineHeight: 16, color: colors.muted, marginTop: 2 },
});
