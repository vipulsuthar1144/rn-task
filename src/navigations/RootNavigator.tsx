import { SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import BottomTabs from './BottomTabs';
import { useTheme } from '@/config/provider/ThemeProvider';
import { useUserProvider } from '@/config/provider/UserProvider';

export type RootStackParamList = {
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isLoggedIn } = useUserProvider();
  const { theme } = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.primary }]}
    >
      <NavigationContainer>
        {isLoggedIn ? (
          <Stack.Navigator
            initialRouteName="Dashboard"
            screenOptions={{ animation: 'slide_from_right' }}
          >
            <Stack.Screen
              name="Dashboard"
              component={BottomTabs}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RootNavigator;
