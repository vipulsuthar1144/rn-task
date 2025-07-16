/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { AuthProvider } from '@/config/provider/AuthProvider';
import RootNavigator from '@/navigations/RootNavigator';
import { toastConfig } from '@/utils/toast/toast.config';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <RootNavigator />
      </SafeAreaView>
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
