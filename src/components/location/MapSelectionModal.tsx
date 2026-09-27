import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Coordinates } from '../../types/location';
import { tripTheme as t } from '../../constants/tripTheme';
import { isValidCoordinate } from '../../utils/locationUtils';

interface Props {
  field: 'pickup' | 'drop-off';
  initialCoordinate?: Coordinates;
  onCancel: () => void;
  onConfirm: (coordinate: Coordinates) => boolean;
}

// Mounted afresh on each opening so cancelled selections are never retained.
export function MapSelectionModal({ field, initialCoordinate, onCancel, onConfirm }: Props) {
  const [point, setPoint] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const center = initialCoordinate ?? { latitude: 25.30, longitude: 51.53 };
  return <Modal animationType="slide" onRequestClose={onCancel}>
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Set {field} on map</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Cancel map selection" onPress={onCancel} style={styles.cancel}><Text style={styles.text}>Cancel</Text></Pressable>
      </View>
      <Text style={styles.instructions}>Tap the map to place a pin, then confirm. Drag the pin to adjust it.</Text>
      <MapView style={styles.map} initialRegion={{ ...center, latitudeDelta: 0.08, longitudeDelta: 0.08 }}
        onPress={({ nativeEvent }) => { setPoint(nativeEvent.coordinate); setError(null); }}>
        {point ? <Marker coordinate={point} draggable onDragEnd={({ nativeEvent }) => { setPoint(nativeEvent.coordinate); setError(null); }} /> : null}
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.text}>{point ? `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}` : 'No point selected'}</Text>
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: !point }} disabled={!point} style={[styles.confirm, !point && styles.disabled]}
          onPress={() => {
            if (!point || !isValidCoordinate(point)) return;
            if (!onConfirm(point)) setError('Pickup and drop-off must be different locations.');
          }}><Text style={styles.confirmText}>Confirm {field}</Text></Pressable>
      </View>
    </SafeAreaView>
  </Modal>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.white },
  header: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: t.extraBold, fontSize: 20, color: t.text },
  cancel: { padding: 12, minHeight: 44 },
  text: { fontFamily: t.regular, color: t.text, fontSize: 15 },
  instructions: { paddingHorizontal: 20, paddingBottom: 16, fontFamily: t.regular, color: t.muted },
  map: { flex: 1 },
  footer: { padding: 20, gap: 12 },
  confirm: { minHeight: 56, borderRadius: 16, backgroundColor: t.orange, justifyContent: 'center', alignItems: 'center' },
  confirmText: { color: t.white, fontFamily: t.extraBold, fontSize: 17 },
  disabled: { backgroundColor: t.inactive },
  error: { color: '#AD2323', fontFamily: t.regular },
});
