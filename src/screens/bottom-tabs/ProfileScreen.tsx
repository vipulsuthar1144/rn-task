import {
  Alert,
  StyleSheet,
  Text,
  View,
  Switch,
  useColorScheme,
} from 'react-native';
import React from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '@/navigations/BottomTabs';
import { ToastUtils } from '@/utils/toast/toastUtils';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/config/provider/ThemeProvider';
import { useUserProvider } from '@/config/provider/UserProvider';

type Props = BottomTabScreenProps<BottomTabParamList, 'Profile'>;

const ProfileScreen = () => {
  const { logout, user, selectedRole } = useUserProvider();
  const { theme, toggleTheme } = useTheme();

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
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.heading, { color: theme.colors.text }]}>
        My Profile
      </Text>

      <View style={styles.infoBox}>
        <Text style={[styles.label, { color: theme.colors.subtext }]}>
          Name:
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {user?.name}
        </Text>
        <Text style={[styles.label, { color: theme.colors.subtext }]}>
          Phone:
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {user?.phone_number}
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {selectedRole.toUpperCase()}
        </Text>
      </View>

      <View style={styles.switchRow}>
        <Text style={[styles.label, { color: theme.colors.subtext }]}>
          Dark Mode
        </Text>
        <Switch value={theme.dark} onValueChange={toggleTheme} />
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
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  logoutBtn: {
    marginTop: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
});
