import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileLayout from '../../profile/components/ProfileLayout';
import PrimaryButton from '../../profile/components/PrimaryButton';
import { colors, radius } from '../../profile/theme';
import { MainNav } from '../navigation';
import { getDoctor, useApp } from '../store';

interface Props {
  nav: MainNav;
  appointmentId: string;
}

export default function ReviewScreen({ nav, appointmentId }: Props) {
  const { appointments, favorites, toggleFavorite, addReview } = useApp();
  const a = appointments.find((x) => x.id === appointmentId);
  const [rating, setRating] = useState(a?.review?.rating ?? 0);
  const [comment, setComment] = useState(a?.review?.comment ?? '');
  const [error, setError] = useState('');

  if (!a) {
    return (
      <ProfileLayout title="Review" onBack={nav.back}>
        <Text style={styles.text}>This appointment no longer exists.</Text>
      </ProfileLayout>
    );
  }

  const doctor = getDoctor(a.doctorId);
  const fav = favorites.includes(doctor.id);

  const submit = () => {
    if (rating === 0) {
      setError('Please rate your visit');
      return;
    }
    addReview(a.id, { rating, comment: comment.trim() });
    nav.back();
  };

  return (
    <ProfileLayout
      title="Review"
      onBack={nav.back}
      footer={<PrimaryButton title={a.review ? 'Update Review' : 'Add Review'} onPress={submit} width="100%" />}
    >
      <Text style={styles.text}>
        Your feedback helps other patients choose a doctor and helps the clinic improve its care.
      </Text>

      <View style={styles.center}>
        <Image source={{ uri: doctor.photo }} style={styles.photo} />
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>

        <View style={styles.rateRow}>
          <Pressable
            style={styles.heart}
            onPress={() => toggleFavorite(doctor.id)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={16} color={colors.primary} />
          </Pressable>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable
                key={n}
                onPress={() => {
                  setRating(n);
                  setError('');
                }}
                hitSlop={4}
                accessibilityRole="button"
                accessibilityLabel={`${n} star${n > 1 ? 's' : ''}`}
                accessibilityState={{ selected: n <= rating }}
              >
                <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={26} color={colors.primary} />
              </Pressable>
            ))}
          </View>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={setComment}
        placeholder="Enter your comment here..."
        placeholderTextColor={colors.placeholder}
        multiline
        maxLength={300}
        textAlignVertical="top"
      />
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 13, lineHeight: 19, color: colors.text },
  center: { alignItems: 'center', marginTop: 20, marginBottom: 20 },
  photo: { width: 130, height: 130, borderRadius: 65, backgroundColor: colors.iconBg },
  name: { fontSize: 18, fontWeight: '700', color: colors.primary, marginTop: 12, textAlign: 'center' },
  specialty: { fontSize: 13, color: colors.text, marginTop: 2 },
  rateRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },
  heart: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stars: { flexDirection: 'row', gap: 6 },
  error: { fontSize: 12, color: colors.error, marginTop: 8 },
  input: {
    minHeight: 130,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.input,
    padding: 14,
    fontSize: 14,
    color: colors.text,
  },
});
