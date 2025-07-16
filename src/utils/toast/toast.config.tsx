import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';
const renderCustomToast = ({ text1 }: BaseToastProps) => (
  <View style={styles.container}>
    <Text style={styles.text}>{text1}</Text>
  </View>
);

export const toastConfig = {
  info: renderCustomToast,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'ios' ? 80 : 50,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    zIndex: 9999,
  },
  text: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
  },
});
