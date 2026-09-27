import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { MockRouteMap } from '../map/MockRouteMap';
import type { Location } from '../../types/location';
import type { RoutePreview } from '../../types/trip';
import { tripTheme as t } from '../../constants/tripTheme';

interface Props {
  origin: Location;
  destination: Location;
  preview?: RoutePreview;
  satellite: boolean;
}

export function RouteMap(props: Props) {
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
  const missingKey = Platform.OS === 'android' && !isExpoGo && !Constants.expoConfig?.extra?.androidMapsConfigured;
  return <MapWithFallback {...props} nativeAvailable={!missingKey} />;
}

function MapWithFallback({ origin, destination, preview, satellite, nativeAvailable }: Props & { nativeAvailable: boolean }) {
  const map = useRef<MapView>(null);
  const [size, setSize] = useState({ width: 0, height: 320 });
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [offline, setOffline] = useState(!nativeAvailable);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (loaded || offline || !nativeAvailable) return;
    const timer = setTimeout(() => setOffline(true), 5000);
    return () => clearTimeout(timer);
  }, [loaded, offline, nativeAvailable, attempt]);
  const fit = useCallback(() => {
    if (!ready || offline || size.width <= 0 || size.height <= 0) return;
    map.current?.fitToCoordinates([origin.coordinates, ...(preview?.coordinates ?? []), destination.coordinates], {
      edgePadding: { top: Math.min(64, size.height * 0.2), bottom: Math.min(80, size.height * 0.25), left: 40, right: 40 }, animated: false,
    });
  }, [origin, destination, preview, ready, offline, size]);
  useEffect(() => {
    const frame = requestAnimationFrame(fit);
    return () => cancelAnimationFrame(frame);
  }, [fit]);
  const useOffline = offline || !nativeAvailable;
  return <View style={styles.container} onLayout={({ nativeEvent: { layout } }) => {
    setSize((current) => current.width === layout.width && current.height === layout.height ? current : { width: layout.width, height: layout.height });
  }}>
    {/* Always render local artwork while tiles load: no blank frame or indefinite spinner. */}
    {!loaded || useOffline ? <MockRouteMap origin={origin} destination={destination} preview={preview} height={size.height} alternateLayer={satellite} /> : null}
    {!useOffline && size.width > 0 && size.height > 0 ? <MapView
      key={attempt} ref={map} style={[styles.nativeMap, { width: size.width, height: size.height, opacity: loaded ? 1 : 0.01 }]}
      pointerEvents={loaded ? 'auto' : 'none'}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      mapType={satellite ? 'satellite' : 'standard'} userInterfaceStyle="light"
      initialRegion={{ ...origin.coordinates, latitudeDelta: 0.12, longitudeDelta: 0.12 }}
      onMapReady={() => setReady(true)} onMapLoaded={() => { setLoaded(true); fit(); }} toolbarEnabled={false}
    >
      <Marker coordinate={origin.coordinates} title={`Pickup: ${origin.name}`} description={origin.address} pinColor={t.orange} />
      <Marker coordinate={destination.coordinates} title={`Drop-off: ${destination.name}`} description={destination.address} pinColor={t.text} />
      {preview ? <Polyline key={preview.durationMinutes} coordinates={preview.coordinates} strokeColor={t.orange} strokeWidth={6} zIndex={10} /> : null}
    </MapView> : null}
    {nativeAvailable ? <Pressable accessibilityRole="button" accessibilityLabel={useOffline ? 'Retry online map' : 'Use offline map'} style={styles.switch} onPress={() => {
      if (!useOffline) { setOffline(true); return; }
      setLoaded(false); setReady(false); setAttempt((value) => value + 1); setOffline(false);
    }}><Text style={styles.switchText}>{useOffline ? 'Try online map' : loaded ? 'Use offline map' : 'Keep offline map'}</Text></Pressable> : null}
  </View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', overflow: 'hidden', backgroundColor: '#A6C7D3' },
  nativeMap: { position: 'absolute', top: 0, left: 0 },
  switch: { position: 'absolute', top: 12, left: '25%', right: '25%', minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  switchText: { fontSize: 11, color: t.text, backgroundColor: '#FFFFFFEE', padding: 6, borderRadius: 10 },
});
