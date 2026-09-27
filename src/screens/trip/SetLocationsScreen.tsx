import { icons } from '../../assets';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, TextInput, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTrip } from '../../hooks/useTrip';
import type { ScreenProps } from '../../navigation/types';
import type { Location } from '../../types/location';
import { areLocationsDistinct, getMockRoute } from '../../utils/routeUtils';
import { coordinateLocation, isSameLocation } from '../../utils/locationUtils';
import { getCurrentLocation, searchLocations } from '../../services/locationService';
import { TripIcon } from '../../components/common/TripIcon';
import { SuggestedLocationRow } from '../../components/location/SuggestedLocationRow';
import { MapSelectionModal } from '../../components/location/MapSelectionModal';
import { tripTheme as t } from '../../constants/tripTheme';

type Field = 'pickup' | 'drop-off';
export default function SetLocationsScreen({ navigation }: ScreenProps<'SetLocations'>) {
  const insets = useSafeAreaInsets();
  const { origin, destination, setOrigin, setDestination, swapLocations, setRoute } = useTrip();
  const [active, setActive] = useState<Field>('pickup');
  // Draft text is not a resolved location; only confirmed selections live in context.
  const [drafts, setDrafts] = useState<Record<Field, string>>({ pickup: '', 'drop-off': '' });
  const pickupInput = useRef<TextInput>(null);
  const dropOffInput = useRef<TextInput>(null);
  const [mapField, setMapField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  const assign = (location: Location, field: Field): boolean => {
    if (isSameLocation(location, field === 'pickup' ? destination : origin)) {
      setError('Pickup and drop-off must be different locations.');
      return false;
    }
    if (field === 'pickup') { setOrigin(location); setActive('drop-off'); }
    else setDestination(location);
    setDrafts((current) => ({ ...current, [field]: '' }));
    Keyboard.dismiss();
    setError(null);
    return true;
  };
  const useCurrent = async () => {
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    setError(null);
    const field = active;
    try {
      const location = await getCurrentLocation();
      if (mounted.current && navigation.isFocused()) assign(location, field);
    } catch (cause) {
      if (mounted.current) setError(cause instanceof Error ? cause.message : 'Unable to get your location. Please try again.');
    } finally {
      pending.current = false;
      if (mounted.current) setLoading(false);
    }
  };
  // Figma Trip Ready is this screen with two valid selections, not a separate route.
  const ready = areLocationsDistinct(origin, destination) && !loading;
  const next = () => {
    if (!ready || !origin || !destination) return;
    const route = getMockRoute(origin, destination);
    if (!route) return;
    setRoute(route);
    navigation.navigate('RouteView');
  };
  const editField = (field: Field, text: string) => {
    setDrafts((current) => ({ ...current, [field]: text }));
    if (field === 'pickup') setOrigin(null); else setDestination(null);
    setActive(field);
    setError(null);
  };
  const clearField = (field: Field) => {
    editField(field, '');
    (field === 'pickup' ? pickupInput : dropOffInput).current?.focus();
  };
  const suggestions = searchLocations(drafts[active]);
  const renderField = (field: Field, location: Location | null) => (
    <View style={styles.fieldRow}>
      <View style={styles.field}>
        <Text onPress={() => (field === 'pickup' ? pickupInput : dropOffInput).current?.focus()} style={[styles.label, active === field && styles.active]}>{field === 'pickup' ? 'Pickup' : 'Drop-off'}</Text>
        <TextInput
          ref={field === 'pickup' ? pickupInput : dropOffInput}
          accessibilityLabel={field === 'pickup' ? 'Pickup location' : 'Drop-off location'}
          accessibilityHint="Type to search saved places, then select a suggestion or choose a map point to confirm."
          editable={!loading}
          value={location?.name ?? drafts[field]}
          onFocus={() => { setActive(field); setError(null); }}
          onChangeText={(text) => editField(field, text)}
          placeholder={field === 'pickup' ? 'Choose a starting point' : 'Choose a destination'}
          placeholderTextColor={t.placeholder}
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          style={[styles.value, styles.input]}
        />
      </View>
      {location || drafts[field].length > 0 ? <Pressable accessibilityRole="button" accessibilityLabel={`Clear ${field}`} disabled={loading} onPress={() => clearField(field)} style={styles.clear}><TripIcon name="close" size={28} /></Pressable> : null}
    </View>
  );
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.screen, { paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }]}>
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" disabled={loading} style={styles.back} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}><TripIcon name="back" /></Pressable>
      <View style={styles.heading}><Text style={styles.title}>Where are you going?</Text><Text style={styles.subtitle}>Step 1 of 2 · Set pickup and drop-off</Text></View>
    </View>
    <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.indicators}><TripIcon name="start" size={10} /><View style={styles.connector} /><TripIcon name="end" size={10} /></View>
        <View style={styles.fields}>{renderField('pickup', origin)}<View style={styles.divider} />{renderField('drop-off', destination)}</View>
        <Pressable accessibilityRole="button" accessibilityLabel="Swap pickup and drop-off" disabled={loading} onPress={() => { swapLocations(); setDrafts((current) => ({ pickup: current['drop-off'], 'drop-off': current.pickup })); Keyboard.dismiss(); setError(null); }} style={styles.swap}><TripIcon name="filter" /></Pressable>
      </View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: loading, busy: loading }} disabled={loading} onPress={useCurrent} style={styles.action}>
          {loading ? <ActivityIndicator color={t.orange} /> : <Image source={icons.currentLocation} style={styles.actionIcon} />}
          <Text style={styles.actionText}>{loading ? 'Locating…' : 'Use current'}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" disabled={loading} onPress={() => { Keyboard.dismiss(); setError(null); setMapField(active); }} style={styles.action}><Image source={icons.map} style={styles.actionIcon} /><Text style={styles.actionText}>Pick on map</Text></Pressable>
      </View>
      {error ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
      <Text style={styles.section}>Set as {active}</Text>
      <View style={styles.list}>
        {suggestions.map((location, index) => <SuggestedLocationRow key={location.id} location={location} disabled={loading} selected={(active === 'pickup' ? origin : destination)?.id === location.id} last={index === suggestions.length - 1} onPress={() => assign(location, active)} />)}
        {suggestions.length === 0 ? <View style={styles.emptyCard}>
          <Text accessibilityLiveRegion="polite" style={styles.emptyText}>No saved places match that. Keep typing to use it as a custom address.</Text>
        </View> : null}
      </View>
    </ScrollView>
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: !ready }} disabled={!ready} onPress={next} style={[styles.next, !ready && styles.nextDisabled]}><Text style={[styles.nextText, !ready && styles.disabledText]}>Next</Text></Pressable>
    </View>
    {mapField ? <MapSelectionModal field={mapField} initialCoordinate={(mapField === 'pickup' ? origin : destination)?.coordinates} onCancel={() => setMapField(null)} onConfirm={(point) => { if (!assign(coordinateLocation(point, 'map'), mapField)) return false; setMapField(null); return true; }} /> : null}
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.background },
  header: { flexDirection: 'row', backgroundColor: t.white, borderBottomWidth: 1, borderBottomColor: t.border, paddingTop: 8, paddingBottom: 20, paddingHorizontal: 10 },
  back: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  heading: { flex: 1, paddingLeft: 6 },
  title: { fontFamily: t.extraBold, fontSize: 26, lineHeight: 32.5, letterSpacing: -0.65, color: t.text },
  subtitle: { fontFamily: t.regular, fontSize: 15, lineHeight: 22.5, color: t.muted, marginTop: 4 },
  content: { padding: 20, paddingBottom: 24 },
  card: { flexDirection: 'row', minHeight: 187, padding: 16, borderRadius: 24, backgroundColor: t.white, borderWidth: 1, borderColor: t.border, boxShadow: '0px 1px 2px rgba(17,31,44,0.04)' },
  indicators: { width: 10, marginTop: 22, marginBottom: 0, alignItems: 'center' },
  connector: { width: 2, flex: 1, marginVertical: 4, backgroundColor: t.border },
  fields: { flex: 1, marginLeft: 12, marginRight: 52 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', minHeight: 76 },
  field: { flex: 1, justifyContent: 'center', paddingVertical: 8 },
  label: { fontFamily: t.extraBold, fontSize: 12, lineHeight: 18, letterSpacing: 0.96, color: t.inactive },
  active: { color: t.orange },
  value: { fontFamily: t.bold, fontSize: 15, lineHeight: 22.5, color: t.text, marginTop: 2 },
  input: { padding: 0, minHeight: 23 },
  emptyCard: { paddingHorizontal: 20, paddingVertical: 24, backgroundColor: t.white },
  emptyText: { fontFamily: t.regular, fontSize: 15, lineHeight: 23, textAlign: 'center', color: t.muted },
  divider: { height: 1, backgroundColor: t.border },
  clear: { width: 32, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  swap: { position: 'absolute', right: 14, top: 36, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  action: { flex: 1, minHeight: 51, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', padding: 8, backgroundColor: t.white, borderWidth: 1, borderColor: t.border, borderRadius: 16, boxShadow: '0px 1px 2px rgba(17,31,44,0.04)' },
  actionIcon: { width: 20, height: 20, resizeMode: 'contain' },
  actionText: { fontFamily: t.bold, fontSize: 14, lineHeight: 21, color: t.text },
  section: { marginTop: 28, marginBottom: 14, fontFamily: t.extraBold, fontSize: 13, lineHeight: 19.5, color: t.inactive },
  list: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: t.border },
  footer: { paddingHorizontal: 20, paddingTop: 16, backgroundColor: t.white, borderTopWidth: 1, borderTopColor: t.border },
  next: { minHeight: 56, borderRadius: 16, backgroundColor: t.orange, alignItems: 'center', justifyContent: 'center' },
  nextDisabled: { backgroundColor: t.border },
  nextText: { fontFamily: t.extraBold, fontSize: 17, lineHeight: 25.5, color: t.white },
  disabledText: { color: t.inactive },
  error: { marginTop: 16, fontFamily: t.regular, fontSize: 14, color: '#AD2323' },
});
