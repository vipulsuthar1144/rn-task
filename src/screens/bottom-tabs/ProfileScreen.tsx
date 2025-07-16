import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '@/navigations/BottomTabs';

type Props = BottomTabScreenProps<BottomTabParamList, 'Profile'>;
const ProfileScreen = ({}: Props) => {
  return (
    <View>
      <Text>ProfileScreen</Text>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
