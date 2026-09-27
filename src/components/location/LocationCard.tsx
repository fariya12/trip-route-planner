import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Location } from '../../types/location';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface Props { location: Location; selected?: boolean; disabled?: boolean; onPress?: () => void }
export function LocationCard({ location, selected = false, disabled = false, onPress }: Props) {
  const content = <><Text style={styles.name}>{location.name}{selected ? ' • Selected' : ''}</Text><Text style={styles.address}>{location.address}</Text>{disabled ? <Text style={styles.address}>Already selected for the other stop</Text> : null}</>;
  const style = [styles.card, selected && styles.selected, disabled && styles.disabled];
  return onPress ? <Pressable accessibilityRole="button" accessibilityState={{ selected, disabled }} disabled={disabled} onPress={onPress} style={style}>{content}</Pressable> : <View style={style}>{content}</View>;
}
const styles = StyleSheet.create({
  card: { padding: spacing.md, gap: spacing.xs, borderWidth: 1, borderColor: colors.border, borderRadius: 8 },
  selected: { borderColor: colors.primary, backgroundColor: colors.surface },
  disabled: { opacity: 0.5 },
  name: { fontSize: typography.body, color: colors.text, fontWeight: '600' },
  address: { fontSize: typography.caption, color: colors.muted },
});
