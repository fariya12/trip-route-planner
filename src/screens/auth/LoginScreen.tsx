import { icons, images } from '../../assets';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { NunitoSans_400Regular } from '@expo-google-fonts/nunito-sans/400Regular';
import { NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans/700Bold';
import { NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans/800ExtraBold';
import { validateEmail, validatePassword } from '../../utils/validation';
import type { ScreenProps } from '../../navigation/types';
import { useTrip } from '../../hooks/useTrip';
import { mockLogin } from '../../services/authService';

const palette = {
  background: '#F3F5F7', text: '#111F2C', muted: '#7C8B99',
  orange: '#F1521F', border: '#E6EBEF', placeholder: '#98A2B3', white: '#FFFFFF',
};

export default function LoginScreen({ navigation }: ScreenProps<'Login'>) {
  const insets = useSafeAreaInsets();
  const passwordInput = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [authError, setAuthError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionPending = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  const [fontsLoaded, fontError] = useFonts({
    NunitoSans_400Regular, NunitoSans_700Bold, NunitoSans_800ExtraBold,
  });
  const { resetTrip } = useTrip();
  const changeEmail = (value: string) => {
    setEmail(value);
    setAuthError(undefined);
    setEmailError((current) => current ? validateEmail(value) : undefined);
  };
  const changePassword = (value: string) => {
    setPassword(value);
    setAuthError(undefined);
    setPasswordError((current) => current ? validatePassword(value) : undefined);
  };
  const submit = async () => {
    // The ref closes the gap before React renders the disabled button.
    if (submissionPending.current) return;
    const normalizedEmail = email.trim();
    const nextEmailError = validateEmail(normalizedEmail);
    const nextPasswordError = validatePassword(password);
    setEmail(normalizedEmail);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setAuthError(undefined);
    Keyboard.dismiss();
    if (nextEmailError || nextPasswordError) return;

    submissionPending.current = true;
    setIsSubmitting(true);
    try {
      await mockLogin({ email: normalizedEmail, password });
      if (!mounted.current || !navigation.isFocused()) return;
      setPassword('');
      resetTrip();
      navigation.reset({ index: 0, routes: [{ name: 'SetLocations' }] });
    } catch {
      if (mounted.current) setAuthError('Unable to log in. Please try again.');
    } finally {
      submissionPending.current = false;
      if (mounted.current) setIsSubmitting(false);
    }
  };

  if (!fontsLoaded && !fontError) {
    return <View style={styles.loading}><ActivityIndicator color={palette.orange} accessibilityLabel="Loading login" /></View>;
  }

  return (
    // Android already resizes the window for the keyboard. Applying a second
    // height adjustment here causes the form/footer to jump on input focus.
    <KeyboardAvoidingView style={styles.screen} enabled={Platform.OS === 'ios'} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 32, paddingLeft: insets.left + 24, paddingRight: insets.right + 24 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Image source={images.logo} style={styles.logo} accessibilityLabel="Wayfare logo" />
        <Text accessibilityRole="header" style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to plan a trip and follow your route turn by turn.</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, emailError && styles.invalid]}>
              <TextInput
                accessibilityLabel="Email" style={styles.input} placeholder="you@example.com"
                placeholderTextColor={palette.placeholder} value={email} onChangeText={changeEmail} editable={!isSubmitting}
                autoCapitalize="none" autoCorrect={false} keyboardType="email-address"
                autoComplete="email" returnKeyType="next" onSubmitEditing={() => passwordInput.current?.focus()}
                submitBehavior="submit"
              />
            </View>
            {emailError ? <Text accessibilityLiveRegion="polite" style={styles.error}>{emailError}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, passwordError && styles.invalid]}>
              <TextInput
                ref={passwordInput} accessibilityLabel="Password" style={styles.input}
                placeholder="Enter your password" placeholderTextColor={palette.placeholder}
                value={password} onChangeText={changePassword} editable={!isSubmitting} secureTextEntry={!passwordVisible}
                autoCapitalize="none" autoCorrect={false} autoComplete="current-password"
                returnKeyType="done" onSubmitEditing={submit}
              />
              <Pressable
                accessibilityRole="button" accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                accessibilityState={{ selected: passwordVisible }}
                onPress={() => setPasswordVisible((visible) => !visible)} style={styles.visibility}
              >
                <Image source={icons.visible} style={styles.eye} />
                {passwordVisible ? <View style={styles.eyeSlash} /> : null}
              </Pressable>
            </View>
            {passwordError ? <Text accessibilityLiveRegion="polite" style={styles.error}>{passwordError}</Text> : null}
          </View>
        </View>

        <Pressable
          accessibilityRole="button" style={styles.forgotButton}
          onPress={() => Alert.alert('Password recovery', 'Password recovery is not connected in this demo. Use any valid sample email and a password with at least 6 characters to log in.')}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16), paddingLeft: insets.left + 24, paddingRight: insets.right + 24 }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Log in" accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }} disabled={isSubmitting} onPress={submit} style={({ pressed }) => [styles.loginButton, pressed && styles.pressed]}>
          {isSubmitting ? <ActivityIndicator color={palette.white} accessibilityLabel="Logging in" /> : <Text style={styles.loginText}>Log in</Text>}
        </Pressable>
        {authError ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>{authError}</Text> : null}
        <View style={styles.registerRow}>
          <Text style={styles.registerPrompt}>New to Wayfare?</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Create an account" accessibilityState={{ disabled: isSubmitting }} disabled={isSubmitting} onPress={() => navigation.navigate('Register')} style={styles.registerButton}>
            <Text style={styles.registerText}>Create an account</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  loading: { flex: 1, backgroundColor: palette.background, justifyContent: 'center', alignItems: 'center' },
  content: { flexGrow: 1, paddingBottom: 24 },
  logo: { width: 56, height: 56, resizeMode: 'contain' },
  title: { marginTop: 24, fontFamily: 'NunitoSans_800ExtraBold', fontSize: 32, lineHeight: 36.8, letterSpacing: -0.8, color: palette.text },
  subtitle: { marginTop: 8, fontFamily: 'NunitoSans_400Regular', fontSize: 15, lineHeight: 24.38, color: palette.muted },
  form: { marginTop: 32, gap: 20 },
  field: { gap: 8 },
  label: { fontFamily: 'NunitoSans_700Bold', fontSize: 15, lineHeight: 22.5, color: palette.text },
  inputContainer: { flexDirection: 'row', alignItems: 'center', minHeight: 54, borderRadius: 16, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.white, boxShadow: '0px 1px 2px rgba(17, 31, 44, 0.04)' },
  input: { flex: 1, minWidth: 0, minHeight: 52, paddingLeft: 44, paddingRight: 16, paddingVertical: 12, fontFamily: 'NunitoSans_400Regular', fontSize: 15, color: palette.text },
  visibility: { width: 44, minHeight: 52, marginRight: 5, justifyContent: 'center', alignItems: 'center' },
  eye: { width: 18, height: 18, resizeMode: 'contain' },
  eyeSlash: { position: 'absolute', width: 22, height: 2, backgroundColor: palette.muted, transform: [{ rotate: '-45deg' }] },
  invalid: { borderColor: '#AD2323' },
  error: { fontFamily: 'NunitoSans_400Regular', fontSize: 13, color: '#AD2323' },
  forgotButton: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center', marginTop: 10 },
  forgotText: { fontFamily: 'NunitoSans_700Bold', fontSize: 14, lineHeight: 21, color: palette.orange },
  footer: { paddingTop: 16, backgroundColor: palette.white, borderTopWidth: 1, borderTopColor: palette.border },
  loginButton: { minHeight: 56, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.orange },
  pressed: { opacity: 0.8 },
  loginText: { fontFamily: 'NunitoSans_800ExtraBold', fontSize: 18, lineHeight: 27, color: palette.white },
  registerRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: 3, marginTop: 6 },
  registerPrompt: { fontFamily: 'NunitoSans_400Regular', fontSize: 14, lineHeight: 21, color: palette.muted },
  registerButton: { minHeight: 44, justifyContent: 'center' },
  registerText: { fontFamily: 'NunitoSans_700Bold', fontSize: 14, lineHeight: 21, color: palette.text },
});
