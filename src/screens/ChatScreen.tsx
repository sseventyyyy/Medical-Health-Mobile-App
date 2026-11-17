import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar, { Tab } from '../../profile/components/BottomTabBar';
import { colors } from '../../profile/theme';

interface Message {
  id: string;
  from: 'me' | 'doctor';
  time: string;
  text?: string;
  /** Голосовое сообщение: длительность "мм:сс" */
  voice?: string;
}

// Моковая переписка до появления API.
const INITIAL: Message[] = [
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
  { id: '4', from: 'doctor', time: '09:50', voice: '02:50' },
  { id: '5', from: 'me', time: '09:55', text: 'Thank you, I will stop using it.' },
];

const TOP_PADDING =
  Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 24) + 12 : 56;

const timeNow = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, () => setVisible(true));
    const hide = Keyboard.addListener(hideEvent, () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return visible;
}

interface Props {
  onBack: () => void;
  onTabPress?: (tab: Tab) => void;
  doctorName?: string;
  doctorAvatar?: string;
}

export default function ChatScreen({
  onBack,
  onTabPress,
  doctorName = 'Dr. Olivia Turner',
  doctorAvatar = 'https://i.pravatar.cc/200?img=47',
}: Props) {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const keyboardOpen = useKeyboardVisible();
  const listRef = useRef<FlatList<Message>>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    },
    [],
  );

  // "Dr. Olivia Turner" → "Dr. Olivia"
  const shortName = doctorName.split(' ').slice(0, 2).join(' ');
  const canSend = draft.trim().length > 0;
  const soon = (title: string) => () => Alert.alert(title, 'Раздел в разработке');

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `me-${Date.now()}`, from: 'me', text, time: timeNow() }]);
    setDraft('');

    // Демо до появления бэкенда: врач «печатает» и присылает шаблонный ответ.
    setTyping(true);
    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `dr-${Date.now()}`,
          from: 'doctor',
          text: 'Thank you, I got your message. I will reply as soon as I can.',
          time: timeNow(),
        },
      ]);
    }, 1500);
  };

  const renderItem = ({ item }: { item: Message }) => {
    const mine = item.from === 'me';
    const playing = playingId === item.id;
    return (
      <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
        {item.voice ? (
          // Пока только интерфейс: воспроизведение звука появится вместе с бэкендом.
          <View style={[styles.bubble, styles.bubbleTheirs, styles.voice]}>
            <Image source={{ uri: doctorAvatar }} style={styles.voiceAvatar} />
            <Pressable
              onPress={() => setPlayingId(playing ? null : item.id)}
              style={styles.play}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={playing ? 'Pause voice message' : 'Play voice message'}
            >
              <Ionicons name={playing ? 'pause' : 'play'} size={12} color={colors.white} />
            </Pressable>
            <View style={styles.track}>
              <View style={styles.trackFill} />
              <View style={styles.trackKnob} />
            </View>
            <Text style={styles.voiceDuration}>{item.voice}</Text>
          </View>
        ) : (
          <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
            <Text style={styles.bubbleText}>{item.text}</Text>
          </View>
        )}
        <Text style={styles.time}>{item.time}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {doctorName}
        </Text>
        <Pressable
          style={styles.headerBtn}
          onPress={soon('Audio call')}
          accessibilityRole="button"
          accessibilityLabel="Audio call"
        >
          <Ionicons name="call" size={14} color={colors.primary} />
        </Pressable>
        <Pressable
          style={styles.headerBtn}
          onPress={soon('Video call')}
          accessibilityRole="button"
          accessibilityLabel="Video call"
        >
          <Ionicons name="videocam" size={14} color={colors.primary} />
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        extraData={playingId}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          typing ? <Text style={styles.typing}>{`${shortName} is typing...`}</Text> : undefined
        }
      />

      <View style={styles.inputBar}>
        <Pressable
          style={styles.attach}
          onPress={soon('Attachments')}
          accessibilityRole="button"
          accessibilityLabel="Attach file"
        >
          <Ionicons name="attach" size={20} color={colors.primary} />
        </Pressable>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="Write Here..."
            placeholderTextColor={colors.placeholder}
            multiline
            maxLength={1000}
          />
          <Pressable
            onPress={soon('Voice message')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Record voice message"
          >
            <Ionicons name="mic-outline" size={20} color={colors.primary} />
          </Pressable>
        </View>
        <Pressable
          style={[styles.send, !canSend && styles.sendDisabled]}
          onPress={send}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Ionicons name="send" size={18} color={colors.white} />
        </Pressable>
      </View>

      {keyboardOpen ? null : (
        <View style={styles.footer}>
          <BottomTabBar active="chat" onPress={onTabPress} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingTop: TOP_PADDING,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  title: { flex: 1, marginLeft: 4, fontSize: 18, fontWeight: '700', color: colors.white },
  headerBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingVertical: 16 },
  row: { maxWidth: '78%', marginBottom: 12 },
  rowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  rowTheirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  bubbleMine: { backgroundColor: colors.iconBg },
  bubbleTheirs: { backgroundColor: colors.primaryLight },
  bubbleText: { fontSize: 13, lineHeight: 18, color: colors.text },
  time: { fontSize: 11, color: colors.placeholder, marginTop: 4 },

  voice: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 230, paddingVertical: 8 },
  voiceAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.iconBg },
  play: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: { flex: 1, height: 2, backgroundColor: colors.iconBg, justifyContent: 'center' },
  trackFill: { width: '70%', height: 2, backgroundColor: colors.primary },
  trackKnob: {
    position: 'absolute',
    left: '70%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  voiceDuration: { fontSize: 10, color: colors.placeholder },

  typing: { fontSize: 12, fontWeight: '600', color: colors.primary, marginTop: 4 },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.iconBg,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  attach: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
  },
  input: { flex: 1, maxHeight: 100, paddingVertical: 8, fontSize: 14, color: colors.text },
  send: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.5 },

  footer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24, backgroundColor: colors.white },
});
