import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

// Общее состояние приложения до появления бэкенда: всё хранится в памяти.

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  reviews: number;
  photo: string;
  experience: number;
  hours: string;
  about: string;
}

export const DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Olivia Turner, M.D.',
    specialty: 'Dermato-Endocrinology',
    rating: '5',
    reviews: 60,
    photo: 'https://i.pravatar.cc/200?img=47',
    experience: 15,
    hours: 'Mon-Sat / 9:00 AM - 4:00 PM',
    about:
      'Focus: the impact of hormonal imbalances on skin conditions, specializing in acne, hirsutism, and other skin disorders.',
  },
  {
    id: '2',
    name: 'Dr. Alexander Bennett, Ph.D.',
    specialty: 'Dermato-Genetics',
    rating: '4,5',
    reviews: 40,
    photo: 'https://i.pravatar.cc/200?img=12',
    experience: 12,
    hours: 'Mon-Fri / 10:00 AM - 5:00 PM',
    about:
      'Focus: inherited skin disorders, genetic testing and personalised treatment plans for chronic conditions.',
  },
  {
    id: '3',
    name: 'Dr. Sophia Martinez, Ph.D.',
    specialty: 'Cosmetic Bioengineering',
    rating: '5',
    reviews: 150,
    photo: 'https://i.pravatar.cc/200?img=45',
    experience: 10,
    hours: 'Mon-Sat / 9:00 AM - 3:00 PM',
    about:
      'Focus: skin regeneration, scar treatment and modern non-invasive cosmetic procedures.',
  },
  {
    id: '4',
    name: 'Dr. Michael Davidson, M.D.',
    specialty: 'Nano-Dermatology',
    rating: '4,8',
    reviews: 90,
    photo: 'https://i.pravatar.cc/200?img=15',
    experience: 18,
    hours: 'Tue-Sat / 9:00 AM - 4:00 PM',
    about:
      'Focus: targeted drug delivery for psoriasis, eczema and photodermatitis using nano-formulations.',
  },
];

export const DAYS = [
  { num: 9, label: 'MON', name: 'Monday' },
  { num: 10, label: 'TUE', name: 'Tuesday' },
  { num: 11, label: 'WED', name: 'Wednesday' },
  { num: 12, label: 'THU', name: 'Thursday' },
  { num: 13, label: 'FRI', name: 'Friday' },
  { num: 14, label: 'SAT', name: 'Saturday' },
];
export const TODAY = 11;
export const TIMES = ['9 AM', '10 AM', '11 AM', '12 PM'];

export type AppointmentStatus = 'upcoming' | 'complete' | 'cancelled';

export interface Appointment {
  id: string;
  doctorId: string;
  day: number;
  time: string;
  note: string;
  status: AppointmentStatus;
}

export interface ChatMessage {
  id: string;
  from: 'me' | 'doctor';
  time: string;
  text?: string;
  /** Голосовое сообщение: длительность в секундах */
  voice?: number;
  /** Файл записи; у моковых сообщений врача его нет */
  audioUri?: string;
  imageUri?: string;
}

export interface User {
  name: string;
  phone: string;
  email: string;
  dob: string;
  avatarUri?: string;
}

export interface Card {
  id: string;
  holder: string;
  last4: string;
  expiry: string;
}

const INITIAL_USER: User = {
  name: 'John Doe',
  phone: '+123 567 89000',
  email: 'johndoe@example.com',
  dob: '',
  avatarUri: 'https://i.pravatar.cc/200?img=33',
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    doctorId: '1',
    day: 11,
    time: '10 AM',
    note: 'Treatment and prevention of skin and photodermatitis.',
    status: 'upcoming',
  },
  { id: 'a2', doctorId: '2', day: 13, time: '11 AM', note: 'Follow-up visit.', status: 'upcoming' },
  { id: 'a3', doctorId: '3', day: 14, time: '9 AM', note: 'Consultation.', status: 'upcoming' },
  { id: 'a4', doctorId: '4', day: 9, time: '12 PM', note: 'Patch test results.', status: 'complete' },
];

const INITIAL_CHATS: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: '1',
      from: 'me',
      time: '09:00',
      text: 'Hello, doctor! I have had a red itchy rash on my forearm for about a week. Should I be worried?',
    },
    {
      id: '2',
      from: 'doctor',
      time: '09:30',
      text: 'Hello! Please send me a photo of the rash. Have you started using any new creams or detergents recently?',
    },
    {
      id: '3',
      from: 'me',
      time: '09:43',
      text: 'I switched to a new sunscreen ten days ago. The rash gets worse after I spend time outside.',
    },
    { id: '4', from: 'doctor', time: '09:50', voice: 170 },
    { id: '5', from: 'me', time: '09:55', text: 'Thank you, I will stop using it.' },
  ],
};

interface Store {
  user: User;
  updateUser: (patch: Partial<User>) => void;
  favorites: string[];
  toggleFavorite: (doctorId: string) => void;
  appointments: Appointment[];
  book: (doctorId: string, day: number, time: string, note: string) => void;
  setAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  chats: Record<string, ChatMessage[]>;
  addMessage: (doctorId: string, message: ChatMessage) => void;
  cards: Card[];
  addCard: (card: Omit<Card, 'id'>) => void;
  /** 'card:<id>' | 'apple' | 'paypal' | 'google' */
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const Ctx = createContext<Store | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(INITIAL_USER);
  const [favorites, setFavorites] = useState<string[]>(['1', '4']);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [cards, setCards] = useState<Card[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('apple');

  const updateUser = useCallback((patch: Partial<User>) => setUser((u) => ({ ...u, ...patch })), []);

  const toggleFavorite = useCallback(
    (id: string) =>
      setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [],
  );

  const book = useCallback(
    (doctorId: string, day: number, time: string, note: string) =>
      setAppointments((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, doctorId, day, time, note, status: 'upcoming' },
      ]),
    [],
  );

  const setAppointmentStatus = useCallback(
    (id: string, status: AppointmentStatus) =>
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a))),
    [],
  );

  const addMessage = useCallback(
    (doctorId: string, message: ChatMessage) =>
      setChats((prev) => ({ ...prev, [doctorId]: [...(prev[doctorId] ?? []), message] })),
    [],
  );

  const addCard = useCallback((card: Omit<Card, 'id'>) => {
    const id = `c-${Date.now()}`;
    setCards((prev) => [...prev, { ...card, id }]);
    setPaymentMethod(`card:${id}`);
  }, []);

  const value = useMemo<Store>(
    () => ({
      user,
      updateUser,
      favorites,
      toggleFavorite,
      appointments,
      book,
      setAppointmentStatus,
      chats,
      addMessage,
      cards,
      addCard,
      paymentMethod,
      setPaymentMethod,
    }),
    [
      user,
      updateUser,
      favorites,
      toggleFavorite,
      appointments,
      book,
      setAppointmentStatus,
      chats,
      addMessage,
      cards,
      addCard,
      paymentMethod,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): Store {
  const store = useContext(Ctx);
  if (!store) throw new Error('useApp must be used inside AppProvider');
  return store;
}

export const getDoctor = (id: string): Doctor => DOCTORS.find((d) => d.id === id) ?? DOCTORS[0];

export const dayName = (num: number): string => {
  const d = DAYS.find((x) => x.num === num);
  return d ? `${d.num} ${d.name}` : String(num);
};

/** Выбор фото из галереи; undefined — если пользователь отменил. */
export async function pickImage(square = false): Promise<string | undefined> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: square,
    aspect: [1, 1],
    quality: 0.7,
  });
  return result.canceled ? undefined : result.assets[0].uri;
}
