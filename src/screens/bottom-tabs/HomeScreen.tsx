import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { ToastUtils } from '@/utils/toast/toastUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppButton from '@/components/ui/Button';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '@/navigations/BottomTabs';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/navigations/RootNavigator';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useAuth } from '@/config/provider/AuthProvider';

const HomeScreen = () => {
  const { logout } = useAuth();
  return (
    <View>
      <Text>HomeScreen</Text>
      <AppButton title="Submit" loading={false} onPress={() => logout()} />
    </View>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({});
