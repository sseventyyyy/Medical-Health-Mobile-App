import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DOCTORS } from '../features/doctors/data/doctors';

interface Props {
  onNavigateDoctors?: () => void;
  onNavigateLogin?: () => void;
}

export default function HomeScreen({
  onNavigateDoctors,
  onNavigateLogin,
}: Props) {
  const topDoctors = DOCTORS.slice(0, 2);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.badge}>Medical Health App</Text>
        <Text style={styles.title}>Забота о здоровье рядом</Text>
        <Text style={styles.subtitle}>
          Находите проверенных врачей, сравнивайте стоимость приёма и записывайтесь
          в пару касаний.
        </Text>

        <View style={styles.heroActions}>
          <Pressable style={styles.primaryBtn} onPress={onNavigateDoctors}>
            <Text style={styles.primaryBtnText}>Найти врача</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={onNavigateLogin}>
            <Text style={styles.secondaryBtnText}>Войти</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Направления</Text>
      <View style={styles.grid}>
        <Pressable style={styles.tile} onPress={onNavigateDoctors}>
          <Text style={styles.tileIcon}>🩺</Text>
          <Text style={styles.tileTitle}>Терапия и осмотр</Text>
          <Text style={styles.tileDesc}>Первичная консультация</Text>
        </Pressable>

        <Pressable style={styles.tile} onPress={onNavigateDoctors}>
          <Text style={styles.tileIcon}>❤️</Text>
          <Text style={styles.tileTitle}>Кардиология</Text>
          <Text style={styles.tileDesc}>Сердце и сосуды</Text>
        </Pressable>

        <Pressable style={styles.tile} onPress={onNavigateDoctors}>
          <Text style={styles.tileIcon}>✨</Text>
          <Text style={styles.tileTitle}>Дерматология</Text>
          <Text style={styles.tileDesc}>Здоровье кожи</Text>
        </Pressable>

        <Pressable style={styles.tile} onPress={onNavigateLogin}>
          <Text style={styles.tileIcon}>👤</Text>
          <Text style={styles.tileTitle}>Кабинет</Text>
          <Text style={styles.tileDesc}>Вход и профиль</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Популярные врачи</Text>
        <Pressable onPress={onNavigateDoctors}>
          <Text style={styles.linkText}>Все врачи →</Text>
        </Pressable>
      </View>

      {topDoctors.map((doc) => (
        <Pressable
          key={doc.id}
          style={styles.miniDoctorCard}
          onPress={onNavigateDoctors}
        >
          <View style={styles.miniAvatar}>
            <Text style={styles.miniAvatarText}>{doc.fullName.charAt(0)}</Text>
          </View>
          <View style={styles.miniInfo}>
            <Text style={styles.miniName}>{doc.fullName}</Text>
            <Text style={styles.miniSpecialty}>
              {doc.specialty} · ★ {doc.rating.toFixed(1)}
            </Text>
            <Text style={styles.miniClinic}>{doc.clinic}</Text>
          </View>
          <Text style={styles.miniPrice}>
            {doc.price.toLocaleString('ru-RU')} ₸
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FF',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  heroCard: {
    backgroundColor: '#2F6BFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#E6F0FF',
    marginBottom: 16,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#2F6BFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2F6BFF',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  tile: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  tileIcon: {
    fontSize: 22,
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  tileDesc: {
    fontSize: 12,
    color: '#475569',
  },
  miniDoctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  miniAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  miniAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2F6BFF',
  },
  miniInfo: {
    flex: 1,
  },
  miniName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  miniSpecialty: {
    fontSize: 12,
    color: '#2F6BFF',
    marginTop: 1,
  },
  miniClinic: {
    fontSize: 12,
    color: '#475569',
  },
  miniPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
});