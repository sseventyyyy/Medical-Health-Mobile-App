import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DoctorCard from '../components/DoctorCard';
import { DOCTORS } from '../data/doctors';
import { Doctor } from '../../../shared/types/doctor';

type SortBy = 'rating' | 'priceAsc' | 'experience';

const TIME_SLOTS = ['10:00', '12:30', '15:00', '17:30'];

export default function DoctorsScreen() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('rating');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['1']);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[0]);

  const toggleFavorite = (doctorId: string) => {
    setFavorites((prev) =>
      prev.includes(doctorId)
        ? prev.filter((id) => id !== doctorId)
        : [...prev, doctorId]
    );
  };

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = DOCTORS.filter((doc) => {
      if (onlyFavorites && !favorites.includes(doc.id)) return false;
      if (!query) return true;
      return (
        doc.fullName.toLowerCase().includes(query) ||
        doc.specialty.toLowerCase().includes(query) ||
        doc.clinic.toLowerCase().includes(query)
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      return b.rating - a.rating;
    });
  }, [search, sortBy, onlyFavorites, favorites]);

  const handleBookAppointment = () => {
    if (!selectedDoctor) return;
    Alert.alert(
      'Запись подтверждена',
      `Вы записаны к врачу ${selectedDoctor.fullName} (${selectedDoctor.specialty}) в ${selectedSlot}.`
    );
    setSelectedDoctor(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Врачи</Text>
        <Pressable
          style={[styles.favFilterBtn, onlyFavorites && styles.favFilterBtnActive]}
          onPress={() => setOnlyFavorites((prev) => !prev)}
        >
          <Text
            style={[
              styles.favFilterText,
              onlyFavorites && styles.favFilterTextActive,
            ]}
          >
            ♥ Избранные ({favorites.length})
          </Text>
        </Pressable>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Поиск врача, специальности или клиники..."
        placeholderTextColor="#9CA3AF"
        style={styles.searchInput}
      />

      <View style={styles.sortRow}>
        <Pressable
          style={[styles.sortChip, sortBy === 'rating' && styles.sortChipActive]}
          onPress={() => setSortBy('rating')}
        >
          <Text
            style={[styles.sortText, sortBy === 'rating' && styles.sortTextActive]}
          >
            ★ Рейтинг
          </Text>
        </Pressable>
        <Pressable
          style={[styles.sortChip, sortBy === 'priceAsc' && styles.sortChipActive]}
          onPress={() => setSortBy('priceAsc')}
        >
          <Text
            style={[
              styles.sortText,
              sortBy === 'priceAsc' && styles.sortTextActive,
            ]}
          >
            ₸ Дешевле
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.sortChip,
            sortBy === 'experience' && styles.sortChipActive,
          ]}
          onPress={() => setSortBy('experience')}
        >
          <Text
            style={[
              styles.sortText,
              sortBy === 'experience' && styles.sortTextActive,
            ]}
          >
            Опыт
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Врачи не найдены</Text>
            <Text style={styles.emptySubtitle}>
              Попробуйте изменить запрос или отключить фильтр избранного
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            onPress={(doc) => {
              setSelectedSlot(TIME_SLOTS[0]);
              setSelectedDoctor(doc);
            }}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}
      />

      <Modal
        visible={Boolean(selectedDoctor)}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDoctor(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {selectedDoctor && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalAvatar}>
                    <Text style={styles.modalAvatarText}>
                      {selectedDoctor.fullName.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.modalHeaderInfo}>
                    <Text style={styles.modalName}>{selectedDoctor.fullName}</Text>
                    <Text style={styles.modalSpecialty}>
                      {selectedDoctor.specialty}
                    </Text>
                    <Text style={styles.modalMeta}>
                      {selectedDoctor.clinic} · ★ {selectedDoctor.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>
                      {selectedDoctor.experienceYears} лет
                    </Text>
                    <Text style={styles.statLabel}>Стаж работы</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>
                      {selectedDoctor.price.toLocaleString('ru-RU')} ₸
                    </Text>
                    <Text style={styles.statLabel}>Приём</Text>
                  </View>
                </View>

                <Text style={styles.sectionLabel}>Выберите время приёма</Text>
                <View style={styles.slotsRow}>
                  {TIME_SLOTS.map((slot) => {
                    const active = selectedSlot === slot;
                    return (
                      <Pressable
                        key={slot}
                        style={[styles.slotChip, active && styles.slotChipActive]}
                        onPress={() => setSelectedSlot(slot)}
                      >
                        <Text
                          style={[
                            styles.slotText,
                            active && styles.slotTextActive,
                          ]}
                        >
                          {slot}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.cancelBtn}
                    onPress={() => setSelectedDoctor(null)}
                  >
                    <Text style={styles.cancelBtnText}>Закрыть</Text>
                  </Pressable>
                  <Pressable
                    style={styles.bookBtn}
                    onPress={handleBookAppointment}
                  >
                    <Text style={styles.bookBtnText}>Записаться</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#F5F7FB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  favFilterBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  favFilterBtnActive: {
    backgroundColor: '#2F6BFF',
    borderColor: '#2F6BFF',
  },
  favFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  favFilterTextActive: {
    color: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  sortChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortChipActive: {
    backgroundColor: '#E6F0FF',
    borderColor: '#2F6BFF',
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  sortTextActive: {
    color: '#2F6BFF',
  },
  list: {
    paddingBottom: 28,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2F6BFF',
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalSpecialty: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F6BFF',
    marginTop: 2,
  },
  modalMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    borderRadius: 14,
    padding: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  slotChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F5F7FB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  slotChipActive: {
    backgroundColor: '#2F6BFF',
    borderColor: '#2F6BFF',
  },
  slotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  slotTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  bookBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#2F6BFF',
    alignItems: 'center',
  },
  bookBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});