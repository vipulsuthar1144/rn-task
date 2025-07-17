/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import NetworkProvider from '@/config/provider/NetworkProvider';
import { ThemeProvider } from '@/config/provider/ThemeProvider';
import { UserProvider } from '@/config/provider/UserProvider';
import RootNavigator from '@/navigations/RootNavigator';
import { toastConfig } from '@/utils/toast/toast.config';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import Toast from 'react-native-toast-message';

function App() {
  const scheme = useColorScheme();

  return (
    <ThemeProvider>
      <UserProvider>
        <StatusBar
          barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <NetworkProvider>
          <RootNavigator />
        </NetworkProvider>
        <Toast config={toastConfig} />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
