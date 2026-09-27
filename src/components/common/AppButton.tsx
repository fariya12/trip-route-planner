import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface Props { title: string; onPress: () => void; disabled?: boolean; style?: StyleProp<ViewStyle>; textStyle?: StyleProp<TextStyle> }
export function AppButton({ title, onPress, disabled = false, style, textStyle }: Props) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.button, style, { opacity: disabled ? 0.45 : pressed ? 0.75 : 1 }]}>
      <Text style={[styles.label, textStyle]}>{title}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: 8, minHeight: 48, alignItems: 'center' },
  label: { color: colors.onPrimary, fontSize: typography.body, fontWeight: '600' },
});
