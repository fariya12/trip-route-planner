import { images } from '../../assets';
import { useState } from 'react';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { tripTheme as t } from '../../constants/tripTheme';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { validateEmail, validatePassword } from '../../utils/validation';
import type { ScreenProps } from '../../navigation/types';

export default function RegisterScreen({ navigation }: ScreenProps<'Register'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const submit = () => {
    setSubmitted(true);
    if (emailError || passwordError) return;
    setPassword('');
    navigation.goBack();
  };
  return <ScreenContainer>
    <Image source={images.logo} style={styles.logo} accessibilityLabel="Wayfare logo" />
    <Text accessibilityRole="header" style={styles.title}>Create an account</Text>
    <Text style={styles.subtitle}>Demo only. Use a sample email and password. No account is created or authenticated.</Text>
    <AppInput style={styles.input} labelStyle={styles.label} placeholder="you@example.com" placeholderTextColor={t.placeholder} label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="off" error={submitted ? emailError : undefined} />
    <AppInput style={styles.input} labelStyle={styles.label} placeholder="Enter your password" placeholderTextColor={t.placeholder} label="Password" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" autoCorrect={false} autoComplete="off" error={submitted ? passwordError : undefined} onSubmitEditing={submit} />
    <AppButton style={styles.button} textStyle={styles.buttonText} title="Register demo and return to login" onPress={submit} />
    <View style={styles.loginRow}>
      <Text style={styles.subtitle}>Already have an account?</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Back to login" onPress={() => navigation.goBack()} style={styles.loginLink}><Text style={styles.linkText}>Log in</Text></Pressable>
    </View>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  logo: { width: 56, height: 56, marginTop: 8, marginBottom: 8 },
  title: { fontFamily: t.extraBold, fontSize: 32, lineHeight: 36.8, letterSpacing: -0.8, color: t.text },
  subtitle: { fontFamily: t.regular, fontSize: 15, lineHeight: 24, color: t.muted },
  label: { fontFamily: t.bold, fontSize: 15, color: t.text },
  input: { backgroundColor: t.white, borderColor: t.border, borderRadius: 16, minHeight: 54, fontFamily: t.regular, fontSize: 15, color: t.text },
  button: { backgroundColor: t.orange, borderRadius: 16, minHeight: 56, justifyContent: 'center', marginTop: 8 },
  buttonText: { fontFamily: t.extraBold, fontWeight: 'normal', fontSize: 17, color: t.white },
  loginRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 4 },
  loginLink: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 },
  linkText: { fontFamily: t.bold, fontSize: 15, color: t.orange },
});
