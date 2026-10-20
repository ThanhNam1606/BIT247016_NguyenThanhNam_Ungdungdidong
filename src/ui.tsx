import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface BtnProps { title: string; onPress: () => void; color?: string; style?: StyleProp<ViewStyle> }
export const Btn = ({ title, onPress, color = '#2563eb', style }: BtnProps) => (
  <TouchableOpacity onPress={onPress} style={[s.btn, { backgroundColor: color }, style]}>
    <Text style={s.btnText}>{title}</Text>
  </TouchableOpacity>
);
interface ChipProps { title: string; active?: boolean; onPress: () => void }
export const Chip = ({ title, active, onPress }: ChipProps) => (
  <TouchableOpacity onPress={onPress} style={[s.chip, active && s.chipOn]}>
    <Text style={active ? { color: '#fff' } : { color: '#111' }}>{title}</Text>
  </TouchableOpacity>
);
export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f5f7', padding: 12 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center', marginRight: 6 },
  btnText: { color: '#fff', fontWeight: '600' },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#e5e7eb', marginRight: 6, marginBottom: 6 },
  chipOn: { backgroundColor: '#2563eb' },
  input: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', padding: 8, marginBottom: 6 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 8, flexDirection: 'row' },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  label: { fontWeight: '600', marginTop: 6, marginBottom: 2 },
  err: { color: '#dc2626', marginBottom: 4 },
  title: { fontSize: 18, fontWeight: '700' },
  thumb: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#ddd', marginRight: 10 },
  tag: { fontSize: 12, color: '#fff', paddingHorizontal: 6, borderRadius: 6, overflow: 'hidden', alignSelf: 'flex-start' },
});
