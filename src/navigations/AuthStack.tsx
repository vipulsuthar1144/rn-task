import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@/screens/auth/LoginScreen';
import OtpScreen from '@/screens/auth/OtpScreen';
import { IUserSchema } from '@/schemas/IUserSchema';

export type AuthStackParamList = {
  Login: undefined;
  OTP: { user: IUserSchema; confimationMessage?: any };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ animation: 'slide_from_right', headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTP" component={OtpScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
