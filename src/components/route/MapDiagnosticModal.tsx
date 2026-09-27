import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions } from 'react-native';
import MapView from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

// Deliberately no markers, polyline, provider override, camera commands or trip state.
// This isolates native map/tile rendering from the route implementation.
export function MapDiagnosticModal({ onClose }: { onClose: () => void }) {
  const { width } = useWindowDimensions();
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [layout, setLayout] = useState('waiting');
  return <Modal animationType="slide" onRequestClose={onClose}>
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Minimal map diagnostic</Text>
        <Text>Runtime: {Constants.executionEnvironment}</Text>
        <Text>Layout: {layout} · ready: {String(ready)} · loaded: {String(loaded)}</Text>
        <MapView
          mapType="standard"
          style={{ width: Math.max(1, width - 40), height: 300 }}
          initialRegion={{ latitude: 25.30, longitude: 51.53, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
          onLayout={({ nativeEvent }) => setLayout(`${nativeEvent.layout.width} × ${nativeEvent.layout.height}`)}
          onMapReady={() => setReady(true)}
          onMapLoaded={() => setLoaded(true)}
        />
        <Text>This map uses fixed Doha coordinates and an explicit 300-point height. It does not use your selected trip.</Text>
        <Text>If this also stays blank, the route polyline and bottom panel are not the cause. Report the ready/loaded values and whether the Google logo or map tiles appear.</Text>
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.button}><Text style={styles.buttonText}>Return to route</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  </Modal>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  button: { padding: 16, borderRadius: 16, backgroundColor: '#F1521F', alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
});
