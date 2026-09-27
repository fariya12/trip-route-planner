import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform, StatusBar as NativeStatusBar } from 'react-native';

function showDarkStatusBar() {
  NativeStatusBar.setHidden(false);
  NativeStatusBar.setBarStyle('dark-content');
  // Older Android versions use a system-owned bar; newer versions draw over the app.
  if (Platform.OS === 'android' && Number(Platform.Version) < 35) {
    NativeStatusBar.setBackgroundColor('#F3F5F7');
  }
}

import { TripProvider } from './src/context/TripContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F3F5F7' }}>
    <TripProvider>
      <NavigationContainer onReady={showDarkStatusBar} onStateChange={showDarkStatusBar}>
        <StatusBar style="dark" hidden={false} />
        {Platform.OS === 'android' && Number(Platform.Version) < 35 ? <NativeStatusBar barStyle="dark-content" backgroundColor="#F3F5F7" hidden={false} /> : null}
        <RootNavigator />
      </NavigationContainer>
    </TripProvider>
  </SafeAreaProvider>;
}
