import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import BottomTabs from './BottomTabs';
import LoginScreen from '@/screens/auth/LoginScreen';
import { useAuth } from '@/config/provider/AuthProvider';

export type RootStackParamList = {
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isLoggedIn } = useAuth();
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={{ animation: 'slide_from_right' }}
        >
          {/* <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        /> */}
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
  );
};

export default RootNavigator;
