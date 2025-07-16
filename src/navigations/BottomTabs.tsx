import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/bottom-tabs/HomeScreen';
import ProfileScreen from '@/screens/bottom-tabs/ProfileScreen';
import AntDesign from 'react-native-vector-icons/AntDesign';

export type BottomTabParamList = {
  Home: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        animation: 'shift',
        headerShown: true,
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <AntDesign name={iconName} color={color} size={size} />;
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 5,
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: 'Dashboard' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
