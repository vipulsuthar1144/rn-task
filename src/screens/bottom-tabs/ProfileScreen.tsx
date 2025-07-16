import { Alert, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '@/navigations/BottomTabs';
import { useAuth } from '@/config/provider/AuthProvider';
import { ToastUtils } from '@/utils/toast/toastUtils';
import AppButton from '@/components/ui/Button';

type Props = BottomTabScreenProps<BottomTabParamList, 'Profile'>;

const ProfileScreen = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            ToastUtils.show('Logged out');
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Profile</Text>

      {/* Replace this with real user info later */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>user@example.com</Text>
      </View>

      <AppButton
        title="Logout"
        onPress={handleLogout}
        buttonStyle={styles.logoutBtn}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  infoBox: {
    marginBottom: 40,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginTop: 4,
  },
  logoutBtn: {
    marginTop: 16,
  },
});
