import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Location } from '../../types/location';
import { TripIcon } from '../common/TripIcon';
import { tripTheme as t } from '../../constants/tripTheme';

interface Props { location: Location; onPress: () => void; disabled?: boolean; selected: boolean; last: boolean }
export function SuggestedLocationRow({ location, onPress, disabled, selected, last }: Props) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`${location.name}, ${location.address}`} accessibilityState={{ disabled, selected }} disabled={disabled} onPress={onPress} style={[styles.row, !last && styles.divider, selected && styles.selected]}>
    <TripIcon name={location.icon ?? 'location'} />
    <View style={styles.details}>
      <Text style={styles.name}>{location.name}</Text>
      <Text style={styles.address}>{location.address}</Text>
    </View>
  </Pressable>;
}
const styles = StyleSheet.create({
  row: { minHeight: 73, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', gap: 14, alignItems: 'center', backgroundColor: t.white },
  divider: { borderBottomWidth: 1, borderBottomColor: t.border },
  selected: { backgroundColor: '#FFF5F0' },
  details: { flex: 1, gap: 4 },
  name: { fontFamily: t.bold, fontSize: 15, lineHeight: 22.5, color: t.text },
  address: { fontFamily: t.regular, fontSize: 13, lineHeight: 19.5, color: t.muted },
});
