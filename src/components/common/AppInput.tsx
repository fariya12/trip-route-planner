import { StyleSheet, Text, TextInput, View, type StyleProp, type TextStyle, type TextInputProps } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface Props extends TextInputProps { label: string; error?: string; labelStyle?: StyleProp<TextStyle> }
export function AppInput({ label, error, style, labelStyle, ...props }: Props) {
  return <View style={styles.container}>
    <Text style={[styles.label, labelStyle]}>{label}</Text>
    <TextInput accessibilityLabel={label} placeholderTextColor={colors.muted} {...props} style={[styles.input, error ? styles.invalid : undefined, style]} />
    {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
  </View>;
}
const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  label: { color: colors.text, fontSize: typography.body },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: spacing.md, minHeight: 48, color: colors.text, fontSize: typography.body },
  invalid: { borderColor: colors.error },
  error: { color: colors.error, fontSize: typography.caption },
});
