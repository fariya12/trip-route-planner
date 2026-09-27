import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteMap } from '../../components/route/RouteMap';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '../../components/common/AppButton';
import { TripIcon } from '../../components/common/TripIcon';
import { useTrip } from '../../hooks/useTrip';
import type { ScreenProps } from '../../navigation/types';
import type { TravelMode } from '../../types/trip';
import { areLocationsDistinct, getRoutePreview } from '../../utils/routeUtils';
import { tripTheme as t } from '../../constants/tripTheme';

const modes: readonly TravelMode[] = ['drive', 'ride', 'walk'];
const arrows = { straight: '↑', right: '↱', left: '↰', arrive: '⚑' } as const;

export default function RouteViewScreen({ navigation }: ScreenProps<'RouteView'>) {
  const { origin, destination } = useTrip();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<TravelMode>('drive');
  const [satellite, setSatellite] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [step, setStep] = useState<number | null>(null);
  const preview = origin && destination ? getRoutePreview(origin, destination, mode) : undefined;
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  if (!origin || !destination || !areLocationsDistinct(origin, destination)) {
    return <View style={[styles.missing, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <Text style={styles.duration}>Choose your trip</Text>
      <Text style={styles.description}>Select two different locations to view your route.</Text>
      <AppButton title="Choose locations" onPress={() => navigation.popTo('SetLocations')} />
    </View>;
  }
  const arrival = preview ? new Date(now + preview.durationMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
  const currentStep = step === null ? undefined : preview?.steps[step];
  const canNavigate = Boolean(preview?.steps.length);
  return <View style={[styles.screen, { paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }]}>
    <View style={styles.mapSection}>
      <RouteMap origin={origin} destination={destination} preview={preview} satellite={satellite} />
      <Pressable accessibilityRole="button" accessibilityLabel="Back to Set Locations" style={[styles.mapControl, styles.back]} onPress={() => navigation.popTo('SetLocations')}><TripIcon name="back" /></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={satellite ? 'Show standard map layer' : 'Show alternate map layer'} accessibilityState={{ selected: satellite }} style={[styles.mapControl, styles.layers]} onPress={() => setSatellite((value) => !value)}><TripIcon name="layer" size={24} /></Pressable>
      {preview?.trafficWarning ? <View style={styles.badge}><TripIcon name="heavy" size={18} /><Text style={styles.badgeText}>Demo: {preview.trafficWarning}</Text></View> : null}
      {!preview ? <View style={styles.badge}><Text style={styles.badgeText}>Route preview unavailable · showing stops only</Text></View> : null}
    </View>
    <View style={styles.panel}>
      <View style={styles.handle} />
      <ScrollView style={styles.sheetScroll} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.panelContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>{preview ? 'Fastest route' : 'Route unavailable'}</Text>
        <View style={styles.estimateRow}>
          <Text style={styles.duration}>{preview ? `${preview.durationMinutes} min` : '—'}</Text>
          {preview ? <Text style={styles.estimate}>{preview.distanceKm} km · arrive {arrival}</Text> : null}
        </View>
        <Text style={styles.notice}>{preview ? 'Mock route and estimates · not live traffic or verified roads.' : `No ${mode} route data for these stops. Choose Home → Marina Office Tower for the demo.`}</Text>
        <View style={styles.modes}>
          {modes.map((value) => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: value === mode }} onPress={() => { setStep(null); setMode(value); setNow(Date.now()); }} style={[styles.mode, value === mode && styles.modeActive]}><Text style={[styles.modeText, value === mode && styles.orange]}>{value[0].toUpperCase() + value.slice(1)}</Text></Pressable>)}
        </View>
        <View style={styles.summary}>
          <View style={styles.summaryRow}><TripIcon name="start" size={10} /><View style={styles.summaryDetails}><Text style={styles.name}>{origin.name} · {origin.address}</Text></View></View>
          <View style={styles.summaryRow}><TripIcon name="end" size={10} /><View style={styles.summaryDetails}><Text style={styles.name}>{destination.name} · {destination.address}</Text></View></View>
        </View>
        <Text style={styles.sectionLabel}>Turn by turn</Text>
        {currentStep ? <View accessibilityLiveRegion="polite" style={styles.demo}>
          <Text style={styles.name}>Navigation demo · Step {(step ?? 0) + 1} of {preview?.steps.length}</Text>
          <Text style={styles.description}>{currentStep.instruction}</Text>
          <Text style={styles.description}>Advance manually below. No GPS guidance.</Text>
          <Pressable accessibilityRole="button" onPress={() => setStep(null)} style={styles.stop}><Text style={styles.orange}>Stop demo</Text></Pressable>
        </View> : null}
        {preview?.steps.map((item, index) => <View key={`${index}-${item.instruction}`} style={[styles.directionRow, step === index && styles.highlight]}>
          <View style={styles.directionIcon}><Text style={styles.arrow}>{arrows[item.direction]}</Text></View>
          <View style={styles.directionContent}><Text style={styles.name}>{item.instruction}</Text><Text style={styles.description}>{item.description}</Text></View>
          <Text style={styles.distance}>{item.distance}</Text>
        </View>)}
        {!preview ? <Text style={styles.description}>Directions are unavailable. No road route has been generated for this selection.</Text> : null}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Pressable accessibilityRole="button" accessibilityLabel={step === null ? 'Start demo navigation' : 'Advance demo navigation'} accessibilityState={{ disabled: !canNavigate }} disabled={!canNavigate} style={[styles.start, !canNavigate && styles.disabled]} onPress={() => {
          if (!preview) return;
          setStep((current) => current === null ? 0 : current + 1 < preview.steps.length ? current + 1 : null);
        }}><Text style={styles.startText}>{step === null ? '➤  Start navigation' : step + 1 === preview?.steps.length ? 'Finish demo' : 'Next demo step'}</Text></Pressable>
      </View>
    </View>
  </View>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.background },
  missing: { flex: 1, justifyContent: 'center', padding: 24, gap: 20, backgroundColor: t.background },
  mapSection: { flex: 4, minHeight: 0, width: '100%' },
  mapControl: { position: 'absolute', top: 16, width: 44, height: 44, borderRadius: 16, backgroundColor: t.white, alignItems: 'center', justifyContent: 'center' },
  back: { left: 16 }, layers: { right: 16 },
  badge: { position: 'absolute', bottom: 36, left: 16, maxWidth: '92%', alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 24, backgroundColor: t.text, paddingVertical: 10, paddingHorizontal: 14 },
  badgeText: { flexShrink: 1, fontFamily: t.bold, fontSize: 12, color: t.white },
  panel: { flex: 6, minHeight: 0, marginTop: -16, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: t.white, overflow: 'hidden' },
  handle: { width: 40, height: 4, backgroundColor: t.border, borderRadius: 4, alignSelf: 'center', marginTop: 10, marginBottom: 16 },
  sheetScroll: { flex: 1, minHeight: 0 },
  panelContent: { paddingHorizontal: 20, paddingBottom: 8 },
  sectionLabel: { fontFamily: t.extraBold, fontSize: 13, lineHeight: 20, color: t.inactive },
  estimateRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  duration: { fontFamily: t.extraBold, fontSize: 34, lineHeight: 42, color: t.text },
  estimate: { fontFamily: t.regular, fontSize: 14, color: t.muted },
  notice: { fontFamily: t.regular, fontSize: 12, color: t.muted, marginTop: 4 },
  modes: { flexDirection: 'row', gap: 8, marginVertical: 16 },
  mode: { flex: 1, minHeight: 44, borderRadius: 16, borderWidth: 1, borderColor: t.border, justifyContent: 'center', alignItems: 'center' },
  modeActive: { backgroundColor: '#FDECE4', borderColor: t.orange },
  modeText: { fontFamily: t.bold, fontSize: 14, color: t.text },
  orange: { color: t.orange, fontFamily: t.bold },
  summary: { borderRadius: 18, backgroundColor: t.background, padding: 16, gap: 12, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryDetails: { flex: 1 },
  name: { fontFamily: t.bold, fontSize: 15, lineHeight: 22, color: t.text },
  description: { fontFamily: t.regular, fontSize: 13, lineHeight: 20, color: t.muted },
  directionRow: { flexDirection: 'row', gap: 12, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: t.border },
  directionIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: t.background, alignItems: 'center', justifyContent: 'center' },
  arrow: { fontSize: 22, color: t.text },
  directionContent: { flex: 1, gap: 4 },
  distance: { fontFamily: t.bold, fontSize: 13, color: t.muted },
  demo: { padding: 12, marginTop: 12, borderRadius: 12, backgroundColor: '#FDECE4' },
  highlight: { backgroundColor: '#FFF5F0' },
  stop: { minHeight: 44, justifyContent: 'center' },
  footer: { paddingHorizontal: 20, paddingTop: 14, backgroundColor: t.white },
  start: { minHeight: 56, padding: 12, backgroundColor: t.orange, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  disabled: { backgroundColor: t.inactive },
  startText: { fontFamily: t.extraBold, fontSize: 17, color: t.white },
});
