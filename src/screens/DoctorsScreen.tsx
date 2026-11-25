import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DoctorCard from '../components/DoctorCard';
import { MainNav } from '../navigation';
import {
  Appointment,
  DAYS,
  DOCTORS,
  TIMES,
  TODAY,
  dayName,
  getDoctor,
  hourLabel,
  timeMinutes,
  useApp,
} from '../store';

const BLUE = '#2F66F5';
const LIGHT = '#CBD5FF';
const TEXT_DARK = '#1B1B1F';

const ratingValue = (rating: string) => Number(rating.replace(',', '.'));

export default function DoctorsScreen({ nav }: { nav: MainNav }) {
  const { user, favorites, toggleFavorite, appointments, setAppointmentStatus } = useApp();
  const [selectedDay, setSelectedDay] = useState(TODAY);
  const [query, setQuery] = useState('');
  const [sortByRating, setSortByRating] = useState(false);
  const searchRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const active = appointments.filter((a) => a.status !== 'cancelled');
  const dayAppointments = active.filter((a) => a.day === selectedDay);

  const doctors = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? DOCTORS.filter(
          (d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q),
        )
      : [...DOCTORS];
    if (sortByRating) list.sort((a, b) => ratingValue(b.rating) - ratingValue(a.rating));
    return list;
  }, [query, sortByRating]);

  const hours = [...new Set([...TIMES, ...dayAppointments.map((a) => hourLabel(a.time))])].sort(
    (a, b) => timeMinutes(a) - timeMinutes(b),
  );
  const timeline = hours.flatMap((time): { key: string; time: string; a?: Appointment }[] => {
    const inHour = dayAppointments
      .filter((a) => hourLabel(a.time) === time)
      .sort((a, b) => timeMinutes(a.time) - timeMinutes(b.time));
    return inHour.length > 0 ? inHour.map((a) => ({ key: a.id, time, a })) : [{ key: time, time }];
  });

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.userBtn}
            onPress={() => nav.openTab('profile')}
            accessibilityRole="button"
            accessibilityLabel="My profile"
          >
            {user.avatarUri ? (
              <Image source={{ uri: user.avatarUri }} style={styles.userAvatar} />
            ) : (
              <View style={[styles.userAvatar, styles.avatarEmpty]}>
                <Ionicons name="person" size={20} color={BLUE} />
              </View>
            )}
            <View style={styles.greetingBox}>
              <Text style={styles.greeting}>Hi, WelcomeBack</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {user.name}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={nav.openNotifications}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={20} color={BLUE} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roundBtn, { marginLeft: 8 }]}
            onPress={nav.openSettings}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings-outline" size={20} color={BLUE} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => nav.openDoctors(false)}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="stethoscope" size={26} color={BLUE} />
            <Text style={styles.quickText}>Doctors</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => nav.openDoctors(true)}
            accessibilityRole="button"
          >
            <Ionicons name="heart-outline" size={26} color={BLUE} />
            <Text style={styles.quickText}>Favorite</Text>
          </TouchableOpacity>
          <View style={styles.searchBox}>
            <TouchableOpacity
              style={[styles.filterBtn, sortByRating && styles.filterBtnOn]}
              onPress={() => setSortByRating((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel="Sort by rating"
              accessibilityState={{ selected: sortByRating }}
            >
              <Ionicons name="options-outline" size={18} color={sortByRating ? '#fff' : TEXT_DARK} />
            </TouchableOpacity>
            <TextInput
              ref={searchRef}
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search doctor"
              placeholderTextColor="#7C9CFF"
              returnKeyType="search"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => (query ? setQuery('') : searchRef.current?.focus())}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={query ? 'Clear search' : 'Search'}
            >
              <Ionicons name={query ? 'close' : 'search'} size={22} color={BLUE} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.calendarBlock}>
          <View style={styles.daysRow}>
            {DAYS.map((d) => {
              const filled = active.some((a) => a.day === d.num);
              const selected = d.num === selectedDay;
              return (
                <TouchableOpacity
                  key={d.num}
                  onPress={() => setSelectedDay(d.num)}
                  style={[
                    styles.dayChip,
                    filled && styles.dayChipFilled,
                    selected && (filled ? styles.dayChipSelectedFilled : styles.dayChipSelected),
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.dayNum, filled && styles.dayTextWhite]}>{d.num}</Text>
                  <Text style={[styles.dayLabel, filled && styles.dayTextWhite]}>{d.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.scheduleCard}>
            <Text style={styles.todayText}>
              {dayName(selectedDay)}
              {selectedDay === TODAY ? ' - Today' : ''}
            </Text>

            {timeline.map(({ key, time, a }) => {
              const doctor = a ? getDoctor(a.doctorId) : null;
              return (
                <View key={key} style={styles.timeRow}>
                  <Text style={styles.timeLabel}>{time}</Text>
                  {a && doctor ? (
                    <TouchableOpacity
                      style={styles.appointment}
                      activeOpacity={0.8}
                      onPress={() => nav.openAppointment(a.id)}
                    >
                      <View style={styles.appointmentTop}>
                        <Text style={styles.appointmentName} numberOfLines={1}>
                          {doctor.name}
                        </Text>
                        <TouchableOpacity
                          style={[styles.miniCircle, a.status === 'complete' && styles.miniCircleOn]}
                          hitSlop={8}
                          onPress={() =>
                            setAppointmentStatus(a.id, a.status === 'complete' ? 'upcoming' : 'complete')
                          }
                          accessibilityRole="button"
                          accessibilityLabel={
                            a.status === 'complete' ? 'Mark as not completed' : 'Mark as completed'
                          }
                        >
                          <Ionicons name="checkmark" size={12} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.miniCircle, { marginLeft: 8 }]}
                          hitSlop={8}
                          onPress={() => nav.openCancel(a.id)}
                          accessibilityRole="button"
                          accessibilityLabel="Cancel appointment"
                        >
                          <Ionicons name="close" size={12} color="#fff" />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.appointmentDesc}>{a.note}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.dashedLine} />
                  )}
                </View>
              );
            })}

            {dayAppointments.length === 0 ? (
              <TouchableOpacity onPress={() => nav.openDoctors(false)} style={styles.bookLink}>
                <Text style={styles.bookLinkText}>No appointments. Book a visit</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={styles.list}>
          {doctors.length === 0 ? <Text style={styles.empty}>No doctors found</Text> : null}
          {doctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              favorite={favorites.includes(doc.id)}
              onPress={() => nav.openDoctor(doc.id)}
              onToggleFavorite={() => toggleFavorite(doc.id)}
              onChat={() => nav.openChat(doc.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => nav.openTab('home')} accessibilityLabel="home tab">
          <Ionicons name="home" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.openTab('chat')} accessibilityLabel="chat tab">
          <Ionicons name="chatbubble-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.openTab('profile')} accessibilityLabel="profile tab">
          <Ionicons name="person-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.openTab('calendar')} accessibilityLabel="calendar tab">
          <Ionicons name="calendar-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 110 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 54) + 8,
  },
  userBtn: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: LIGHT },
  avatarEmpty: { alignItems: 'center', justifyContent: 'center' },
  greetingBox: { flex: 1, marginLeft: 10 },
  greeting: { fontSize: 12, color: BLUE },
  userName: { fontSize: 15, fontWeight: '600', color: TEXT_DARK },
  roundBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 14,
  },
  quickBtn: { alignItems: 'center', marginRight: 14 },
  quickText: { fontSize: 11, color: BLUE, marginTop: 2 },
  searchBox: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: LIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingRight: 12,
  },
  filterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnOn: { backgroundColor: BLUE },
  searchInput: { flex: 1, paddingHorizontal: 8, paddingVertical: 0, fontSize: 14, color: TEXT_DARK },

  calendarBlock: {
    backgroundColor: LIGHT,
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 14,
  },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayChip: {
    width: 46,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayChipFilled: { backgroundColor: BLUE },
  dayChipSelected: { borderColor: BLUE },
  dayChipSelectedFilled: { borderColor: '#fff' },
  dayNum: { fontSize: 22, fontWeight: '500', color: TEXT_DARK },
  dayLabel: { fontSize: 11, color: TEXT_DARK },
  dayTextWhite: { color: '#fff' },

  scheduleCard: {
    marginTop: 14,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 14,
  },
  todayText: { alignSelf: 'flex-end', fontSize: 12, color: BLUE, marginBottom: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'center', minHeight: 36, paddingVertical: 3 },
  timeLabel: { width: 44, fontSize: 12, color: BLUE },
  dashedLine: {
    flex: 1,
    height: 1,
    borderTopWidth: 1,
    borderColor: BLUE,
    borderStyle: 'dashed',
  },
  appointment: {
    flex: 1,
    backgroundColor: LIGHT,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  appointmentTop: { flexDirection: 'row', alignItems: 'center' },
  appointmentName: { flex: 1, fontSize: 13, fontWeight: '600', color: BLUE },
  miniCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#8A97C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCircleOn: { backgroundColor: BLUE },
  appointmentDesc: { fontSize: 12, color: TEXT_DARK, marginTop: 2 },
  bookLink: { alignSelf: 'center', marginTop: 6 },
  bookLinkText: { fontSize: 12, fontWeight: '600', color: BLUE },

  list: { paddingHorizontal: 12, paddingTop: 14 },
  empty: { textAlign: 'center', color: TEXT_DARK, marginVertical: 16 },

  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    height: 58,
    borderRadius: 29,
    backgroundColor: BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
