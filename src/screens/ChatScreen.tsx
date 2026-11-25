import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
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
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import BottomTabBar from '../../profile/components/BottomTabBar';
import { colors } from '../../profile/theme';
import CallModal, { formatSeconds } from '../components/CallModal';
import { MainNav } from '../navigation';
import { ChatMessage, getDoctor, pickImage, useApp } from '../store';

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
  nav: MainNav;
  doctorId: string;
}

export default function ChatScreen({ nav, doctorId }: Props) {
  const { chats, addMessage } = useApp();
  const doctor = getDoctor(doctorId);
  const messages = chats[doctor.id] ?? [];
  // "Dr. Olivia Turner, M.D." → "Dr. Olivia Turner" / "Dr. Olivia"
  const doctorName = doctor.name.split(',')[0];
  const shortName = doctorName.split(' ').slice(0, 2).join(' ');

  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [call, setCall] = useState<'audio' | 'video' | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const keyboardOpen = useKeyboardVisible();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Воспроизведение: настоящие записи — через expo-audio,
  // моковое голосовое врача (без файла) — имитация по таймеру.
  const player = useAudioPlayer(null);
  const playerStatus = useAudioPlayerStatus(player);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [mockPos, setMockPos] = useState(0);
  const playing = messages.find((m) => m.id === playingId);

  // Запись голосового сообщения
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 500);
  const [recording, setRecording] = useState(false);

  useEffect(
    () => () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    },
    [],
  );

  useEffect(() => {
    const sub = player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish) setPlayingId(null);
    });
    return () => sub.remove();
  }, [player]);

  const mockDuration = playing && !playing.audioUri ? (playing.voice ?? 0) : 0;
  useEffect(() => {
    if (!mockDuration) return;
    // togglePlay обнуляет mockPos перед стартом, поэтому локальный счётчик тоже идёт с нуля.
    let pos = 0;
    const tick = setInterval(() => {
      pos += 0.5;
      setMockPos(pos);
      if (pos >= mockDuration) setPlayingId(null);
    }, 500);
    return () => clearInterval(tick);
  }, [mockDuration, playingId]);

  const stopPlayback = () => {
    try {
      player.pause();
    } catch {
      // плеер ещё ничего не загружал
    }
    setPlayingId(null);
  };

  const togglePlay = (m: ChatMessage) => {
    if (playingId === m.id) {
      stopPlayback();
      return;
    }
    stopPlayback();
    setMockPos(0);
    if (m.audioUri) {
      player.replace({ uri: m.audioUri });
      player.play();
    }
    setPlayingId(m.id);
  };

  const progressOf = (m: ChatMessage): number => {
    if (playingId !== m.id) return 0;
    if (m.audioUri) {
      return playerStatus.duration ? Math.min(1, playerStatus.currentTime / playerStatus.duration) : 0;
    }
    return m.voice ? Math.min(1, mockPos / m.voice) : 0;
  };

  // Демо до появления бэкенда: врач «печатает» и присылает шаблонный ответ.
  const replyLater = () => {
    setTyping(true);
    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      setTyping(false);
      addMessage(doctor.id, {
        id: `dr-${Date.now()}`,
        from: 'doctor',
        text: 'Thank you, I got your message. I will reply as soon as I can.',
        time: timeNow(),
      });
    }, 1500);
  };

  const sendMine = (part: Partial<ChatMessage>, withReply = true) => {
    addMessage(doctor.id, { id: `me-${Date.now()}`, from: 'me', time: timeNow(), ...part });
    if (withReply) replyLater();
  };

  const canSend = draft.trim().length > 0;
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    sendMine({ text });
  };

  const attach = async () => {
    try {
      const uri = await pickImage();
      if (uri) sendMine({ imageUri: uri });
    } catch {
      Alert.alert('Attachments', 'Could not open the photo library.');
    }
  };

  const startRecording = async () => {
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Microphone', 'Allow microphone access in settings to record voice messages.');
        return;
      }
      stopPlayback();
      Keyboard.dismiss();
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setRecording(true);
    } catch {
      Alert.alert('Voice message', 'Could not start recording.');
    }
  };

  const finishRecording = async (shouldSend: boolean) => {
    const seconds = Math.max(1, Math.round(recorderState.durationMillis / 1000));
    setRecording(false);
    try {
      await recorder.stop();
      // Возвращаем обычный режим, иначе на iOS звук пойдёт в разговорный динамик.
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });
    } catch {
      return;
    }
    if (shouldSend && recorder.uri) sendMine({ voice: seconds, audioUri: recorder.uri });
  };

  const endCall = (seconds: number) => {
    const kind = call === 'video' ? 'Video call' : 'Audio call';
    setCall(null);
    sendMine({ text: seconds > 0 ? `${kind} · ${formatSeconds(seconds)}` : `${kind} · cancelled` }, false);
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const mine = item.from === 'me';
    const isPlaying = playingId === item.id;
    const progress = progressOf(item);
    const bubble = [styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs];
    return (
      <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
        {item.voice ? (
          <View style={[bubble, styles.voice]}>
            {mine ? null : <Image source={{ uri: doctor.photo }} style={styles.voiceAvatar} />}
            <Pressable
              onPress={() => togglePlay(item)}
              style={styles.play}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? 'Pause voice message' : 'Play voice message'}
            >
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={12} color={colors.white} />
            </Pressable>
            <View style={styles.track}>
              <View style={[styles.trackFill, { width: `${progress * 100}%` }]} />
              <View style={[styles.trackKnob, { left: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.voiceDuration}>
              {formatSeconds(isPlaying ? progress * item.voice : item.voice)}
            </Text>
          </View>
        ) : item.imageUri ? (
          <Pressable
            onPress={() => setPreview(item.imageUri ?? null)}
            accessibilityRole="imagebutton"
            accessibilityLabel="Open photo"
          >
            <Image source={{ uri: item.imageUri }} style={styles.photo} />
          </Pressable>
        ) : (
          <View style={bubble}>
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
        <Pressable onPress={nav.back} hitSlop={12} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </Pressable>
        <Pressable style={styles.titleWrap} onPress={() => nav.openDoctor(doctor.id)}>
          <Text style={styles.title} numberOfLines={1}>
            {doctorName}
          </Text>
        </Pressable>
        <Pressable
          style={styles.headerBtn}
          onPress={() => setCall('audio')}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Audio call"
        >
          <Ionicons name="call" size={14} color={colors.primary} />
        </Pressable>
        <Pressable
          style={styles.headerBtn}
          onPress={() => setCall('video')}
          hitSlop={6}
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
        extraData={[playingId, mockPos, playerStatus.currentTime]}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <Text style={styles.emptyChat}>{`Say hello to ${shortName} and describe your problem.`}</Text>
        }
        ListFooterComponent={
          typing ? <Text style={styles.typing}>{`${shortName} is typing...`}</Text> : undefined
        }
      />

      {recording ? (
        <View style={styles.inputBar}>
          <Pressable
            style={styles.attach}
            onPress={() => finishRecording(false)}
            accessibilityRole="button"
            accessibilityLabel="Delete recording"
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </Pressable>
          <View style={styles.inputWrap}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>
              {`Recording ${formatSeconds(recorderState.durationMillis / 1000)}`}
            </Text>
          </View>
          <Pressable
            style={styles.send}
            onPress={() => finishRecording(true)}
            accessibilityRole="button"
            accessibilityLabel="Send voice message"
          >
            <Ionicons name="send" size={18} color={colors.white} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.inputBar}>
          <Pressable
            style={styles.attach}
            onPress={attach}
            accessibilityRole="button"
            accessibilityLabel="Attach photo"
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
              onPress={startRecording}
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
      )}

      {keyboardOpen ? null : (
        <View style={styles.footer}>
          <BottomTabBar active="chat" onPress={nav.openTab} />
        </View>
      )}

      <CallModal
        visible={call !== null}
        video={call === 'video'}
        name={doctorName}
        avatar={doctor.photo}
        onEnd={endCall}
      />

      <Modal
        visible={preview !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPreview(null)}
      >
        <Pressable style={styles.previewBackdrop} onPress={() => setPreview(null)}>
          {preview ? (
            <Image source={{ uri: preview }} style={styles.previewImage} resizeMode="contain" />
          ) : null}
        </Pressable>
      </Modal>
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
  titleWrap: { flex: 1, marginLeft: 4 },
  title: { fontSize: 18, fontWeight: '700', color: colors.white },
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
  emptyChat: { textAlign: 'center', color: colors.muted, marginTop: 32, fontSize: 13 },
  row: { maxWidth: '78%', marginBottom: 12 },
  rowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  rowTheirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  bubbleMine: { backgroundColor: colors.iconBg },
  bubbleTheirs: { backgroundColor: colors.primaryLight },
  bubbleText: { fontSize: 13, lineHeight: 18, color: colors.text },
  time: { fontSize: 11, color: colors.placeholder, marginTop: 4 },
  photo: { width: 190, height: 190, borderRadius: 16, backgroundColor: colors.primaryLight },

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
  track: { flex: 1, height: 2, backgroundColor: colors.white, justifyContent: 'center' },
  trackFill: { height: 2, backgroundColor: colors.primary },
  trackKnob: {
    position: 'absolute',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  voiceDuration: { fontSize: 10, color: colors.muted, minWidth: 30, textAlign: 'right' },

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
  recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error, marginRight: 8 },
  recText: { fontSize: 14, color: colors.text },
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

  previewBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center' },
  previewImage: { width: '100%', height: '80%' },
});
