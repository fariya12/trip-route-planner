import { images } from '../../assets';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Polyline, Rect } from 'react-native-svg';
import type { Location } from '../../types/location';
import type { RoutePreview } from '../../types/trip';
import { homeToOfficePreview } from '../../data/mockRoutes';
import { tripTheme as t } from '../../constants/tripTheme';

interface Props {
  origin: Location;
  destination: Location;
  preview?: RoutePreview;
  height?: number;
  alternateLayer?: boolean;
}

/** Original schematic artwork, drawn locally. Not map tiles or verified geography. */
export function MockRouteMap({ origin, destination, preview, height = 320, alternateLayer = false }: Props) {
  // This supplied image contains a baked-in Drive route, so never use it for other modes/pairs.
  if (origin.id === 'home' && destination.id === 'office' && preview === homeToOfficePreview.modes?.drive) {
    return <View style={[styles.container, { height }]} accessibilityLabel={`Offline demo map from ${origin.name} to ${destination.name}`}>
      <Image source={images.mapView} style={styles.mapImage} resizeMode="stretch" />
      {alternateLayer ? <View pointerEvents="none" style={styles.alternateTint} /> : null}
      <View pointerEvents="none" style={styles.caption}><Text style={styles.captionText}>Offline illustration · demo route</Text></View>
    </View>;
  }
  const coordinates = [origin.coordinates, ...(preview?.coordinates ?? []), destination.coordinates];
  const minLat = Math.min(...coordinates.map((point) => point.latitude));
  const maxLat = Math.max(...coordinates.map((point) => point.latitude));
  const minLng = Math.min(...coordinates.map((point) => point.longitude));
  const maxLng = Math.max(...coordinates.map((point) => point.longitude));
  const project = (point: Location['coordinates']) => ({
    x: 65 + ((point.longitude - minLng) / (maxLng - minLng || 1)) * 290,
    y: 95 + ((maxLat - point.latitude) / (maxLat - minLat || 1)) * 140,
  });
  const pickup = project(origin.coordinates);
  const dropOff = project(destination.coordinates);
  const routePoints = preview?.coordinates.map((point) => {
    const { x, y } = project(point);
    return `${x},${y}`;
  }).join(' ');
  const land = alternateLayer ? '#A8B4A0' : '#D8D5C5';
  const water = alternateLayer ? '#7196A2' : '#A6C7D3';
  return <View style={[styles.container, { height }]} accessibilityLabel={`Offline schematic map. Pickup ${origin.name}. Destination ${destination.name}. ${preview ? 'Illustrative demo route.' : 'Route preview unavailable.'}`}>
    <Svg width="100%" height="100%" viewBox="0 0 420 340" preserveAspectRatio="none">
      <Rect width="420" height="340" fill={water} />
      <Path d="M0 0H100L112 48 145 72 213 61 282 39 329 49 352 75 389 93 414 133 398 174 359 207 317 231 285 273 251 340H0Z" fill={land} />
      <Path d="M0 300L81 270 132 250 198 202 280 185 339 151 354 104" fill="none" stroke="#F8F7EF" strokeWidth="13" />
      <Path d="M0 116L77 108 146 121 222 109 286 85 348 79" fill="none" stroke="#FFFFFF" strokeWidth="7" />
      <G fill={alternateLayer ? '#8A9F85' : '#C8C5B6'}>
        {Array.from({ length: 6 }, (_, column) => Array.from({ length: 5 }, (_, row) =>
          <Rect key={`${column}-${row}`} x={15 + column * 47} y={133 + row * 39} width="32" height="25" rx="3" />,
        ))}
      </G>
      <G stroke="#F9F8F2" strokeWidth="3" fill="none">
        {[58, 105, 152, 199, 246, 293].map((x) => <Path key={x} d={`M${x} 121V340`} />)}
        {[125, 164, 203, 242, 281, 320].map((y) => <Path key={y} d={`M0 ${y}H315`} />)}
        <Path d="M287 69L320 120 377 116M311 49L337 94 371 155M298 200L352 178 390 132" />
      </G>
      {routePoints ? <>
        <Polyline points={routePoints} fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinejoin="round" />
        <Polyline points={routePoints} fill="none" stroke={t.orange} strokeWidth="4" strokeLinejoin="round" />
      </> : null}
      <G transform={`translate(${pickup.x} ${pickup.y})`}>
        <Circle r="17" fill={t.orange} stroke="#FFFFFF" strokeWidth="2" />
        {preview ? <G stroke="#FFFFFF" strokeWidth="1.4" fill="none">
          <Path d="M-7 3V-6H2L7-1V5H-7Z M2-6V0H7" />
          <Circle cx="-4" cy="5" r="2" fill={t.orange} /><Circle cx="5" cy="5" r="2" fill={t.orange} />
        </G> : <Circle r="5" fill="#FFFFFF" />}
      </G>
      <G transform={`translate(${dropOff.x} ${dropOff.y})`}>
        <Circle r="16" fill={t.text} stroke="#FFFFFF" strokeWidth="2" />
        <Path d="M0 8C-11-2-5-10 0-8C5-10 11-2 0 8Z" stroke="#FFFFFF" strokeWidth="1.4" fill="none" />
        <Circle cy="-2" r="2" fill="#FFFFFF" />
      </G>
    </Svg>
    <View pointerEvents="none" style={styles.caption}><Text style={styles.captionText}>Offline illustration · {preview ? 'demo route' : 'route unavailable'}{alternateLayer ? ' · terrain colors' : ''}</Text></View>
  </View>;
}
const styles = StyleSheet.create({
  mapImage: { width: '100%', height: '100%' },
  alternateTint: { ...StyleSheet.absoluteFill, backgroundColor: '#315B4825' },
  container: { width: '100%', overflow: 'hidden', backgroundColor: '#A6C7D3' },
  caption: { position: 'absolute', top: 66, left: 12, right: 12, alignItems: 'center' },
  captionText: { fontSize: 11, color: t.text, backgroundColor: '#FFFFFFE8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
});
