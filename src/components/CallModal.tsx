import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../profile/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export const formatSeconds = (total: number): string => {
  const s = Math.max(0, Math.floor(total));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

interface Props {
  visible: boolean;
  video: boolean;
  name: string;
  avatar: string;
  /** seconds — сколько длился разговор (0, если не успели соединиться) */
  onEnd: (seconds: number) => void;
}

/**
 * Экран звонка. Пока нет бэкенда, соединение имитируется:
 * через 2 секунды «врач отвечает» и запускается таймер.
 */
export default function CallModal({ visible, video, name, avatar, onEnd }: Props) {
  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(video);
  const [cameraOn, setCameraOn] = useState(true);

  // Сбрасываем состояние при каждом новом открытии (во время рендера, а не в эффекте).
  const [session, setSession] = useState({ visible, video });
  if (session.visible !== visible || session.video !== video) {
    setSession({ visible, video });
    if (visible) {
      setConnected(false);
      setSeconds(0);
      setMuted(false);
      setSpeaker(video);
      setCameraOn(true);
    }
  }

  useEffect(() => {
    if (!visible) return;
    const connect = setTimeout(() => setConnected(true), 2000);
    return () => clearTimeout(connect);
  }, [visible, video]);

  useEffect(() => {
    if (!visible || !connected) return;
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, [visible, connected]);

  const end = () => onEnd(connected ? seconds : 0);

  const control = (icon: IconName, label: string, on: boolean, onPress: () => void) => (
    <Pressable
      onPress={onPress}
      style={[styles.control, on && styles.controlOn]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: on }}
    >
      <Ionicons name={icon} size={22} color={on ? colors.primary : colors.white} />
    </Pressable>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={end} statusBarTranslucent>
      <View style={styles.root}>
        <View style={styles.center}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.status}>
            {connected ? formatSeconds(seconds) : video ? 'Video calling...' : 'Calling...'}
          </Text>
          {video && connected ? (
            <Text style={styles.hint}>{cameraOn ? 'Your camera is on' : 'Your camera is off'}</Text>
          ) : null}
        </View>

        <View style={styles.controls}>
          {control(muted ? 'mic-off' : 'mic', muted ? 'Unmute' : 'Mute', muted, () => setMuted((v) => !v))}
          {video
            ? control(
                cameraOn ? 'videocam' : 'videocam-off',
                cameraOn ? 'Turn camera off' : 'Turn camera on',
                !cameraOn,
                () => setCameraOn((v) => !v),
              )
            : null}
          {control('volume-high', 'Speaker', speaker, () => setSpeaker((v) => !v))}
          <Pressable
            onPress={end}
            style={[styles.control, styles.end]}
            accessibilityRole="button"
            accessibilityLabel="End call"
          >
            <Ionicons name="call" size={22} color={colors.white} style={styles.endIcon} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary, paddingBottom: 56 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.iconBg,
    borderWidth: 4,
    borderColor: colors.white,
  },
  name: { fontSize: 22, fontWeight: '700', color: colors.white, marginTop: 20, textAlign: 'center' },
  status: { fontSize: 15, color: colors.white, marginTop: 8 },
  hint: { fontSize: 12, color: colors.iconBg, marginTop: 6 },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: 18 },
  control: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlOn: { backgroundColor: colors.white },
  end: { backgroundColor: colors.error },
  endIcon: { transform: [{ rotate: '135deg' }] },
});
