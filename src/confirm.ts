import { Alert, Platform } from 'react-native';

// Hộp thoại xác nhận chạy được trên cả web và mobile
export function confirmAction(
  title: string, message: string, okText: string, cancelText: string, onOk: () => void,
): void {
  if (Platform.OS === 'web') {
    if ((globalThis as any).confirm(`${title}\n${message}`)) onOk();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel' },
    { text: okText, style: 'destructive', onPress: onOk },
  ]);
}

// Thông báo ngắn (Alert.alert cũng không hiện trên web)
export function notify(message: string): void {
  if (Platform.OS === 'web') (globalThis as any).alert(message);
  else Alert.alert(message);
}