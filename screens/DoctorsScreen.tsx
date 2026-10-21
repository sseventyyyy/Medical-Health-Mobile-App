import React, { useState } from 'react';
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

const BLUE = '#2F66F5';
const LIGHT = '#CBD5FF';
const TEXT_DARK = '#1B1B1F';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  reviews: number;
  photo: string;
};

const DOCTORS: Doctor[] = [
  {gi
    id: '1',
    name: 'Dr. Olivia Turner, M.D.',
    specialty: 'Dermato-Endocrinology',
    rating: '5',
    reviews: 60,
    photo: 'https://i.pravatar.cc/200?img=47',
  },
  {
    id: '2',
    name: 'Dr. Alexander Bennett, Ph.D.',
    specialty: 'Dermato-Genetics',
    rating: '4,5',
    reviews: 40,
    photo: 'https://i.pravatar.cc/200?img=12',
  },
  {
    id: '3',
    name: 'Dr. Sophia Martinez, Ph.D.',
    specialty: 'Cosmetic Bioengineering',
    rating: '5',
    reviews: 150,
    photo: 'https://i.pravatar.cc/200?img=45',
  },
  {
    id: '4',
    name: 'Dr. Michael Davidson, M.D.',
    specialty: 'Nano-Dermatology',
    rating: '4,8',
    reviews: 90,
    photo: 'https://i.pravatar.cc/200?img=15',
  },
];

const DAYS = [
  { num: 9, label: 'MON', filled: false },
  { num: 10, label: 'TUE', filled: false },
  { num: 11, label: 'WED', filled: true },
  { num: 12, label: 'THU', filled: false },
  { num: 13, label: 'FRI', filled: true },
  { num: 14, label: 'SAT', filled: true },
];

const TIMES = ['9 AM', '10 AM', '11 AM', '12 AM'];

export default function DoctorsScreen() {
  const [favorites, setFavorites] = useState<string[]>(['1', '4']);
  const [selectedDay, setSelectedDay] = useState(11);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Шапка */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/200?img=33' }}
            style={styles.userAvatar}
          />
          <View style={styles.greetingBox}>
            <Text style={styles.greeting}>Hi, WelcomeBack</Text>
            <Text style={styles.userName}>John Doe</Text>
          </View>
          <TouchableOpacity style={styles.roundBtn}>
            <Ionicons name="notifications-outline" size={20} color={BLUE} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roundBtn, { marginLeft: 8 }]}>
            <Ionicons name="settings-outline" size={20} color={BLUE} />
          </TouchableOpacity>
        </View>

        {/* Быстрые кнопки + поиск */}
        <View style={styles.searchRow}>
          <TouchableOpacity style={styles.quickBtn}>
            <MaterialCommunityIcons name="stethoscope" size={26} color={BLUE} />
            <Text style={styles.quickText}>Doctors</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn}>
            <Ionicons name="heart-outline" size={26} color={BLUE} />
            <Text style={styles.quickText}>Favorite</Text>
          </TouchableOpacity>
          <View style={styles.searchBox}>
            <View style={styles.filterBtn}>
              <Ionicons name="options-outline" size={18} color={TEXT_DARK} />
            </View>
            <TextInput style={styles.searchInput} />
            <Ionicons name="search" size={22} color={BLUE} />
          </View>
        </View>

        {/* Календарь */}
        <View style={styles.calendarBlock}>
          <View style={styles.daysRow}>
            {DAYS.map((d) => {
              const active = d.filled;
              const selected = d.num === selectedDay;
              return (
                <TouchableOpacity
                  key={d.num}
                  onPress={() => setSelectedDay(d.num)}
                  style={[
                    styles.dayChip,
                    active && styles.dayChipFilled,
                    selected && styles.dayChipSelected,
                  ]}
                >
                  <Text style={[styles.dayNum, active && styles.dayTextWhite]}>
                    {d.num}
                  </Text>
                  <Text style={[styles.dayLabel, active && styles.dayTextWhite]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.scheduleCard}>
            <Text style={styles.todayText}>11 Wednesday - Today</Text>

            {TIMES.map((time, i) => (
              <View key={time} style={styles.timeRow}>
                <Text style={styles.timeLabel}>{time}</Text>
                <View style={styles.dashedLine} />
              </View>
            ))}

            {/* Запись поверх сетки времени */}
            <View style={styles.appointment}>
              <View style={styles.appointmentTop}>
                <Text style={styles.appointmentName}>Dr. Olivia Turner, M.D.</Text>
                <View style={styles.appointmentActions}>
                  <View style={styles.miniCircle}>
                    <Ionicons name="checkmark" size={10} color="#fff" />
                  </View>
                  <View style={[styles.miniCircle, { marginLeft: 4 }]}>
                    <Ionicons name="close" size={10} color="#fff" />
                  </View>
                </View>
              </View>
              <Text style={styles.appointmentDesc}>
                Treatment and prevention of skin and photodermatitis.
              </Text>
            </View>
          </View>
        </View>

        {/* Список врачей */}
        <View style={styles.list}>
          {DOCTORS.map((doc) => {
            const fav = favorites.includes(doc.id);
            return (
              <View key={doc.id} style={styles.card}>
                <Image source={{ uri: doc.photo }} style={styles.docPhoto} />
                <View style={styles.cardRight}>
                  <View style={styles.nameBox}>
                    <Text style={styles.docName} numberOfLines={1}>
                      {doc.name}
                    </Text>
                    <Text style={styles.docSpecialty}>{doc.specialty}</Text>
                  </View>
                  <View style={styles.cardBottom}>
                    <View style={styles.pill}>
                      <Ionicons name="star-outline" size={13} color={BLUE} />
                      <Text style={styles.pillText}>{doc.rating}</Text>
                    </View>
                    <View style={[styles.pill, { marginLeft: 8 }]}>
                      <Ionicons name="chatbubble-outline" size={13} color={BLUE} />
                      <Text style={styles.pillText}>{doc.reviews}</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity style={styles.smallCircle}>
                      <Text style={styles.questionMark}>?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.smallCircle, { marginLeft: 6 }]}
                      onPress={() => toggleFavorite(doc.id)}
                    >
                      <Ionicons
                        name={fav ? 'heart' : 'heart-outline'}
                        size={14}
                        color={BLUE}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Нижняя навигация */}
      <View style={styles.tabBar}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 110 },

  // Шапка
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 54) + 8,
  },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: LIGHT },
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

  // Поиск
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
  searchInput: { flex: 1, paddingHorizontal: 8, fontSize: 14, color: TEXT_DARK },

  // Календарь
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
  dayChipSelected: { borderColor: '#fff' },
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
  timeRow: { flexDirection: 'row', alignItems: 'center', height: 36 },
  timeLabel: { width: 44, fontSize: 12, color: BLUE },
  dashedLine: {
    flex: 1,
    height: 1,
    borderTopWidth: 1,
    borderColor: BLUE,
    borderStyle: 'dashed',
  },
  appointment: {
    position: 'absolute',
    left: 58,
    right: 14,
    top: 8 + 18 + 36 + 6, // на уровне 10 AM
    backgroundColor: LIGHT,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  appointmentTop: { flexDirection: 'row', alignItems: 'center' },
  appointmentName: { flex: 1, fontSize: 13, fontWeight: '600', color: BLUE },
  appointmentActions: { flexDirection: 'row' },
  miniCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#8A97C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentDesc: { fontSize: 12, color: TEXT_DARK, marginTop: 2 },

  // Список врачей
  list: { paddingHorizontal: 12, paddingTop: 14 },
  card: {
    flexDirection: 'row',
    backgroundColor: LIGHT,
    borderRadius: 18,
    padding: 10,
    marginBottom: 10,
  },
  docPhoto: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff' },
  cardRight: { flex: 1, marginLeft: 10 },
  nameBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  docName: { fontSize: 14, fontWeight: '700', color: BLUE },
  docSpecialty: { fontSize: 12, color: TEXT_DARK },
  cardBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 22,
    minWidth: 48,
    justifyContent: 'center',
  },
  pillText: { fontSize: 12, color: TEXT_DARK, marginLeft: 4 },
  smallCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionMark: { fontSize: 13, fontWeight: '600', color: BLUE },

  // Нижняя навигация
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
