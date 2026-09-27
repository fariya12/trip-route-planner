import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import SetLocationsScreen from '../screens/trip/SetLocationsScreen';
import RouteViewScreen from '../screens/trip/RouteViewScreen';
import { StatusBar } from 'react-native';
import { colors } from '../constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
export function RootNavigator() {
  return <Stack.Navigator screenListeners={{ focus: () => { StatusBar.setHidden(false); StatusBar.setBarStyle('dark-content'); }, transitionEnd: () => { StatusBar.setHidden(false); StatusBar.setBarStyle('dark-content'); } }} initialRouteName="Login" screenOptions={{ statusBarStyle: 'dark', statusBarHidden: false, headerTintColor: colors.primary, contentStyle: { backgroundColor: colors.background } }}>
    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Log in', headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register', headerTintColor: '#F1521F', headerStyle: { backgroundColor: '#F3F5F7' }, headerShadowVisible: false, headerTitleStyle: { fontFamily: 'NunitoSans_700Bold' } }} />
    <Stack.Screen name="SetLocations" component={SetLocationsScreen} options={{ title: 'Plan a trip', headerShown: false }} />
    <Stack.Screen name="RouteView" component={RouteViewScreen} options={{ title: 'Route overview', headerShown: false }} />
  </Stack.Navigator>;
}
